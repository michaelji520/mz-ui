import Vue from 'vue';
import App from './App.vue';

// import global style reset less file
import './common/reset.less';

import router from './router';
import store from './store';
import service from './common/service';

// import icon font
import './assets/fonts/font_1510462_l8yhjxtxk1m.css';

Vue.config.productionTip = false;

Vue.prototype.$service = service;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
