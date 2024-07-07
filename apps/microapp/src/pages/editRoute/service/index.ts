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
  modeText = computed(() => {
    switch (this.mode) {
      case CANVAS_MODE.VIEW:
        return '查看';
      case CANVAS_MODE.INSERT:
        return '插入';
      case CANVAS_MODE.EDIT:
        return '编辑';
    }
  });
  _mode: Ref<CANVAS_MODE> = ref(CANVAS_MODE.VIEW);
  _wallInfo: {
    zoomStart?: boolean;
    clickOffset?: { x: number; y: number };
    initialScale?: { _x: number; _y: number };
    initialTouchDistance?: number;
  } = reactive({});
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
    const renderSchema = this.renderSchema.bind(this);
    function animate() {
      canvas.requestAnimationFrame(animate);
      renderSchema();
      renderer.render(stage);
    }
    animate();
  }
  public initWall = (wallImg: string) => {
    const wall = this.PIXI.Sprite.from(wallImg);
    this.wall = wall;
    this.stage.addChild(wall);
    this.mode = CANVAS_MODE.VIEW;
  };
  private renderSchema() {
    if (!this.wall) {
      return;
    }
    const pointToWall = ({ x, y }: { x: number; y: number }) => {
      return {
        x: x - (this.wall.anchor._x * this.wall.width) / this.wall.scale.x,
        y: y - (this.wall.anchor._y * this.wall.height) / this.wall.scale.y,
      };
    };
    // 清空墙
    this.wall.removeChildren();
    if (this.schema.length) {
      // 绘制蒙层
      const maskSprite = new this.PIXI.Sprite(this.PIXI.Texture.WHITE);
      maskSprite.tint = 0x000000;
      maskSprite.width = this.wall.width / this.wall.scale.x;
      maskSprite.height = this.wall.height / this.wall.scale.y;
      const { x: worldX, y: worldY } = pointToWall({ x: 0, y: 0 });
      maskSprite.position.set(worldX, worldY);
      maskSprite.alpha = 0.5;
      this.wall?.addChild(maskSprite);
      // 绘制hold

      const holds: any = [];

      this.schema.forEach((hold) => {
        const holdSpriteMask = new this.PIXI.Graphics();
        holdSpriteMask.beginFill(0xffffff);
        holdSpriteMask.drawCircle(hold.x, hold.y, hold.size / 2);
        holdSpriteMask.endFill();
        holdSpriteMask.width = hold.size;
        holdSpriteMask.height = hold.size;
        const holdSprite = new this.PIXI.Sprite(this.wall.texture);
        holdSprite.width = this.wall.width / this.wall.scale.x;
        holdSprite.height = this.wall.height / this.wall.scale.y;
        holdSprite.position.set(worldX, worldY);
        holdSprite.mask = holdSpriteMask;
        holdSprite.addChild(holdSpriteMask);
        this.wall.addChild(holdSprite);
        holds.push(holdSprite);
      });
    }
  }
  private _eventDispatcher(e) {
    if (e.touches.length <= 1) {
      this.PIXI.dispatchEvent(e);
    } else {
      this.onZoom(e);
    }
  }

  get mode() {
    return this._mode.value;
  }
  set mode(value) {
    this._mode.value = value;
    this.removeListener?.();
    if (value === CANVAS_MODE.VIEW) {
      this.listenViewMode();
    }
  }
  public onZoom(e) {
    switch (this.mode) {
      case CANVAS_MODE.VIEW:
        this.onViewModeZoom(e);
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
      if (this.wall && this._wallInfo.clickOffset) {
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
      if (!this._wallInfo.zoomStart) {
        this._wallInfo.initialTouchDistance = Math.hypot(
          touch1.clientX - touch2.clientX,
          touch1.clientY - touch2.clientY
        );
        this._wallInfo.initialScale = Object.assign({}, target.scale);
        this._wallInfo.zoomStart = true;
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
}
