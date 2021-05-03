<template>
  <svg :id="flat.id" class="svg--flat svg--flat--draw">
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
  methods: {
    selectSVG($event: any) {
      let _self = (this as any);
      let svg = _self.$svg.get(this.flat.id);
      console.log(svg, $event);

    }
  },
  watch: {},
  mounted(): void {
    let _self = (this as any);
    let svg = _self.$svg.get(_self.flat.id);
    svg.width(_self.flat.position.width + 40).height(_self.flat.position.height + 40);
    let stringD = "";
    _self.flat.d.forEach((point: any, index: number) => {
      stringD += (index == 0 ? "M" : (index == 1) ? "L" : "") + values(point).join(",") + " ";
    });
    stringD += stringD + "z";
    svg.path(stringD).fill(_self.flat.fill).stroke({ color: _self.flat.stroke, width: 3 }).transform({
      x: 20,
      y: 20
    }).style({ cursor: "pointer" }).attr({ id: _self.flat.id + "_path" });
    svg.style({
      position: "absolute",
      transform: "matrix(1, 0, 0, 1, " + (_self.flat.position.x - 20) + ", " + (_self.flat.position.y - 20) + ")"
    });
    _self.print = true;
  }
});
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
