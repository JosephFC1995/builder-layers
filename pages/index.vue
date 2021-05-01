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
        id="builder--block"
      />
    </div>
    <div class="code--floating">
      <pre class="pre_code">
<!--        {{ positionCursor }}-->
        <!--        {{ clickPress }}-->
        <!--        {{ keySpacePress }}-->
        <!--        ====-->
        <!--        B-->
        <!--        {{ builderPosition }}-->
        <!--        ====-->
        <!--        {{ initPositionCursor }}-->
        <!--        ====-->
        <!--        {{ computedCoordinates }}-->
        <!--        ====-->
        <!--        {{ tempBuilderPosition }}-->
        {{ listGraphics }}
      </pre>
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
          data-action="start-draw" @click="drawMap">
          c
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
import { Position } from "~/classes/SVG/Position";
import { SVG } from "~/classes/SVG/SVG";

export default Vue.extend({
  data() {
    return {
      clickPress: false as boolean,
      keySpacePress: false as boolean,
      listGraphics: new Array<SVG>(),
      tempBuilderPosition: {
        x: 100,
        y: 100
      } as Coordinates,
      builderPosition: {
        x: 100,
        y: 100
      } as Coordinates,
      initPositionCursor: {
        x: 0,
        y: 0
      } as Coordinates,
      positionCursor: {
        x: 0,
        y: 0
      } as Coordinates,
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
      this.builderPosition = {
        x: 100,
        y: 100
      };
      this.scale = 1;
    },
    drawMap() {
      let _self = (this as any);
      let _svg = new SVG();
      var poly2 = new _self.$svg("builder--block--container").size("100%", "100%").fill("none").stroke("#fff").polygon().draw({ snapToGrid: 20 });

      poly2.on("drawstart", function(e: any) {
        document.addEventListener("keydown", function(e) {
          if (e.keyCode == 13 || e.which == 13) {
            poly2.draw("done");
            poly2.off("drawstart");
          }
        });
      });
      let node: any = null;
      let parentNode: any = null;
      poly2.on("drawstop", function() {
        console.log(poly2);
        node = poly2.node;
        parentNode = poly2.node.parentNode;
        let id = node.id;
        console.log(node);
        console.log(parentNode);
        console.log("========");
        const bBox: object = node.getBBox();
        var points = node.points;
        console.log({ points });
        console.log({ bBox });
        let arrayPoints: Array<SVGPointList> = _.cloneDeep([...points]);
        let _arrayCoordinates: Array<Coordinates> = [];
        arrayPoints.map((point: any) => {
          let _point = new Coordinates();
          _point.x = point.x - bBox.x;
          _point.y = point.y - bBox.y;
          _arrayCoordinates.push(_point);
          return point;
        });
        console.log(bBox);
        let _position = new Position();
        _position.setBbox(bBox);
        _svg.position = _position;
        _svg.d = _arrayCoordinates;
        // _svg.d = arrayPoints;
        _self.listGraphics.push(_svg);
        // parentNode.style.position = "absolute";
        // parentNode.style.transform = "translate(" + bBox.x + "px, " + bBox.y + "px)";
        // parentNode.attributes.width.value = bBox.width + "px";
        // parentNode.attributes.height.value = bBox.height + "px";
        // console.log(arrayPoints);
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
    computedCoordinates(): Coordinates {
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
    // var draw = SVG("builder--block--container").style({
    //   cursor: 'pointer',
    //   position: 'absolute',
    //   width: '100px',
    //   height: '100px'
    // });
    // let rect = draw.rect(100, 100).move(0, 0).fill("#f06");
    // rect.selectize().resize();


    //poly2.selectize();
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
