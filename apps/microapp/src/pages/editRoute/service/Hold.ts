import { HOLD_TYPE, THold } from '@/server/router/zods/route';
import RouteEditorEngine, { CANVAS_MODE } from './RouteEditorEngine';

const STROKE_WIDTH = 6;
export const holdColorMap = {
  [HOLD_TYPE.START_END]: 0xfde68a,
  [HOLD_TYPE.MIDDLE]: 0xa5f3fc,
  [HOLD_TYPE.FOOT]: 0xa5f3fc,
};

class Hold {
  static allHolds: Set<Hold> = new Set();
  static editingTarget: Hold | null = null;
  public holdSprite: any;
  public holdSpriteMask: any;
  public holdStroke: any;
  public holdStrokeEdit: any;
  private _removeHoldListener: () => void;
  constructor(
    private engine: RouteEditorEngine,
    private _hold: THold
  ) {
    this.generateHold();
    this.listenHold();
    Hold.allHolds.add(this);
  }
  get x() {
    return this._hold.x;
  }
  set x(value) {
    this._hold.x = value;
  }
  get y() {
    return this._hold.y;
  }
  set y(value) {
    this._hold.y = value;
  }
  get size() {
    return this._hold.size;
  }
  set size(value) {
    this._hold.size = value;
  }
  get type() {
    return this._hold.type;
  }
  set type(value) {
    this._hold.type = value;
  }
  public edit() {
    Hold.editingTarget = this;
  }
  public isEdit() {
    return Hold.editingTarget === this;
  }
  public remove() {
    Hold.allHolds.delete(this);
    const trashes = [
      this.holdSpriteMask,
      this.holdSprite,
      this.holdStroke,
      this.holdStrokeEdit,
    ];
    this._removeHoldListener?.();
    trashes.forEach((trash) => {
      if (trash.parent) {
        trash.parent.removeChild(trash);
      }
      trash.destroy();
      trash = null;
    });
  }
  public update() {
    this.updateHoldSprite();
    this.updateHoldStroke();
  }
  public listenHold() {
    this._removeHoldListener?.();
    if (this.engine.mode === CANVAS_MODE.VIEW) {
      this.listenViewHold();
    } else if (this.engine.mode === CANVAS_MODE.INSERT) {
      this.listenInsertHold();
    } else if (this.engine.mode === CANVAS_MODE.EDIT) {
      this.listenEditHold();
    }
  }
  private pointToWall({ x, y }: { x: number; y: number }) {
    const wall = this.engine.wall;
    return {
      x: x - (wall.anchor._x * wall.width) / wall.scale.x,
      y: y - (wall.anchor._y * wall.height) / wall.scale.y,
    };
  }
  private generateHold() {
    const { holdSprite, holdSpriteMask } = this.generateHoldSprite();
    const { holdStroke, holdStrokeEdit } = this.generateHoldStroke();
    this.holdSprite = holdSprite;
    this.holdSpriteMask = holdSpriteMask;
    this.holdStroke = holdStroke;
    this.holdStrokeEdit = holdStrokeEdit;
  }
  private generateHoldSprite() {
    if (this._hold.type === HOLD_TYPE.FOOT) {
      return this.generateSquareHoldSprite(); // 新增的方形绘制函数
    } else {
      return this.generateCircularHoldSprite(); // 原有的圆形绘制函数
    }
  }
  private generateSquareHoldSprite() {
    const holdSpriteMask = new this.engine.PIXI.Graphics();
    holdSpriteMask.beginFill(0xffffff);
    holdSpriteMask.drawRect(
      -this._hold.size / 2,
      -this._hold.size / 2,
      this._hold.size,
      this._hold.size
    );
    holdSpriteMask.endFill();

    const holdSprite = new this.engine.PIXI.Sprite(this.engine.wall.texture);
    holdSprite.mask = holdSpriteMask;
    holdSprite.addChild(holdSpriteMask);
    holdSprite.eventMode = 'static';
    return {
      holdSprite,
      holdSpriteMask,
    };
  }
  private generateCircularHoldSprite() {
    const holdSpriteMask = new this.engine.PIXI.Graphics();
    holdSpriteMask.beginFill(0xffffff);
    holdSpriteMask.drawCircle(0, 0, this._hold.size / 2);
    holdSpriteMask.endFill();

    const holdSprite = new this.engine.PIXI.Sprite(this.engine.wall.texture);
    holdSprite.mask = holdSpriteMask;
    holdSprite.addChild(holdSpriteMask);
    holdSprite.eventMode = 'static';
    return {
      holdSprite,
      holdSpriteMask,
    };
  }

  private generateHoldStroke() {
    if (this._hold.type === HOLD_TYPE.FOOT) {
      return this.generateSquareHoldStroke(); // 新增的方形绘制函数
    } else {
      return this.generateCircularHoldStroke(); // 原有的圆形绘制函数
    }
  }
  private generateSquareHoldStroke() {
    const generateHoldStrokeEdit = () => {
      const holdStrokeEdit = new this.engine.PIXI.Graphics();

      holdStrokeEdit.lineStyle(STROKE_WIDTH, holdColorMap[this._hold.type], 1);
      // 虚线参数：线段长度和空隙长度
      const dashLength = 3;
      const gapLength = 3;

      // 计算正方形的边长
      const sideLength = this._hold.size + STROKE_WIDTH;
      // 绘制虚线正方形
      holdStrokeEdit.beginFill(0x000000, 0); // 设置填充颜色为透明，确保只有边框
      const numSegments = Math.ceil(sideLength / (dashLength + gapLength));
      for (let i = 0; i < 4; i++) {
        // 四条边
        let x = -sideLength / 2;
        let y = -sideLength / 2;
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
          holdStrokeEdit.moveTo(x, y);
          x += dx * dashLength;
          y += dy * dashLength;
          holdStrokeEdit.lineTo(x, y);
          x += dx * gapLength;
          y += dy * gapLength;
        }
      }
      holdStrokeEdit.endFill();
      return holdStrokeEdit;
    };
    const generateHoldStroke = () => {
      const holdStroke = new this.engine.PIXI.Graphics();
      holdStroke.lineStyle(STROKE_WIDTH, holdColorMap[this._hold.type], 1);
      const sideLength = this._hold.size + STROKE_WIDTH * 2;

      // 绘制实线正方形
      holdStroke.drawRect(
        -sideLength / 2,
        -sideLength / 2,
        this._hold.size + STROKE_WIDTH * 2,
        this._hold.size + STROKE_WIDTH * 2
      );
      return holdStroke;
    };
    const holdStrokeEdit = generateHoldStrokeEdit();
    const holdStroke = generateHoldStroke();
    return {
      holdStroke,
      holdStrokeEdit,
    };
  }
  private generateCircularHoldStroke() {
    const generateHoldStrokeEdit = () => {
      const holdStrokeEdit = new this.engine.PIXI.Graphics();
      holdStrokeEdit.lineStyle(STROKE_WIDTH, holdColorMap[this._hold.type], 1);
      // 虚线参数：线段长度和空隙长度
      const dashLength = 2;
      const gapLength = 2;

      // 计算圆的周长
      const radius = (this._hold.size + STROKE_WIDTH) / 2;
      const circumference = Math.PI * radius;

      // 开始绘制虚线
      let angle = 0;
      while (angle < Math.PI * 2) {
        // 计算线段或空隙的终点角度
        let endAngle = angle + (dashLength / circumference) * Math.PI * 2;
        if (endAngle > Math.PI * 2) endAngle = Math.PI * 2;

        // 计算线段或空隙的起始和结束坐标
        let startX = radius * Math.cos(angle);
        let startY = radius * Math.sin(angle);
        let endX = radius * Math.cos(endAngle);
        let endY = radius * Math.sin(endAngle);

        // 绘制线段
        holdStrokeEdit.moveTo(startX, startY);
        holdStrokeEdit.lineTo(endX, endY);

        // 更新角度
        angle = endAngle + (gapLength / circumference) * Math.PI * 2;
        if (angle > Math.PI * 2) break; // 防止超出圆周
      }
      return holdStrokeEdit;
    };
    const generateHoldStroke = () => {
      const holdStroke = new this.engine.PIXI.Graphics();
      holdStroke.lineStyle(STROKE_WIDTH, holdColorMap[this._hold.type], 1);
      holdStroke.drawCircle(0, 0, (this._hold.size + STROKE_WIDTH) / 2);
      return holdStroke;
    };
    const holdStrokeEdit = generateHoldStrokeEdit();
    const holdStroke = generateHoldStroke();
    return {
      holdStroke,
      holdStrokeEdit,
    };
  }
  private updateHoldStroke() {
    const holdPoint = this.pointToWall(this._hold);
    const holdStroke = this.holdStroke;
    const holdStrokeEdit = this.holdStrokeEdit;
    holdStroke.position.set(holdPoint.x, holdPoint.y);
    holdStroke.width = this._hold.size + STROKE_WIDTH;
    holdStroke.height = this._hold.size + STROKE_WIDTH;
    holdStrokeEdit.position.set(holdPoint.x, holdPoint.y);
    holdStrokeEdit.width = this._hold.size + STROKE_WIDTH;
    holdStrokeEdit.height = this._hold.size + STROKE_WIDTH;
  }
  private updateHoldSprite() {
    const originPoint = this.pointToWall({ x: 0, y: 0 });
    const holdSpriteMask = this.holdSpriteMask;
    const holdSprite = this.holdSprite;
    holdSpriteMask.position.set(this._hold.x, this._hold.y);
    holdSpriteMask.width = this._hold.size;
    holdSpriteMask.height = this._hold.size;
    holdSprite.position.set(originPoint.x, originPoint.y);
    holdSprite.width = this.engine.wall.width / this.engine.wall.scale.x;
    holdSprite.height = this.engine.wall.height / this.engine.wall.scale.y;
  }
  private listenEditHold() {
    const onHoldTouch = () => {
      Hold.editingTarget = this;
    };
    this.holdSprite.on('pointerdown', onHoldTouch);
    const onHoldTap = () => {
      if (!this.engine._eventTap) return;
      Hold.editingTarget = this;
    };
    this.holdSprite.on('pointerup', onHoldTap);
    this._removeHoldListener = () => {
      this.holdSprite.off('pointerdown', onHoldTouch);
      this.holdSprite.off('pointerup', onHoldTap);
    };
  }
  private listenInsertHold() {
    const onHoldTap = () => {
      if (!this.engine._eventTap) return;
      this.engine.mode = CANVAS_MODE.EDIT;
      Hold.editingTarget = this;
    };
    this.holdSprite.on('pointerup', onHoldTap);
    this._removeHoldListener = () => {
      this.holdSprite.off('pointerup', onHoldTap);
    };
  }
  private listenViewHold() {
    const onHoldTap = () => {
      if (!this.engine._eventTap) return;
      this.engine.mode = CANVAS_MODE.EDIT;
      Hold.editingTarget = this;
    };
    this.holdSprite.on('pointerup', onHoldTap);
    this._removeHoldListener = () => {
      this.holdSprite.off('pointerup', onHoldTap);
    };
  }
}

export { Hold };
