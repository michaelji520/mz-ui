<template>
  <div :class="{'mz-viewer': true, 'hide': !visible}">
    <i class="mz-icon error-circle-o close-btn" @click="closeViewer"></i>
    <img :src="list[innerIndex]" @mousedown.stop.prevent="move" :style="imgStyle" alt="loading image"/>
    <div class="tool-bar">
      <i @click="changeImg(-1)" class="mz-icon arrowLeft-o"></i>
      <span>{{ `${innerIndex + 1}/${list.length}` }}</span>
      <i @click="changeImg(1)" class="mz-icon arrowRight-o"></i>
      <i @click="reset" class="mz-icon self-adaption-o"></i>
      <i @click="scaleImage(scaleRatio)" class="mz-icon magnify-o"></i>
      <i @click="scaleImage(-scaleRatio)" class="mz-icon shrink-o"></i>
      <i @click="rotateImage(-90)" class="mz-icon redo"></i>
      <i @click="rotateImage(90)" class="mz-icon undo"></i>
    </div>
  </div>
</template>

<script>
import { rafThrottle } from '@/common/util';

export default {
  name: 'mz-viewer',
  props: {
    // default display image index
    current: {
      type: Number,
      default: 0
    },
    // image list
    list: {
      type: Array,
      default: []
    },
    // viewer visible flag
    visible: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      // image index of img viewer
      innerIndex: -1,
      scale: 1,
      rotate: 0,
      translateX: 0,
      translateY: 0,
      deltaX: 0,
      deltaY: 0,
      // image scale ratio of each zoom
      scaleRatio: 0.02
    };
  },
  watch: {
    current(val) {
      this.reset();
      this.innerIndex = val;
    }
  },
  computed: {
    imgStyle() {
      return {
        transform: `scale(${this.scale}) rotate(${this.rotate}deg)`,
        marginLeft: `${(this.translateX + this.deltaX) * 2}px`,
        marginTop: `${(this.translateY + this.deltaY) * 2}px`
      }
    }
  },
  mounted() {
    this.innerIndex = this.current;
    this.deviceSupportInstall();
    const dom = document.querySelector('.mz-viewer > img');
    dom.onload = (e) => {
      dom.style.visibility = 'visible';
    };
  },
  methods: {
    // add support for mouse wheel & arrow keys
    deviceSupportInstall() {
      this._mouseWheelHandler = rafThrottle((e) => {
        if (e && e.wheelDeltaY > 0) {
          this.scale += this.scaleRatio;
        } else if (this.scale > 0.2) {
          this.scale -= this.scaleRatio;
        }
      });
      window.addEventListener('mousewheel', this._mouseWheelHandler);
      this._keyDownHandler = rafThrottle((e) => {
        const code = e.keyCode;
        switch (code) {
          // ESC
          case 27:
            this.closeViewer()
            break;
          // LEFT ARROW
          case 37:
            this.changeImg(-1);
            break;
          // UP ARROW
          case 38:
            this.scaleImage(this.scaleRatio);
            break;
          case 39:
            this.changeImg(1);
            break;
          case 40:
            this.scaleImage(-this.scaleRatio);
            break;
        }
      });
      window.addEventListener('keydown', this._keyDownHandler);
    },
    deviceSupportUninstall() {
      window.removeEventListener('mousewheel', this._mouseWheelHandler);
      window.removeEventListener('keydown', this._keyDownHandler);
    },
    rotateImage(val) {
      this.rotate += val;
    },
    scaleImage(val) {
      if (val <= 0 && this.scale <= 0.2) {
        return;
      } else {
        this.scale += val;
      }
    },
    move(e) {
      // 算出鼠标相对元素的位置
      const disX = e.clientX;
      const disY = e.clientY;
      document.onmousemove = (e) => {
        // 鼠标按下并移动的事件
        // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        const left = e.clientX - disX;
        const top = e.clientY - disY;

        // 绑定元素位置到positionX和positionY上面
        this.deltaY = top;
        this.deltaX = left;
      };
      document.onmouseup = (e) => {
        this.translateX += this.deltaX;
        this.translateY += this.deltaY;
        this.deltaX = 0;
        this.deltaY = 0;
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
    changeImg(num) {
      this.reset();
      let temp = this.innerIndex + num;
      if (temp < 0) {
        temp = this.list.length - 1;
      }
      if (temp > this.list.length - 1) {
        temp = 0;
      }
      if(this.innerIndex !== temp) {
        this.innerIndex = temp;
        const dom = document.querySelector('.mz-viewer > img');
        dom.style.visibility = 'hidden';
      }
    },
    reset() {
      this.scale = 1;
      this.rotate = 0;
      this.translateX = 0;
      this.translateY = 0;
      this.deltaX = 0;
      this.deltaY = 0;
    },
    closeViewer() {
      this.deviceSupportUninstall();
      this.reset();
      this.$emit('update:visible', false);
    }
  }
}
</script>

<style lang="less" scoped>
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.mz-viewer {
  -webkit-animation-name: fadeIn;
  -webkit-animation-duration: .3s;
  -webkit-animation-iteration-count: 1;
  -webkit-animation-delay: 0s;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  margin: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.7);
  overflow: hidden;
  img {
    transform: scale(1) rotate(0deg);
    margin-left: 0px;
    margin-top: 0px;
    max-height: 100%;
    max-width: 100%;
    transition: transform 0.2s ease 0s;
  }
  .tool-bar {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 16px;
    margin: auto 0;
    bottom: 10%;
    color: #fff;
    z-index: 1;
    width: 438px;
    height: 40px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 20px;
    font-size: 14px;
    line-height: 1;
    box-shadow: 0px 0px 8px 1px #333;
    i {
      cursor: pointer;
    }
  }
  .close-btn {
    cursor: pointer;
    position: absolute;
    right: 16px;
    top: 16px;
    font-size: 32px;
    color: #fff;
    z-index: 1;
    box-shadow: 0px 0px 8px 1px #83868f;
    border-radius: 50%;
    background: rgba(255,255,255,0.25);
  }
}
.hide {
  display: none;
}
</style>
