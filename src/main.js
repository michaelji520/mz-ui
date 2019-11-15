import Vue from 'vue'
import App from './App.vue'

// import global style reset less file
import './common/reset.less';

// import icon font
import './assets/fonts/font_1510462_1w78kq29mde.css';

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
