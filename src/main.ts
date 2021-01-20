import Vue from "vue";
import app from "./app.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(app),
}).$mount("#app");
