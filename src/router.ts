import Vue from "vue";
import Router from "vue-router";
import Home from "./views/home.vue";
import VueSocketIOExt from "vue-socket.io-extended";
import { io } from "socket.io-client";
Vue.use(Router);

export default new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        {
            path: "/",
            name: "home",
            component: Home,
        },
        {
            path: "/:roomId",
            name: "room",
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "enter_room" */ "./views/enter_room.vue"),
            beforeEnter: (to, from, next) => {
                const socket = io(`${process.env.VUE_APP_SIGNALING_SERVER}?room=${to.params.roomId}`, {
                    autoConnect: false,
                });
                Vue.use(VueSocketIOExt, socket);
                next();
            },
        },
    ],
});
