<template>
  <div id="app" class="mz-ui">
    <nav-bar></nav-bar>
    <div class="container">
      <div class="component-wrapper">
        <mz-tab title="多标签页示例" v-model="active" :tabs="tabs">
          <div tab-name="first">123</div>
          <div tab-name="second">456</div>
        </mz-tab>
      </div>
      <div class="component-wrapper">
        <div class="img-wrapper">
          <img @click="viewerVisible = !viewerVisible" src="https://static.zhangji.xyz/FsXIbP9YH809wcFKjcLvT1TYvKXN" alt="">
          <img @click="viewerVisible = !viewerVisible" src="https://static.zhangji.xyz/FsXIbP9YH809wcFKjcLvT1TYvKXN" alt="">
        </div>
        <mz-viewer :current="currentImgIndex" :list="imgSrcList" :visible.sync="viewerVisible"></mz-viewer>
      </div>
    </div>
  </div>
</template>

<script>
import MzTab from './components/mz-tab/mz-tab';
import MzViewer from './components/mz-viewer/mz-viewer';
import NavBar from './views/Navbar';

export default {
  name: 'app',
  components: {
    MzTab, MzViewer, NavBar
  },
  data () {
    return {
      active: 'first',
      tabs: [
        {
          label: 'tab 1',
          value: 'first'
        },
        {
          label: 'tab 2',
          value: 'second'
        }
      ],
      currentImgIndex: 0,
      imgSrcList: ['https://static.zhangji.xyz/FsXIbP9YH809wcFKjcLvT1TYvKXN', 'https://static.zhangji.xyz/FqOUEtt6RZYuEQePwuarzpT8HIKh'],
      viewerVisible: false
    };
  }
};
</script>

<style lang="less">
.mz-ui {
  display: flex;
  height: 100%;
  * {
    box-sizing: border-box;
  }
  .navbar {
    width: 160px;
  }
  .container {
    display: flex;
    flex-wrap: wrap;
    width: calc(100% - 160px);
    overflow: auto;
    flex-direction: column;
  }
  .component-wrapper {
    width: 100%;
    height: fit-content;
    flex-shrink: 0;
    padding: 24px 48px;
    background: #F0F1F2;
    &+.component-wrapper {
      margin-top: 16px;
    }
  }
  .img-wrapper {
    height: 100px;
    background: #FFF;
    img {
      max-height: 100%;
      &+img {
        margin-left: 8px;
      }
    }
  }
}
</style>
