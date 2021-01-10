import { IAppState } from "@/store";
import { Module } from "vuex";

import { getters } from "./getters";
import { mutations } from "./mutations";
import { actions } from "./actions";
import { state, ITypeStateRoom } from "./state";

export const RoomStore: Module<ITypeStateRoom, IAppState> = {
    namespaced: true,
    state: {
        ...state,
    },
    getters: {
        ...getters,
    },
    mutations: {
        ...mutations,
    },
    actions: {
        ...actions,
    },
};
