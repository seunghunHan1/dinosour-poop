export interface CanvasElemModel {
  x: number;
  y: number;
  width: number;
  height: number;
  jump?: boolean;
  draw(ctx: CanvasRenderingContext2D, imgRsrc?: HTMLImageElement): void;
}

export class CanvasElemClass implements CanvasElemModel {
  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.jump = false;
  }
  x: number;
  y: number;
  width: number;
  height: number;
  jump: boolean;
  draw(ctx: CanvasRenderingContext2D, imgRsrc?: HTMLImageElement) {
    // ctx.fillStyle = "rgba(0,0,0,0.5)";
    // ctx.fillRect(this.x, this.y, this.width, this.height);
    if (imgRsrc) {
      ctx.drawImage(imgRsrc, this.x, this.y, this.width, this.height);
    }
  }
}
