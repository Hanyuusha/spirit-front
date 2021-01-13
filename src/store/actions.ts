import { ActionTree } from "vuex";
import { IAppState } from "@/store";
import { ITypeStateRoom } from "./state";
import { RoomUser, RoomStream } from "./state";
import { ADD_USER_MUTATION, ADD_STREAM_MUTATION, REMOVE_USER_MUTATION } from "./mutations";

export const ADD_USER_ACTION = "ADD_USER_ACTION";
export const ADD_STREAM_ACTION = "ADD_STREAM_ACTION";
export const REMOVE_USER_ACTION = "REMOVE_USER_ACTION";

export const actions: ActionTree<ITypeStateRoom, IAppState> = {
    [ADD_USER_ACTION]: ({ commit }, payload: RoomUser) => {
        commit(ADD_USER_MUTATION, payload);
    },
    [ADD_STREAM_ACTION]: ({ commit }, payload: RoomStream) => {
        commit(ADD_STREAM_MUTATION, payload);
    },
    [REMOVE_USER_ACTION]: ({ commit }, uuid: string) => {
        commit(REMOVE_USER_MUTATION, uuid);
    },
};
