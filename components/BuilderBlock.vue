<template>
  <div class="builder--block" ref="BuilderBlock" :style="{width : width + 'px', height : height + 'px'}">
    <div class="builder--block--diagram">
      <div class="diagram--container" id="builder--block--container">
        <BuilderSVG v-for="(flat, index) in flats" :key="index" :flat="flat" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from "vue";
import BuilderSVG from "~/components/BuilderSVG.vue";

export default Vue.extend({
  name: "BuilderBlock",
  components: { BuilderSVG },
  props: {
    flats: {
      type: Array
    }
  },
  data() {
    return {
      width: 1000,
      height: 1000
    };
  },
  mounted(): void {
    this.width = window.innerWidth - 200;
    this.height = window.innerHeight + 200;
  },
  watch: {}
});
</script>

<style lang="scss" scoped>
.builder {
  &--block {
    width: 1000px;
    height: 900px;
    display: inline-block;

    &--diagram {
      box-sizing: border-box;
      position: relative;
      height: 100%;
      width: 100%;
    }

    &.drawing {
      cursor: crosshair !important;

      .svg--flat {
        pointer-events: none !important;
      }
    }
  }
}

.diagram {
  &--container {
    background: #454b6b;
    box-shadow: 0 0 90px -9px #2b314e;
    height: 100%;
    width: 100%;
    position: relative;

    &::before {
      content: "";
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      opacity: .4;
      background-image: url(https://storage.googleapis.com/static.helloumi.com/daisho/img/grid.png);
      background-position: 0 0;
      background-size: 80px;
      z-index: 1;
      pointer-events: none;
    }
  }
}
</style>
