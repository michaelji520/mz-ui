<template>
  <div id="app" class="mz-ui">
    <div class="navbar"></div>
    <div class="container">
      <div class="component-wrapper">
        <mz-tab title="多标签页示例" v-model="active" :tabs="tabs">
          <div tab-name="first">123</div>
          <div tab-name="second">456</div>
        </mz-tab>
      </div>
    </div>
  </div>
</template>

<script>
import MzTab from './components/mz-tab/mz-tab';

export default {
  name: 'app',
  components: {
    MzTab
  },
  data() {
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
      ]
    }
  }
}
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
    background-color: #42C57A;
  }
  .container {
    display: flex;
    flex-wrap: wrap;
    width: calc(100% - 160px);
    overflow: auto;
  }
  .component-wrapper {
    width: 100%;
    height: fit-content;
    flex-shrink: 0;
    padding: 24px 48px;
    background: #F0F1F2;
  }
}
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
