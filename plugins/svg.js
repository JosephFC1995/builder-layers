import * as SVG from "svg.js";
import 'svg.draw.js'
import 'svg.select.js'
import 'svg.resize.js'

export default ({app}, inject) => {
  inject('svg', SVG)
}
