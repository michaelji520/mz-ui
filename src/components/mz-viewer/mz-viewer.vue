<template>
  <div :class="{'mz-viewer': true, 'hide': !visible}">
    <i class="icon-cancel close-btn" @click="closeViewer"></i>
    <img :src="list[innerIndex]" @mousedown.stop.prevent="move"/>
    <div class="tool-bar">
      <i @click="changeImg(-1)" class="icon-left-open-big"></i>
      <span>{{ `${innerIndex + 1}/${list.length}` }}</span>
      <i @click="changeImg(1)" class="icon-right-open-big"></i>
      <i @click="reset" class="icon-doc"></i>
      <i @click="scale += 0.05" class="iconfont icon-magnify-o"></i>
      <i @click="scaleImage(-0.05)" class="iconfont icon-shrink-o"></i>
      <i @click="rotate -= 90" class="iconfont icon-redo"></i>
      <i @click="rotate += 90" class="iconfont icon-undo"></i>
    </div>
  </div>
</template>

<script>

export default {
  name: 'mz-viewer',
  props: {
    current: {
      type: Number,
      default: 0
    },
    list: {
      type: Array,
      default: []
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      innerIndex: -1,
      scale: 1,
      rotate: 0,
      translateX: 0,
      translateY: 0,
      deltaX: 0,
      deltaY: 0
    };
  },
  watch: {
    current(val) {
      this.reset();
      this.innerIndex = val;
    },
    scale(val) {
      this.setElementStyle();
    },
    rotate(val) {
      this.setElementStyle();
    },
    deltaX(val) {
      this.setElementStyle();
    },
    deltaY(val) {
      this.setElementStyle();
    },
    translateX(val) {
      this.setElementStyle();
    },
    translateY(val) {
      this.setElementStyle();
    }
  },
  mounted() {
    this.innerIndex = this.current;
    window.addEventListener('mousewheel', (e) => {
      if (e.wheelDeltaY > 0) {
        this.scale += 0.05;
      } else if (this.scale > 0.2) {
        this.scale -= 0.05;
      }
    });
    const dom = document.querySelector('.mz-viewer > img');
    dom.onload = (e) => {
      dom.style.visibility = 'visible';
    };
  },
  methods: {
    scaleImage(val) {
      if (val <= 0 && this.scale <= 0.2) {
        return;
      } else {
        this.scale += val;
      }
    },
    setElementStyle() {
      const dom = document.querySelector('.mz-viewer > img');
      dom.style.transform = `rotate(${this.rotate}deg) scale(${this.scale})`;
      dom.style.marginLeft = `${(this.translateX + this.deltaX) * 2}px`;
      dom.style.marginTop = `${(this.translateY + this.deltaY) * 2}px`;
    },
    move(e) {
      const odiv = e.target; // 获取目标元素

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

        // 移动当前元素
        // this.setElementStyle()
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
      this.innerIndex = temp;
      const dom = document.querySelector('.mz-viewer > img');
      dom.style.visibility = 'hidden';
      setTimeout(() => {
        this.setElementStyle();
      }, 100);
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
      this.reset();
      this.$emit('update:visible', false);
    }
  }
}
</script>

<style lang="less" scoped>
.mz-viewer {
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
    max-height: 90%;
    max-width: 90%;
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
    background: rgba(0, 0, 0, 0.6);
    border-radius: 4px;
    font-size: 14px;
    line-height: 1;
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