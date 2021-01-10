import Vue from "vue";
import Vuex from "vuex";
import { RoomStore } from "@/store/index";
Vue.use(Vuex);

export interface IAppState {
    isLoggedIn: Boolean;
}

export default new Vuex.Store({
    modules: {
        room: RoomStore,
    },
});
