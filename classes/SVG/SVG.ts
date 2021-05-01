import { Coordinates } from "~/classes/Coordinates";
import { Position } from "~/classes/SVG/Position";

export class SVG {
  position?: Position;
  type?: string;
  d?: Array<Coordinates>;
  fill?: string = 'none';
  stroke?: string = '#FFFFFF';

}
