import { SVGPosition } from "~/classes/SVG/SVGPosition";
import { Coordinates } from "~/classes/Coordinates";

export class SVG {
  public id: string;
  public position: SVGPosition;
  public d: Array<Coordinates>;
  public type: string;
  public fill: string;
  public stroke: string;
  public print: boolean;

  constructor(id: string, position: SVGPosition, d: Array<Coordinates>, type: string = "path", fill: string = "none", stroke: string = "#FFFFFF", print: boolean = false) {
    this.id = id;
    this.position = position;
    this.d = d;
    this.type = type;
    this.fill = fill;
    this.stroke = stroke;
    this.print = print;
  }

}
