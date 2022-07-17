export class CanvasElemClass {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.jump = false;
    }
    x;
    y;
    width;
    height;
    jump;
    draw(ctx, imgRsrc) {
        // ctx.fillStyle = "rgba(0,0,0,0.5)";
        // ctx.fillRect(this.x, this.y, this.width, this.height);
        if (imgRsrc) {
            ctx.drawImage(imgRsrc, this.x, this.y, this.width, this.height);
        }
    }
}
//# sourceMappingURL=canvasElemType.js.map