import Vue from "vue";
import App from "./App.vue";
import $ from "jquery";
import axios from "./axios/services";
import server from "./axios/services";
import globalVgariable from "@/axios/global_variable.js";
import VueDraggableResizable from "vue-draggable-resizable";

// 可选择导入默认样式
import "vue-draggable-resizable/dist/VueDraggableResizable.css";
import { HappyScroll } from 'vue-happy-scroll'
//自定义组件名
Vue.component('happy-scroll', HappyScroll)
// 引入css
import 'vue-happy-scroll/docs/happy-scroll.css'

Vue.component("vue-draggable-resizable", VueDraggableResizable);
Vue.prototype.GLOBAL = globalVgariable;

window.jQuery = $;
window.$ = $;
Vue.prototype.$axios = axios;
Vue.prototype.$server = server;

Vue.config.productionTip = false;

new Vue({
    render: (h) => h(App),
}).$mount("#app");
