// @ts-ignore
import { createPIXI } from '@/utils/pixi/pixi.miniprogram';
import { unsafeEval } from '@/utils/pixi/unsafeEval';
import { useTaroNode } from '@/utils/hooks/useTaroRect';
import { Ref, computed, reactive, ref } from 'vue';
import { HOLD_TYPE, THold } from '@/server/router/zods/route';

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

export default class RouteEditorEngine {
  PIXI: any;
  stage: any;
  wall: any;
  schema: THold[] = [
    {
      x: 100,
      y: 100,
      size: 50,
      type: HOLD_TYPE.FOOT,
    },
    {
      x: 300,
      y: 300,
      size: 50,
      type: HOLD_TYPE.MIDDLE,
    },
    {
      x: 500,
      y: 500,
      size: 50,
      type: HOLD_TYPE.START_END,
    },
  ];
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
  _mode: Ref<CANVAS_MODE | undefined> = ref();
  _lastMode: Ref<CANVAS_MODE | undefined> = ref();
  _editSchemaIndex: Ref<number> = ref(-1);
  _eventTap: boolean = true;
  _wallInfo: {
    clickOffset?: { x: number; y: number };
    initialScale?: { _x: number; _y: number };
    initialTouchDistance?: number;
  } = reactive({});
  _editingHoldInfo: {
    initialSize?: number;
    initialTouchDistance?: number;
  } = reactive({});
  _zoomStart: boolean = false;
  removeListener: () => void;
  eventDispatcher: (e) => void = this._eventDispatcher.bind(this);
  constructor(
    private canvasRef: (Element | Window | any) | Ref<Element | Window | any>
  ) {}
  public async initWorld() {
    const canvas = await useTaroNode(this.canvasRef);
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
    const wall = this.PIXI.Sprite.from(wallImg);
    this.wall = wall;
    this.stage.addChild(wall);
    this.mode = CANVAS_MODE.VIEW;
  };
  private pointToWall({ x, y }: { x: number; y: number }) {
    return {
      x: x - (this.wall.anchor._x * this.wall.width) / this.wall.scale.x,
      y: y - (this.wall.anchor._y * this.wall.height) / this.wall.scale.y,
    };
  }
  private renderSchema() {
    if (!this.wall) {
      return;
    }
    // 清空墙
    this.wall.removeChildren();
    if (this.schema.length) {
      // 绘制蒙层
      const maskSprite = new this.PIXI.Sprite(this.PIXI.Texture.WHITE);
      maskSprite.tint = 0x000000;
      maskSprite.width = this.wall.width / this.wall.scale.x;
      maskSprite.height = this.wall.height / this.wall.scale.y;
      const { x: worldX, y: worldY } = this.pointToWall({ x: 0, y: 0 });
      maskSprite.position.set(worldX, worldY);
      maskSprite.alpha = 0.5;
      this.wall?.addChild(maskSprite);
      // 绘制hold

      const holds: any[] = [];
      const holdStrokes: any[] = [];
      this.schema.forEach((hold, index) => {
        const { holdSprite, holdStroke } = this.generateHold(hold, index);
        holds.push(holdSprite);
        holdStrokes.push(holdStroke);
      });
      holdStrokes.forEach((holdStroke) => {
        this.wall.addChild(holdStroke);
      });
      holds.forEach((holdSprite) => {
        this.wall.addChild(holdSprite);
      });
    }
  }
  private generateHold(hold: THold, index: number) {
    const holdSprite = this.generateHoldSprite(hold, index);
    const holdStroke = this.generateHoldStroke(hold, index);
    return {
      holdSprite,
      holdStroke,
    };
  }
  private generateHoldSprite(hold, index) {
    if (hold.type === HOLD_TYPE.FOOT) {
      return this.generateSquareHoldSprite(hold, index); // 新增的方形绘制函数
    } else {
      return this.generateCircularHoldSprite(hold, index); // 原有的圆形绘制函数
    }
  }
  private generateSquareHoldSprite(hold, index) {
    const originPoint = this.pointToWall({ x: 0, y: 0 });
    const holdSpriteMask = new this.PIXI.Graphics();
    holdSpriteMask.beginFill(0xffffff);
    holdSpriteMask.drawRect(
      hold.x - hold.size / 2,
      hold.y - hold.size / 2,
      hold.size,
      hold.size
    );
    holdSpriteMask.endFill();
    holdSpriteMask.width = hold.size;
    holdSpriteMask.height = hold.size;

    const holdSprite = new this.PIXI.Sprite(this.wall.texture);
    holdSprite.width = this.wall.width / this.wall.scale.x;
    holdSprite.height = this.wall.height / this.wall.scale.y;
    holdSprite.position.set(originPoint.x, originPoint.y);
    holdSprite.mask = holdSpriteMask;
    holdSprite.addChild(holdSpriteMask);
    holdSprite.eventMode = 'static';
    // holdSprite.interactive = true;
    holdSprite.on('pointerdown', () => {
      if (this.mode === CANVAS_MODE.EDIT) {
        this._editSchemaIndex.value = index;
      }
    });
    holdSprite.on('pointerup', () => {
      if (!this._eventTap) return;
      this.mode = CANVAS_MODE.EDIT;
      this._editSchemaIndex.value = index;
    });
    return holdSprite;
  }
  private generateCircularHoldSprite(hold, index) {
    const originPoint = this.pointToWall({ x: 0, y: 0 });
    const holdSpriteMask = new this.PIXI.Graphics();
    holdSpriteMask.beginFill(0xffffff);
    holdSpriteMask.drawCircle(hold.x, hold.y, hold.size / 2);
    holdSpriteMask.endFill();
    holdSpriteMask.width = hold.size;
    holdSpriteMask.height = hold.size;

    const holdSprite = new this.PIXI.Sprite(this.wall.texture);
    holdSprite.width = this.wall.width / this.wall.scale.x;
    holdSprite.height = this.wall.height / this.wall.scale.y;
    holdSprite.position.set(originPoint.x, originPoint.y);
    holdSprite.mask = holdSpriteMask;
    holdSprite.addChild(holdSpriteMask);
    holdSprite.eventMode = 'static';
    holdSprite.on('pointerdown', () => {
      if (this.mode === CANVAS_MODE.EDIT) {
        this._editSchemaIndex.value = index;
      }
    });
    holdSprite.on('pointerup', () => {
      if (!this._eventTap) return;
      this.mode = CANVAS_MODE.EDIT;
      this._editSchemaIndex.value = index;
    });
    return holdSprite;
  }

  private generateHoldStroke(hold, index) {
    if (hold.type === HOLD_TYPE.FOOT) {
      return this.generateSquareHoldStroke(hold, index); // 新增的方形绘制函数
    } else {
      return this.generateCircularHoldStroke(hold, index); // 原有的圆形绘制函数
    }
  }
  private generateSquareHoldStroke(hold, index) {
    const holdPoint = this.pointToWall(hold);
    const holdStroke = new this.PIXI.Graphics();
    const STROKE_WIDTH = 3;
    if (
      this.mode === CANVAS_MODE.EDIT &&
      index === this._editSchemaIndex.value
    ) {
      holdStroke.lineStyle(STROKE_WIDTH, holdColorMap[hold.type], 1);
      // 虚线参数：线段长度和空隙长度
      const dashLength = 3;
      const gapLength = 3;

      // 计算正方形的边长
      const sideLength = hold.size + STROKE_WIDTH;
      // 绘制虚线正方形
      holdStroke.beginFill(0x000000, 0); // 设置填充颜色为透明，确保只有边框
      const numSegments = Math.ceil(sideLength / (dashLength + gapLength));
      for (let i = 0; i < 4; i++) {
        // 四条边
        let x = holdPoint.x - sideLength / 2;
        let y = holdPoint.y - sideLength / 2;
        let dx = 0;
        let dy = 0;
        switch (i) {
          case 0: // 上边
            dx = 1;
            break;
          case 1: // 右边
            x += sideLength;
            dy = 1;
            break;
          case 2: // 下边
            x += sideLength;
            y += sideLength;
            dx = -1;
            break;
          case 3: // 左边
            y += sideLength;
            dy = -1;
            break;
        }
        for (let j = 0; j < numSegments; j++) {
          holdStroke.moveTo(x, y);
          x += dx * dashLength;
          y += dy * dashLength;
          holdStroke.lineTo(x, y);
          x += dx * gapLength;
          y += dy * gapLength;
        }
      }
      holdStroke.endFill();
    } else {
      holdStroke.lineStyle(STROKE_WIDTH, holdColorMap[hold.type], 1);
      // 绘制实线正方形
      holdStroke.drawRect(
        holdPoint.x - (hold.size + STROKE_WIDTH) / 2,
        holdPoint.y - (hold.size + STROKE_WIDTH) / 2,
        hold.size + STROKE_WIDTH,
        hold.size + STROKE_WIDTH
      );
    }
    return holdStroke;
  }
  private generateCircularHoldStroke(hold, index) {
    const holdPoint = this.pointToWall(hold);
    const holdStroke = new this.PIXI.Graphics();
    const STROKE_WIDTH = 3;
    if (
      this.mode === CANVAS_MODE.EDIT &&
      index === this._editSchemaIndex.value
    ) {
      holdStroke.lineStyle(STROKE_WIDTH, holdColorMap[hold.type], 1);
      // 虚线参数：线段长度和空隙长度
      const dashLength = 2;
      const gapLength = 2;

      // 计算圆的周长
      const radius = (hold.size + STROKE_WIDTH) / 2;
      const circumference = Math.PI * radius;

      // 开始绘制虚线
      let angle = 0;
      while (angle < Math.PI * 2) {
        // 计算线段或空隙的终点角度
        let endAngle = angle + (dashLength / circumference) * Math.PI * 2;
        if (endAngle > Math.PI * 2) endAngle = Math.PI * 2;

        // 计算线段或空隙的起始和结束坐标
        let startX = holdPoint.x + radius * Math.cos(angle);
        let startY = holdPoint.y + radius * Math.sin(angle);
        let endX = holdPoint.x + radius * Math.cos(endAngle);
        let endY = holdPoint.y + radius * Math.sin(endAngle);

        // 绘制线段
        holdStroke.moveTo(startX, startY);
        holdStroke.lineTo(endX, endY);

        // 更新角度
        angle = endAngle + (gapLength / circumference) * Math.PI * 2;
        if (angle > Math.PI * 2) break; // 防止超出圆周
      }
    } else {
      holdStroke.lineStyle(STROKE_WIDTH, holdColorMap[hold.type], 1);
      holdStroke.drawCircle(
        holdPoint.x,
        holdPoint.y,
        (hold.size + STROKE_WIDTH) / 2
      );
    }
    return holdStroke;
  }
  private _removeEditingHold() {
    this.schema.splice(this._editSchemaIndex.value, 1);
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
    this.removeListener?.();
    if (value === CANVAS_MODE.VIEW) {
      this.listenViewMode();
    } else if (value === CANVAS_MODE.INSERT) {
      // this.listenInsertMode();
    } else if (value === CANVAS_MODE.EDIT) {
      this.listenEditMode();
    }
  }
  public restoreLastMode() {
    this.mode = this._lastMode.value ?? CANVAS_MODE.VIEW;
  }
  public onZoom(e) {
    switch (this.mode) {
      case CANVAS_MODE.VIEW:
        this.onViewModeZoom(e);
        break;
      case CANVAS_MODE.INSERT:
        // this.onInsertModeZoom(e);
        break;
      case CANVAS_MODE.EDIT:
        this.onEditModeZoom(e);
        break;
    }
  }
  private listenViewMode() {
    const onTouchStart = (event) => {
      const localPoint = this.wall.toLocal(event.data.global);
      this._wallInfo.clickOffset = {
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
      if (this.wall && this._wallInfo.clickOffset && !this._zoomStart) {
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
    this.removeListener = () => {
      this.stage.off('pointermove', onTouchMove);
      this.stage.off('pointerup', onTouchEnd);
      this.stage.off('pointerupoutside', onTouchEnd);
      this.stage.off('pointerdown', onTouchStart);
    };
  }
  private onViewModeZoom(e) {
    const target = this.wall;
    if (target) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      if (!this._zoomStart) {
        this._wallInfo.initialTouchDistance = Math.hypot(
          touch1.clientX - touch2.clientX,
          touch1.clientY - touch2.clientY
        );
        this._wallInfo.initialScale = Object.assign({}, target.scale);
        this._zoomStart = true;
        const centerPoint = {
          x: (touch1.clientX + touch2.clientX) / 2,
          y: (touch1.clientY + touch2.clientY) / 2,
        };
        const localPoint = this.wall.toLocal(centerPoint);
        this._wallInfo.clickOffset = {
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
        return;
      }
      const currentTouchDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      const scaleFactor =
        currentTouchDistance / (this._wallInfo.initialTouchDistance || 1);
      const initialScale = this._wallInfo.initialScale;
      target.scale.set(
        (initialScale?._x || 1) * scaleFactor,
        (initialScale?._y || 1) * scaleFactor
      );
    }
  }
  private listenEditMode() {
    const onTouchStart = () => {};
    const onTouchMove = (event) => {
      if (this._editSchemaIndex.value >= 0 && !this._zoomStart) {
        const localPoint = this.wall.toLocal(event.data.global);
        this.schema[this._editSchemaIndex.value].x =
          localPoint.x +
          (this.wall.anchor._x * this.wall.width) / this.wall.scale._x;
        this.schema[this._editSchemaIndex.value].y =
          localPoint.y +
          (this.wall.anchor._y * this.wall.height) / this.wall.scale._y;
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
  private onEditModeZoom(e) {
    const target = this.schema[this._editSchemaIndex.value];
    if (target) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      if (!this._zoomStart) {
        this._editingHoldInfo.initialTouchDistance = Math.hypot(
          touch1.clientX - touch2.clientX,
          touch1.clientY - touch2.clientY
        );
        this._editingHoldInfo.initialSize = target.size;
        this._zoomStart = true;
        const centerPoint = {
          x: (touch1.clientX + touch2.clientX) / 2,
          y: (touch1.clientY + touch2.clientY) / 2,
        };
        const localPoint = this.wall.toLocal(centerPoint);
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
        return;
      }
      const currentTouchDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      const scaleFactor =
        currentTouchDistance /
        (this._editingHoldInfo.initialTouchDistance || 1);
      const initialScale = this._editingHoldInfo.initialSize || 100;

      target.size = initialScale * scaleFactor;
    }
  }
}
