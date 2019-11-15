<!--
  Copyright (c) 2014-2019 NighthawkStudio, All rights reserved.
  @fileoverview multiple tab component
  @author Michael Zhang | michaelji520@gmail.com
  @version 1.0 | 2019-01-17 | initial multiple tab component
 -->
<template>
  <div class="mz-tab" ref="tabWrapper">
    <div class="header">
      <h2 class="title" v-if="title">{{ title }}</h2>
      <div class="tabs-bar" v-if="tabs && tabs.length">
        <div class="move-bar"></div>
        <ul ref="tabs">
          <li
            v-for="tab in tabs"
            :key="tab.value"
            :class="value === tab.value ? 'is-active' : ''"
            :tab-name="tab.value"
            @click="switchTab(tab, $event)">{{ tab.label }}</li>
        </ul>
      </div>
      <div class="header-end">
        <slot name="header-end"></slot>
      </div>
    </div>
    <div class="tab-content" ref="tabContent">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import ResizeObserver from 'resize-observer-polyfill';

export default {
  name: 'mz-tab',
  props: {
    // current title
    title: {
      type: String,
      default: ''
    },
    // current active tab
    value: {},
    // tab list
    tabs: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      ro: ''
    };
  },
  watch: {
    value() {
      this.$nextTick(() => {
        this.setCurrentTab();
      });
    }
  },
  mounted() {
    this.setCurrentTab();
    if (ResizeObserver) {
      this.ro = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          this.setCurrentTab();
        });
      });
      if (this.ro && this.$refs.tabs) {
        this.ro.observe(this.$refs.tabs);
      }
    }
  },
  methods: {
    // 设置当前激活的标签样式
    setCurrentTab() {
      if (this.tabs && this.tabs.length && this.$refs.tabWrapper && this.$refs.tabs) {
        let activeBar = this.$refs.tabWrapper.querySelector('.tabs-bar .move-bar');
        let tabs = this.$refs.tabs;
        let activeNav = tabs.querySelector('li.is-active') || tabs.querySelector('li:first-child');
        activeBar.style.width = (activeNav.clientWidth || 0) + 'px';
        activeBar.style.transform = `translateX(${activeNav.offsetLeft}px)`;
        let tabName = activeNav.getAttribute('tab-name');
        this.displayContent(tabName);
      }
    },
    // 切换标签页
    switchTab(tab, evt) {
      if (tab.value === this.value) {
        return;
      }
      let activeBar = this.$refs.tabWrapper.querySelector('.tabs-bar .move-bar');
      activeBar.style.width = evt.target.clientWidth + 'px';
      activeBar.style.transform = `translateX(${evt.target.offsetLeft}px)`;
      this.$emit('input', tab.value);
      this.$emit('tab-click', tab, event);
      this.displayContent(tab.value);
    },
    displayContent(tabName) {
      if (!this.$refs.tabs) {
        return;
      }
      let contents = this.$refs.tabContent.children;
      for (let i = 0; i < contents.length; i++) {
        if (contents[i].getAttribute('tab-name') && contents[i].getAttribute('tab-name') !== tabName) {
          contents[i].style.display = 'none';
        } else {
          contents[i].style.display = '';
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
@deep: ~'>>>';
.mz-tab {
  width: 100%;
  border-radius:2px 2px 0px 0px;
  background: #FFF;
  .header {
    box-sizing: border-box;
    font-size: 0;
    height: 48px;
    border-bottom: 1px solid #F0F1F5;
    display: flex;
    align-items: center;
    .title {
      margin-left: 16px;
      font-size: 16px;
      display: inline-block;
      font-weight: bold;
      height: 48px;
      line-height: 48px;
      margin-right: 24px;
    }
    .header-end {
      font-size: 12px;
      flex: 1;
      height: 100%;
      display: flex;
      align-items: center;
    }
  }
  .tabs-bar {
    display: inline-block;
    position: relative;
    margin-left: 16px;
    ul {
      padding: 0;
      margin: 0;
    }
    li {
      display: inline-block;
      color: #525354;
      font-size: 14px;
      margin: 0 32px 0 0;
      line-height: 48px;
      position: relative;
      cursor: pointer;
      &:hover {
        color: #42c57a;
      }
    }
    .is-active {
      color: #42c57a;
    }
  }
  .move-bar {
    top: 46px;
    left: 0px;
    background: #22C166;
    height: 2px;
    position: absolute;
    transition: transform .3s cubic-bezier(.645,.045,.355,1);
  }
}
</style>
