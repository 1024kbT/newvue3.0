import Vue from 'vue'
import App from './App.vue'
import $ from 'jquery';
import axios from './axios/services'
import server from './axios/services';
import globalVgariable from '@/axios/global_variable.js'
Vue.prototype.GLOBAL = globalVgariable;

window.jQuery = $;
window.$ = $;
Vue.prototype.$axios = axios;
Vue.prototype.$server = server;

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
