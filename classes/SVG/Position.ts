export class Position {
  height?: number;
  width?: number;
  x?: number;
  y?: number;

  public setBbox(bBox: SVGRect) {
    this.height = bBox.height;
    this.width = bBox.width;
    this.x = bBox.x;
    this.y = bBox.y;
  }

}
