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
  DELETE,
}

export const holdColorMap = {
  [HOLD_TYPE.START_END]: 0xfde68a,
  [HOLD_TYPE.MIDDLE]: 0xa5f3fc,
  [HOLD_TYPE.FOOT]: 0xa5f3fc,
};

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
  selectedHoldType = computed({
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
    minScale?: { x: number; y: number };
    minScaleX?: number;
    minScaleY?: number;
    originWidth: number;
    originHeight: number;
  } = reactive({
    originWidth: 0,
    originHeight: 0,
  });
  _eventInfo: {
    eventInitialScale?: { _x: number; _y: number };
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
      this.limitWall();
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
      const { minScale, minScaleX, minScaleY } = this.calculateMinScale();
      this._wallInfo.minScale = { x: minScale, y: minScale };
      this._wallInfo.minScaleX = minScaleX;
      this._wallInfo.minScaleY = minScaleY;
      this._wallInfo.originWidth = image.width;
      this._wallInfo.originHeight = image.height;
      this.wall.scale.set(minScale, minScale);
      this.drawWallMask();
      this.loadSchema([]);
    };
    image.onerror = (e) => {
      console.error(e);
    };
  };
  private pointToWall({ x, y }: { x: number; y: number }) {
    return {
      x: x - this.wall.anchor._x * this._wallInfo.originWidth,
      y: y - this.wall.anchor._y * this._wallInfo.originHeight,
    };
  }
  private limitWall() {
    if (!this.wall) {
      return;
    }
    const scale = this.wall.scale;
    const { x = 0, y = 0 } = this._wallInfo.minScale ?? {};
    this.wall.scale.set(Math.max(scale._x, x), Math.max(scale._y, y));

    const wallCenter = {
      x: this.wall.width / 2,
      y: this.wall.height / 2,
    };
    const worldCenter = {
      x: this._canvas.width / 2,
      y: this._canvas.height / 2,
    };
    const originPoint = {
      x: worldCenter.x - wallCenter.x + this.wall.anchor._x * this.wall.width,
      y: worldCenter.y - wallCenter.y + this.wall.anchor._y * this.wall.height,
    };
    const wallCenterPoint = {
      x:
        this.wall.position.x +
        wallCenter.x -
        this.wall.anchor._x * this.wall.width,
      y:
        this.wall.position.y +
        wallCenter.y -
        this.wall.anchor._y * this.wall.height,
    };
    const vector = {
      x: worldCenter.x - wallCenterPoint.x,
      y: worldCenter.y - wallCenterPoint.y,
    };
    const overWidth = this.wall.width - this._canvas.width;
    const overHeight = this.wall.height - this._canvas.height;

    if (vector.x > overWidth / 2) {
      this.wall.position.x = originPoint.x - overWidth / 2;
    }
    if (vector.x < -overWidth / 2) {
      this.wall.position.x = originPoint.x + overWidth / 2;
    }
    if (vector.y > overHeight / 2) {
      this.wall.position.y = originPoint.y - overHeight / 2;
    }
    if (vector.y < -overHeight / 2) {
      this.wall.position.y = originPoint.y + overHeight / 2;
    }
    if (this.wall.width <= this._canvas.width) {
      this.wall.position.x = originPoint.x;
    }
    if (this.wall.height <= this._canvas.height) {
      this.wall.position.y = originPoint.y;
    }
  }
  private calculateMinScale() {
    // 根据canvas的宽高和wall的宽高计算最小cover缩放比例
    const { width, height } = this.wall;
    const { width: canvasWidth, height: canvasHeight } = this._canvas;
    const minScaleX = (canvasWidth * this.wall.scale._x) / width;
    const minScaleY = (canvasHeight * this.wall.scale._y) / height;
    return {
      minScaleX,
      minScaleY,
      minScale: Math.min(minScaleX, minScaleY),
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
    maskSprite.width = this._wallInfo.originWidth;
    maskSprite.height = this._wallInfo.originHeight;
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
    setTimeout(() => {
      this.listenMode();
    });
    this.listenHold();
  }
  public restoreLastMode = () => {
    this.mode = this._lastMode.value ?? CANVAS_MODE.VIEW;
  };
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
        localPoint.x / this._wallInfo.originWidth + this.wall.anchor._x,
        localPoint.y / this._wallInfo.originHeight + this.wall.anchor._y
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
        default:
          this.onViewModeZoomStart(e);
          break;
      }
      return;
    }
    const scaleFactor = this.calculateZoomScaleFactor(e);
    switch (this.mode) {
      case CANVAS_MODE.VIEW: {
        this.onViewModeZoom(scaleFactor);
        break;
      }
      case CANVAS_MODE.INSERT: {
        this.onInsertModeZoom(scaleFactor);
        break;
      }
      case CANVAS_MODE.EDIT: {
        this.onEditModeZoom(scaleFactor);
        break;
      }
      default: {
        this.onViewModeZoom(scaleFactor);
        break;
      }
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
        localPoint.x / this._wallInfo.originWidth + this.wall.anchor._x,
        localPoint.y / this._wallInfo.originHeight + this.wall.anchor._y
      );
      this.wall.position.copyFrom({
        x: event.global.x,
        y: event.global.y,
      });
      this._eventInfo.eventInitialScale = Object.assign({}, this.wall.scale);
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
      this._eventInfo = {};
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
    switch (this.mode) {
      case CANVAS_MODE.VIEW: {
        this.listenViewMode();
        break;
      }
      case CANVAS_MODE.EDIT: {
        this.listenEditMode();
        break;
      }
      case CANVAS_MODE.INSERT: {
        this.listenInsertMode();
        break;
      }
      default: {
        this.listenViewMode();
        break;
      }
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
    this._eventInfo.eventInitialScale = Object.assign({}, this.wall.scale);
  }
  private onViewModeZoom(scaleFactor) {
    const target = this.wall;
    if (target) {
      const initialScale = this._eventInfo.eventInitialScale;
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
    };
    this.wall.on('pointerup', onWallTap);
    this.removeListener = () => {
      unobserve();
      this.wall.off('pointerup', onWallTap);
    };
  }
  private onInsertModeZoomStart(_e) {
    this._eventInfo.eventInitialScale = Object.assign({}, this.wall.scale);
  }
  private onInsertModeZoom(scaleFactor) {
    const target = this.wall;
    if (target) {
      const initialScale = this._eventInfo.eventInitialScale;
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
      if (this._eventTap) {
        this.restoreLastMode();
      }
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
