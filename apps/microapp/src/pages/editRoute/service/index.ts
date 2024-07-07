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
  _editingTarget: {
    target?: any;
    zoomStart?: boolean;
    clickOffset?: { x: number; y: number };
    initialScale?: { _x: number; _y: number };
    initialTouchDistance?: number;
    disableEdit?: () => void;
  } = reactive({});
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
      this.editingTarget = holds[0];
    }
  }
  get mode() {
    return this._mode.value;
  }
  set mode(value) {
    this._mode.value = value;
    if (value === CANVAS_MODE.VIEW || value === CANVAS_MODE.INSERT) {
      this.editingTarget = this.wall;
    }
  }
  get editingTarget() {
    return this._editingTarget.target;
  }
  set editingTarget(value) {
    this._editingTarget.target = value;
    this._editingTarget.disableEdit?.();
    const that = this;
    const onTouchStart = function (event) {
      const localPoint = that.editingTarget.toLocal(event.data.global);
      that._editingTarget.clickOffset = {
        x: localPoint.x * that.editingTarget.scale.x,
        y: localPoint.y * that.editingTarget.scale.y,
      };
      that.editingTarget.anchor.set(
        (localPoint.x * that.editingTarget.scale.x) / that.editingTarget.width +
          that.editingTarget.anchor._x,
        (localPoint.y * that.editingTarget.scale.y) /
          that.editingTarget.height +
          that.editingTarget.anchor._y
      );
      that.editingTarget.position.copyFrom({
        x: event.global.x,
        y: event.global.y,
      });
      that._editingTarget.initialScale = Object.assign(
        {},
        that.editingTarget.scale
      );
    };
    const onTouchMove = function (event) {
      if (that.editingTarget && that._editingTarget.clickOffset) {
        that.editingTarget.position.copyFrom({
          x: event.global.x,
          y: event.global.y,
        });
        that.schema[0].x = event.global.x;
        that.schema[0].y = event.global.y;
      }
    };
    const onTouchEnd = function () {
      that._editingTarget = {
        target: that.editingTarget,
      };
    };

    this.stage.on('pointermove', onTouchMove);
    this.stage.on('pointerup', onTouchEnd);
    this.stage.on('pointerupoutside', onTouchEnd);
    this.stage.on('pointerdown', onTouchStart);
    this._editingTarget.disableEdit = () => {
      that.stage.off('pointermove', onTouchMove);
      that.stage.off('pointerup', onTouchEnd);
      that.stage.off('pointerupoutside', onTouchEnd);
      that.stage.off('pointerdown', onTouchStart);
    };
  }
  /**
   * 处理缩放事件。
   * 当两个触摸点同时在屏幕上移动时，可以通过计算它们之间的距离变化来实现物体的缩放。
   * 此函数主要用于计算并应用这种缩放变化到编辑中的目标物体上。
   * @param e 触摸事件对象，包含触摸点的信息。
   */
  public onZoom = (e) => {
    // 获取当前正在编辑的目标物体。
    const target = this.editingTarget;
    // 如果目标物体存在。
    if (target) {
      // 获取第一个和第二个触摸点的位置。
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      // 如果还没有开始缩放。
      if (!this._editingTarget.zoomStart) {
        // 计算初始触摸点间的距离，用于后续计算缩放比例。
        this._editingTarget.initialTouchDistance = Math.hypot(
          touch1.clientX - touch2.clientX,
          touch1.clientY - touch2.clientY
        );
        // 复制当前物体的缩放状态作为初始缩放。
        this._editingTarget.initialScale = Object.assign({}, target.scale);
        // 标记缩放已经开始。
        this._editingTarget.zoomStart = true;
        // 计算两个触摸点的中心点位置。
        const centerPoint = {
          x: (touch1.clientX + touch2.clientX) / 2,
          y: (touch1.clientY + touch2.clientY) / 2,
        };
        // 将中心点位置转换为物体本地坐标系下的位置。
        const localPoint = this.editingTarget.toLocal(centerPoint);
        // 计算物体在缩放前后的点击偏移量。
        this._editingTarget.clickOffset = {
          x: localPoint.x * this.editingTarget.scale.x,
          y: localPoint.y * this.editingTarget.scale.y,
        };
        // 更新物体的锚点位置，以保持其在屏幕中的相对位置不变。
        this.editingTarget.anchor.set(
          (localPoint.x * this.editingTarget.scale.x) /
            this.editingTarget.width +
            this.editingTarget.anchor._x,
          (localPoint.y * this.editingTarget.scale.y) /
            this.editingTarget.height +
            this.editingTarget.anchor._y
        );
        // 设置物体的位置为触摸点的中心位置，为后续缩放提供参考点。
        this.editingTarget.position.copyFrom({
          x: centerPoint.x,
          y: centerPoint.y,
        });
        return;
      }
      // 计算当前触摸点间的距离。
      const currentTouchDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      // 计算缩放比例。
      const scaleFactor =
        currentTouchDistance / (this._editingTarget.initialTouchDistance || 1);
      // 获取初始缩放状态。
      const initialScale = this._editingTarget.initialScale;
      // 根据缩放比例和初始缩放状态，更新物体的缩放。
      target.scale.set(
        (initialScale?._x || 1) * scaleFactor,
        (initialScale?._y || 1) * scaleFactor
      );
    }
  };
}
