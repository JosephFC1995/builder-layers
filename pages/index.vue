<template>
  <div class="container--flex">
    <div
      class="builder--container"
      :class="{
        'builder--grap--cursor': keySpacePress,
        'builder--grap--cursor--click': clickPress
      }"
      ref="BuilderContainer"
      id="builder-container"
      @mousemove="handleMouseEventBuilderContainer($event)"
      @mousedown="handleClickPress"
      @touchstart="handleClickPress"
      @touchend="handleClickStop"
      @touchcancel="handleClickStop"
      @mouseleave="handleClickStop"
      @mouseup="handleClickStop"
      @keydown="handleKeyDownBuilderContainer"
      @keyup="handleKeyUpBuilderContainer"
      @wheel="onWheelBuilderContainer"
      tabindex="0"
    >
      <BuilderBlock
        :style="{
          transformOrigin: '0px 0px 0px',
          transform: transformComputed
        }"
        :class="{drawing : drawing}"
        id="builder--block"
        :flats="listGraphics"
      />
    </div>
    <div class="builder--actions flex justify-center">
      <div class="actions flex justify-center items-center">
        <div
          class="transition actions--items bg-white h-13 w-13 rounded-full flex justify-center items-center mx-3 cursor-pointer font-bold uppercase">
          a
        </div>
        <div
          class="transition actions--items bg-white h-13 w-13 rounded-full flex justify-center items-center mx-3 cursor-pointer  font-bold uppercase">
          b
        </div>
        <div
          class="transition actions--items bg-white h-13 w-13 rounded-full flex justify-center items-center mx-3 cursor-pointer  font-bold uppercase"
          data-action="start-draw" @click="drawMap" v-if="!drawing">
          c
        </div>
        <div
          class="transition actions--items bg-white h-13 w-13 rounded-full flex justify-center items-center mx-3 cursor-pointer  font-bold uppercase"
          data-action="start-draw" @click="drawMap" v-else>
          x
        </div>
        <div
          class="transition actions--items bg-white h-13 w-13 rounded-full flex justify-center items-center mx-3 cursor-pointer  font-bold uppercase"
          data-action="reset-camera" @click="resetCamera">
          r
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Coordinates } from "~/classes/Coordinates";
import * as _ from "lodash";
import { random } from "~/utils/String";
import { SVGPosition } from "~/classes/SVG/SVGPosition";
import { SVG } from "~/classes/SVG/SVG";
import { Coordinate } from "~/interfaces/Coordinate";
import BuilderBlock from "~/components/BuilderBlock.vue";

export default Vue.extend({
  components: { BuilderBlock },
  data() {
    return {
      clickPress: false as boolean,
      keySpacePress: false as boolean,
      drawing: false as boolean,
      listGraphics: [] as Array<SVG>,
      tempBuilderPosition: new Coordinates(100, 100),
      builderPosition: new Coordinates(100, 100),
      initPositionCursor: new Coordinates(100, 100),
      positionCursor: new Coordinates(100, 100),
      scale: 1 as number
    };
  },
  methods: {
    handleKeyDownBuilderContainer($event: any) {
      if ($event.keyCode != 32 || $event.which != 32) return false;
      this.keySpacePress = true;
    },
    handleKeyUpBuilderContainer($event: any) {
      this.tempBuilderPosition = _.cloneDeep(this.builderPosition);
      this.keySpacePress = false;
    },
    handleMouseEventBuilderContainer($event: any) {
      if (!this.clickPress && !this.keySpacePress) return false;
      this.positionCursor.x = $event.x;
      this.positionCursor.y = $event.y;
    },
    handleClickPress($event: any) {
      if (!this.keySpacePress) return;
      this.clickPress = true;
      this.positionCursor.x = $event.x;
      this.positionCursor.y = $event.y;
      this.initPositionCursor.x = $event.x;
      this.initPositionCursor.y = $event.y;
    },
    handleClickStop() {
      this.tempBuilderPosition = _.cloneDeep(this.builderPosition);
      this.clickPress = false;
      this.positionCursor.x = 0;
      this.positionCursor.y = 0;
    },
    resetCamera() {
      this.builderPosition.x = 100;
      this.builderPosition.y = 100;
      this.scale = 1;
    },
    drawMap() {
      let _self = (this as any);
      let _svg: SVG;
      let poly2 = new _self.$svg("builder--block--container").size("100%", "100%").addClass("drawing-area").fill("none").stroke({
        color: "#ffffff",
        width: 3
      }).polygon().draw({ snapToGrid: 20 });
      this.drawing = true;
      let svgDraw = document.getElementsByClassName("svg--flat");
      for (let i = 0; i < svgDraw.length; i++) {
        svgDraw[i].classList.add("lock");
      }

      poly2.on("drawstart", function(e: any) {
        document.addEventListener("keydown", function(e) {
          if (e.keyCode == 13 || e.which == 13) {
            poly2.draw("done");
            poly2.off("drawstart");
          } else if (e.keyCode == 27 || e.which == 27) {
            poly2.draw("cancel");
            let drawingArea: any = document.getElementsByClassName("drawing-area");
            while (drawingArea.length > 0) {
              drawingArea[0].parentNode.removeChild(drawingArea[0]);
            }

          }
          for (let i = 0; i < svgDraw.length; i++) {
            svgDraw[i].classList.remove("lock");
          }
          _self.drawing = false;
        });
      });
      let node: any = null;
      let parentNode: any = null;
      poly2.on("drawdone", function() {
        node = poly2.node;
        parentNode = poly2.node.parentNode;
        const bBox: SVGRect = node.getBBox();
        let points = node.points;
        let arrayPoints: Array<SVGPointList> = _.cloneDeep([...points]);
        let _arrayCoordinates: Array<Coordinates> = [];
        arrayPoints.map((point: any) => {
          const _point = new Coordinates(point.x - bBox.x + 20, point.y - bBox.y + 20);
          _arrayCoordinates.push(_point);
          return point;
        });
        let _position = new SVGPosition(bBox.height, bBox.width, bBox.x, bBox.y);
        _svg = new SVG(random(15, "svg_"), _position, _arrayCoordinates);
        _self.listGraphics.push(_svg);
        parentNode.remove();
      });


    },
    onWheelBuilderContainer(e: any) {
      if (!this.clickPress && !this.keySpacePress) return false;
      e.preventDefault();
      let xs = (e.clientX - this.builderPosition.x) / this.scale;
      let ys = (e.clientY - this.builderPosition.y) / this.scale;
      let delta = (e.wheelDelta ? e.wheelDelta : -e.deltaY);
      (delta > 0) ? (this.scale *= 1.2) : (this.scale /= 1.2);
      this.builderPosition.x = e.clientX - xs * this.scale;
      this.builderPosition.y = e.clientY - ys * this.scale;
      this.tempBuilderPosition = _.cloneDeep(this.builderPosition);
    }
  },
  computed: {
    computedCoordinates(): Coordinate {
      return {
        x: (this.clickPress && this.keySpacePress) ? this.initPositionCursor.x - this.positionCursor.x : 0,
        y: (this.clickPress && this.keySpacePress) ? this.initPositionCursor.y - this.positionCursor.y : 0
      };
    },
    transformComputed(): string {
      if (this.clickPress && this.keySpacePress) {
        this.builderPosition.x = this.tempBuilderPosition.x - this.computedCoordinates.x;
        this.builderPosition.y = this.tempBuilderPosition.y - this.computedCoordinates.y;
        return "matrix(" + this.scale + ", 0, 0, " + this.scale + ", " + this.builderPosition.x + ", " + this.builderPosition.y + ")";
      } else {
        return "matrix(" + this.scale + ", 0, 0, " + this.scale + ", " + this.builderPosition.x + ", " + this.builderPosition.y + ")";
      }
    }
  },
  mounted(): void {
    this.tempBuilderPosition = _.cloneDeep(this.builderPosition);

  },
  destroyed(): void {
  }
});
</script>

<style lang="scss">
.code--floating {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 300px;
  background: white;
}

.builder {
  &--container {
    position: relative;
    overflow: hidden;
    background-color: #38415f;
    flex: 1;
    height: calc(100vh - 80px);
    width: 100vw;
    outline: none;
  }

  &--actions {
    height: 80px;
    background: #F0F2F8;
    padding: 0 16px;
  }

  &--grap {
    &--cursor {
      cursor: grab;

      &--click {
        cursor: grabbing;
      }
    }
  }
}

.pre_code {
  overflow: auto;
  height: 80vh;
}
</style>
