<template>
  <svg :id="flat.id" class="svg--flat svg--flat--draw">
    <defs xmlns="http://www.w3.org/2000/svg">
      <circle id="point-handle" r="10" x="0" y="0" stroke-width="4" fill="#363E5C" fill-opacity="1" stroke="#fff" />
    </defs>
  </svg>
</template>

<script lang="ts">
import Vue from "vue";
import { SVG } from "~/classes/SVG/SVG";
import { values } from "lodash";

export default Vue.extend({
  name: "BuilderSVG",
  props: {
    flat: {
      type: SVG
    }
  },
  data() {
    return {
      originalPoints: [] as any,
      root: null as any,
      svg: null as any,
      svgElement: null as any
    };
  },
  methods: {
    selectSVG($event: any) {
      let _self = (this as any);
      let svg = _self.$svg.get(this.flat.id);
    },
    renderSVG() {
      let _self = (this as any);
      _self.svg.width(_self.flat.position.width + 40).height(_self.flat.position.height + 40);
      let stringD = "";
      _self.flat.d.forEach((point: any, index: number) => {
        let pointPath = [point.x - 20, point.y - 20] as any;
        stringD += (index == 0 ? "M" : (index == 1) ? "L" : "") + values(pointPath).join(",") + " ";
      });
      stringD += stringD + "z";
      _self.svg.path(stringD).fill(_self.flat.fill).stroke({ color: _self.flat.stroke, width: 3 }).transform({
        x: 20,
        y: 20
      }).style({ cursor: "pointer" }).attr({ id: _self.flat.id + "_path" });
      _self.svg.style({
        position: "absolute",
        transform: "matrix(1, 0, 0, 1, " + (_self.flat.position.x - 20) + ", " + (_self.flat.position.y - 20) + ")"
      });
    },
    reRenderSVG() {
      let _self = (this as any);
      let stringD = "";
      _self.flat.d.forEach((point: any, index: number) => {
        let pointPath = [point.x - 20, point.y - 20] as any;
        stringD += (index == 0 ? "M" : (index == 1) ? "L" : "") + values(pointPath).join(",") + " ";
      });
      stringD += stringD + "z";
      let pathSVG = document.getElementById(_self.flat.id + "_path");
      pathSVG.setAttribute("d", stringD);
      _self.svgElement.setAttribute("width", String((pathSVG.getBoundingClientRect().width + 40)));
      _self.svgElement.setAttribute("height", String((pathSVG.getBoundingClientRect().height + 40)));
    }
  },
  watch: {
    "flat"(newValue, oldValue): void {
      console.log(newValue);
    }
  },
  mounted(): void {
    let _self = (this as any);
    _self.svg = _self.$svg.get(_self.flat.id);
    _self.svgElement = document.getElementById(_self.flat.id);
    _self.renderSVG();

    let point_element = _self.$svg.get("point-handle");
    _self.flat.d.forEach((point: any, index: number) => {
      _self.svg.use(point_element).move(point.x, point.y).addClass("point-handle").attr({ "data-index": index });
    });

    _self.print = true;
    const doc = document as any;
    _self.root = doc.getElementById("builder--block");

    _self.$interact(".point-handle")
      .draggable({
        onstart: function(event: any) {
          _self.svg.addClass("dragging");
        },
        onmove: function(event: any) {
          const i = event.target.getAttribute("data-index") | 0;
          let p = _self.flat.d[i];
          p.x += event.dx;
          p.y += event.dy;
          event.target.x.baseVal.value = p.x;
          event.target.y.baseVal.value = p.y;
          _self.flat.d[i].x = p.x;
          _self.flat.d[i].y = p.y;
          _self.reRenderSVG();
        },
        onend: function(event: any) {
          _self.svg.removeClass("dragging");
        },
        restrict: {
          restriction: doc.getElementById("builder--block"),
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
          endOnly: true
        },
        snap: {
          targets: [
            _self.$interact.snappers.grid({ x: 10, y: 10 })
          ],
          offset: { x: 20, y: 20 },
          range: Infinity,
          relativePoints: [{ x: 0, y: 0 }]
        }
      })
      .styleCursor(false);

    doc.addEventListener("dragstart", (event: any) => {
      event.preventDefault();
    });
  }
})
;
</script>

<style scoped lang="scss">
.svg {
  &--flat {
    path {
      cursor: pointer;
    }

    &.lock {
      opacity: 0.5;
      pointer-events: none;
    }
  }
}

</style>
