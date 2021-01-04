import Vue from "vue";
import app from "./app.vue";
import router from "./router";
import store from "./store";
import VueSocketIOExt from "vue-socket.io-extended";
import { io } from "socket.io-client";

const socket = io(process.env.VUE_APP_SIGNALING_SERVER, { autoConnect: false });

Vue.use(VueSocketIOExt, socket);

new Vue({
    router,
    store,
    render: (h) => h(app),
}).$mount("#app");
