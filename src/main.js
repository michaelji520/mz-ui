import Vue from 'vue'
import App from './App.vue'

// import icon font
import './assets/fonts/entypo/entypo.css';

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
