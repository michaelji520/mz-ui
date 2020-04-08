<template>
  <div class="navbar">
    <div class="title">组件列表</div>
    <ul>
      <li v-for="(comp, idx) in list" :key="idx">
        {{ comp.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      list: [
        {
          name: '多标签页',
          path: 'multi-tab'
        }
      ]
    };
  }

};
</script>

<style lang="less" scoped>
@import '../common/colors.less';
.navbar {
  padding: 0 16px;
  .title {
    color: @color-black;
    font-size: 20px;
    line-height: 48px;
  }
}
</style>
