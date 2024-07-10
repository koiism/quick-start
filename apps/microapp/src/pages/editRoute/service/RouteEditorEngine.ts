// @ts-ignore
import { createPIXI } from '@/utils/pixi/pixi.miniprogram';
import { unsafeEval } from '@/utils/pixi/unsafeEval';
import { useTaroNode } from '@/utils/hooks/useTaroRect';
import { Ref, computed, reactive, ref } from 'vue';
import { HOLD_TYPE, THold } from '@/server/router/zods/route';
import { Hold } from './Hold';

export enum CANVAS_MODE {
  VIEW,
  INSERT,
  EDIT,
}

export const holdColorMap = {
  [HOLD_TYPE.START_END]: 0xfde68a,
  [HOLD_TYPE.MIDDLE]: 0xa5f3fc,
  [HOLD_TYPE.FOOT]: 0xa5f3fc,
};

// TODO: DELETE 模式
// TODO: 限制缩放和拖拽
// TODO: 贴胶带
export default class RouteEditorEngine {
  PIXI: any;
  stage: any;
  wall: any;
  removeEditingHold: () => void = this._removeEditingHold.bind(this);
  modeText = computed(() => {
    switch (this.mode) {
      case CANVAS_MODE.VIEW:
        return '查看';
      case CANVAS_MODE.INSERT:
        return '插入';
      case CANVAS_MODE.EDIT:
        return '编辑';
      default:
        return '查看';
    }
  });
  selectedHold = computed({
    get: () => {
      if (this.mode === CANVAS_MODE.INSERT) {
        return this._selectedHoldType.value;
      }
      return;
    },
    set: (value) => {
      if (value === undefined) {
        this.mode = CANVAS_MODE.VIEW;
      } else {
        this.mode = CANVAS_MODE.INSERT;
      }
      this._selectedHoldType.value = value;
    },
  });
  _canvas: any;
  _schema = Hold.allHolds;
  _maskSprite: any;
  _selectedHoldType: Ref<HOLD_TYPE | undefined> = ref();
  _defaultHoldSize: number = 50;
  _mode: Ref<CANVAS_MODE | undefined> = ref();
  _lastMode: Ref<CANVAS_MODE | undefined> = ref();
  _editSchemaIndex: Ref<number> = ref(-1);
  _eventTap: boolean = true;
  _wallInfo: {
    initialScale?: { _x: number; _y: number };
  } = reactive({});
  _editingHoldInfo: {
    initialSize?: number;
    initialPosition?: { x: number; y: number };
  } = reactive({});
  _zoomProcess: {
    initialTouchDistance?: number;
    zoomStart?: boolean;
  } = reactive({});
  _clickOffset?: { x: number; y: number };
  _zoomStart: boolean = false;
  removeListener: () => void;
  removeHoldListener: () => void;
  eventDispatcher: (e) => void = this._eventDispatcher.bind(this);
  constructor(
    private canvasRef: (Element | Window | any) | Ref<Element | Window | any>
  ) {}
  public async initWorld() {
    const canvas = await useTaroNode(this.canvasRef);
    this._canvas = canvas;
    this.PIXI = createPIXI(canvas, canvas.width);
    unsafeEval(this.PIXI);
    const renderer = this.PIXI.autoDetectRenderer({
      width: canvas.width,
      height: canvas.height,
      backgroundAlpha: 1,
      premultipliedAlpha: true,
      preserveDrawingBuffer: true,
      view: canvas,
      backgroundColor: 0x1a1a1a,
    });
    const stage = new this.PIXI.Container();
    stage.eventMode = 'static';
    stage.hitArea = new this.PIXI.Rectangle(0, 0, canvas.width, canvas.height);
    this.stage = stage;
    const animate = () => {
      canvas.requestAnimationFrame(animate);
      this.renderSchema();
      renderer.render(stage);
    };
    animate();
  }
  public initWall = (wallImg: string) => {
    const image = this._canvas.createImage();
    image.src = wallImg;
    image.onload = () => {
      const wall = this.PIXI.Sprite.from(image);
      wall.eventMode = 'static';
      this.wall = wall;
      this.stage.addChild(wall);
      this.mode = CANVAS_MODE.VIEW;
      this.drawWallMask();
      this.loadSchema([]);
    };
    image.onerror = (e) => {
      console.error(e);
    };
  };
  private pointToWall({ x, y }: { x: number; y: number }) {
    return {
      x: x - (this.wall.anchor._x * this.wall.width) / this.wall.scale.x,
      y: y - (this.wall.anchor._y * this.wall.height) / this.wall.scale.y,
    };
  }
  private loadSchema(schema: THold[]) {
    schema.map((hold) => {
      return new Hold(this, hold);
    });
    this.renderSchema();
  }
  private renderSchema() {
    if (!this.wall) {
      return;
    }
    // 清空墙
    this.wall.removeChildren();
    if (this._schema.size) {
      this.wall.addChild(this._maskSprite);
      this._schema.forEach((hold) => {
        this.updateWallMask();
        hold.update();
      });
      this._schema.forEach((hold) => {
        if (hold.isEdit() && this.mode === CANVAS_MODE.EDIT) {
          this.wall.addChild(hold.holdStrokeEdit);
        } else {
          this.wall.addChild(hold.holdStroke);
        }
      });
      this._schema.forEach((hold) => {
        this.wall.addChild(hold.holdSprite);
      });
    }
  }
  private drawWallMask() {
    // 绘制蒙层
    const maskSprite = new this.PIXI.Sprite(this.PIXI.Texture.WHITE);
    maskSprite.tint = 0x000000;
    maskSprite.alpha = 0.5;
    this._maskSprite = maskSprite;
  }
  private updateWallMask() {
    const maskSprite = this._maskSprite;
    maskSprite.width = this.wall.width / this.wall.scale.x;
    maskSprite.height = this.wall.height / this.wall.scale.y;
    const { x: worldX, y: worldY } = this.pointToWall({ x: 0, y: 0 });
    maskSprite.position.set(worldX, worldY);
  }
  private _removeEditingHold() {
    Hold.editingTarget?.remove();
    this.restoreLastMode();
  }
  private _eventDispatcher(e) {
    const eventType = e.type;
    switch (eventType) {
      case 'touchstart':
        this._eventTap = true;
        this._zoomStart = false;
        break;
      case 'touchmove':
        this._eventTap = false;
        break;
      case 'touchend':
        break;
    }
    if (
      e.touches.length == 0 ||
      (e.touches.length == 1 && eventType !== 'touchend')
    ) {
      this.PIXI.dispatchEvent(e);
    } else if (e.touches.length > 1) {
      this.onZoom(e);
    }
  }

  get mode() {
    return this._mode.value;
  }
  set mode(value) {
    if (this._mode.value === value) return;
    this._lastMode.value = this._mode.value;
    this._mode.value = value;
    this.listenMode();
    this.listenHold();
  }
  public restoreLastMode() {
    this.mode = this._lastMode.value ?? CANVAS_MODE.VIEW;
  }
  public onZoom(e) {
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    if (!this._zoomStart) {
      this._zoomProcess.initialTouchDistance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );
      this._zoomStart = true;
      const centerPoint = {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2,
      };
      const localPoint = this.wall.toLocal(centerPoint);
      this._clickOffset = {
        x: localPoint.x * this.wall.scale.x,
        y: localPoint.y * this.wall.scale.y,
      };
      this.wall.anchor.set(
        (localPoint.x * this.wall.scale.x) / this.wall.width +
          this.wall.anchor._x,
        (localPoint.y * this.wall.scale.y) / this.wall.height +
          this.wall.anchor._y
      );
      this.wall.position.copyFrom({
        x: centerPoint.x,
        y: centerPoint.y,
      });
      switch (this.mode) {
        case CANVAS_MODE.VIEW:
          this.onViewModeZoomStart(e);
          break;
        case CANVAS_MODE.INSERT:
          this.onInsertModeZoomStart(e);
          break;
        case CANVAS_MODE.EDIT:
          this.onEditModeZoomStart(e);
          break;
      }
      return;
    }
    const scaleFactor = this.calculateZoomScaleFactor(e);
    switch (this.mode) {
      case CANVAS_MODE.VIEW:
        this.onViewModeZoom(scaleFactor);
        break;
      case CANVAS_MODE.INSERT:
        this.onInsertModeZoom(scaleFactor);
        break;
      case CANVAS_MODE.EDIT:
        this.onEditModeZoom(scaleFactor);
        break;
    }
  }
  private calculateZoomScaleFactor(e) {
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    const currentTouchDistance = Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    );
    const scaleFactor =
      currentTouchDistance / (this._zoomProcess.initialTouchDistance || 1);
    return scaleFactor;
  }
  private wallDragObserver() {
    const onTouchStart = (event) => {
      const localPoint = this.wall.toLocal(event.data.global);
      this._clickOffset = {
        x: localPoint.x * this.wall.scale.x,
        y: localPoint.y * this.wall.scale.y,
      };
      this.wall.anchor.set(
        (localPoint.x * this.wall.scale.x) / this.wall.width +
          this.wall.anchor._x,
        (localPoint.y * this.wall.scale.y) / this.wall.height +
          this.wall.anchor._y
      );
      this.wall.position.copyFrom({
        x: event.global.x,
        y: event.global.y,
      });
      this._wallInfo.initialScale = Object.assign({}, this.wall.scale);
    };
    const onTouchMove = (event) => {
      if (this.wall && this._clickOffset && !this._zoomStart) {
        this.wall.position.copyFrom({
          x: event.global.x,
          y: event.global.y,
        });
      }
    };
    const onTouchEnd = () => {
      this._wallInfo = {};
    };

    this.stage.on('pointermove', onTouchMove);
    this.stage.on('pointerup', onTouchEnd);
    this.stage.on('pointerupoutside', onTouchEnd);
    this.stage.on('pointerdown', onTouchStart);
    const removeListener = () => {
      this.stage.off('pointermove', onTouchMove);
      this.stage.off('pointerup', onTouchEnd);
      this.stage.off('pointerupoutside', onTouchEnd);
      this.stage.off('pointerdown', onTouchStart);
    };
    return removeListener;
  }
  private listenMode() {
    this.removeListener?.();
    if (this.mode === CANVAS_MODE.VIEW) {
      this.listenViewMode();
    } else if (this.mode === CANVAS_MODE.INSERT) {
      this.listenInsertMode();
    } else if (this.mode === CANVAS_MODE.EDIT) {
      this.listenEditMode();
    }
  }
  private listenHold() {
    this._schema.forEach((hold) => {
      hold.listenHold();
    });
  }
  private listenViewMode() {
    const unobserve = this.wallDragObserver();
    this.removeListener = () => {
      unobserve();
    };
  }
  private onViewModeZoomStart(_e) {
    this._wallInfo.initialScale = Object.assign({}, this.wall.scale);
  }
  private onViewModeZoom(scaleFactor) {
    const target = this.wall;
    if (target) {
      const initialScale = this._wallInfo.initialScale;
      target.scale.set(
        (initialScale?._x || 1) * scaleFactor,
        (initialScale?._y || 1) * scaleFactor
      );
    }
  }
  private listenInsertMode() {
    const unobserve = this.wallDragObserver();
    const onWallTap = (e) => {
      if (!this._eventTap) return;
      if (this._selectedHoldType.value === undefined) return;

      const schemaX =
        (e.global.x -
          this.wall.position._x +
          this.wall.anchor._x * this.wall.width) /
        this.wall.scale._x;
      const schemaY =
        (e.global.y -
          this.wall.position._y +
          this.wall.anchor._y * this.wall.height) /
        this.wall.scale._y;

      const hold = {
        x: schemaX,
        y: schemaY,
        size: this._defaultHoldSize,
        type: this._selectedHoldType.value,
      };
      const newHold = new Hold(this, hold);
      newHold.edit();

      this.mode = CANVAS_MODE.EDIT;
    };
    this.wall.on('pointerup', onWallTap);
    this.removeListener = () => {
      unobserve();
      this.wall.off('pointerup', onWallTap);
    };
  }
  private onInsertModeZoomStart(_e) {
    this._wallInfo.initialScale = Object.assign({}, this.wall.scale);
  }
  private onInsertModeZoom(scaleFactor) {
    const target = this.wall;
    if (target) {
      const initialScale = this._wallInfo.initialScale;
      target.scale.set(
        (initialScale?._x || 1) * scaleFactor,
        (initialScale?._y || 1) * scaleFactor
      );
    }
  }
  private listenEditMode() {
    const onTouchStart = (event) => {
      const localPoint = this.wall.toLocal(event.data.global);
      this._clickOffset = {
        x: localPoint.x,
        y: localPoint.y,
      };
      this._editingHoldInfo.initialPosition = {
        x: Hold.editingTarget?.x || 0,
        y: Hold.editingTarget?.y || 0,
      };
    };
    const onTouchMove = (event) => {
      const editingTarget = Hold.editingTarget;
      if (editingTarget && !this._zoomStart) {
        const localPoint = this.wall.toLocal(event.global);
        editingTarget.x =
          this._editingHoldInfo.initialPosition?.x +
          localPoint.x -
          (this._clickOffset?.x || 0);
        editingTarget.y =
          this._editingHoldInfo.initialPosition?.y +
          localPoint.y -
          (this._clickOffset?.y || 0);
      }
    };
    const onTouchEnd = () => {
      this._editingHoldInfo = reactive({});
    };

    this.stage.on('pointermove', onTouchMove);
    this.stage.on('pointerup', onTouchEnd);
    this.stage.on('pointerupoutside', onTouchEnd);
    this.stage.on('pointerdown', onTouchStart);
    this.removeListener = () => {
      this.stage.off('pointermove', onTouchMove);
      this.stage.off('pointerup', onTouchEnd);
      this.stage.off('pointerupoutside', onTouchEnd);
      this.stage.off('pointerdown', onTouchStart);
    };
  }
  private onEditModeZoomStart(_e) {
    const target = Hold.editingTarget;
    this._editingHoldInfo.initialSize = target?.size || 1;
  }
  private onEditModeZoom(scaleFactor) {
    const target = Hold.editingTarget;
    if (target) {
      const initialScale = this._editingHoldInfo.initialSize || 100;
      target.size = initialScale * scaleFactor;
    }
  }
}
