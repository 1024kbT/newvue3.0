import Vue from "vue";
// @ts-ignore
import App from "./App.vue";
import $ from "jquery";
import axios from "./axios/services";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import server from "./axios/services";
// @ts-ignore
import globalVgariable from "@/axios/global_variable.js";
// @ts-ignore
import VueDraggableResizable from "vue-draggable-resizable";

// 可选择导入默认样式
import "vue-draggable-resizable/dist/VueDraggableResizable.css";
// @ts-ignore
import { HappyScroll } from 'vue-happy-scroll'
//自定义组件名
Vue.component('happy-scroll', HappyScroll)
Vue.use(ElementUI);
// 引入css
import 'vue-happy-scroll/docs/happy-scroll.css'

Vue.component("vue-draggable-resizable", VueDraggableResizable);
Vue.prototype.GLOBAL = globalVgariable;

// @ts-ignore
window.jQuery = $;
// @ts-ignore
window.$ = $;
Vue.prototype.$axios = axios;
Vue.prototype.$server = server;

Vue.config.productionTip = false;

new Vue({
    render: (h) => h(App),
}).$mount("#app");
