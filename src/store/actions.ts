import { ActionTree } from "vuex";
import { IAppState } from "@/store";
import { ITypeStateRoom } from "./state";
import { RoomUser } from "./state";
import { ADD_USER_MUTATION, ADD_STREAM_MUTATION, UPDATE_UI_MUTATION } from "./mutations";

export const ADD_USER_ACTION = "ADD_USER_ACTION";
export const ADD_STREAM_ACTION = "ADD_STREAM_ACTION";

export const actions: ActionTree<ITypeStateRoom, IAppState> = {
    [ADD_USER_ACTION]: ({ commit }, payload: RoomUser) => {
        // eslint-disable-next-line no-console
        console.log("ADD_USER_ACTION", payload);
        commit(ADD_USER_MUTATION, payload);
        commit(UPDATE_UI_MUTATION);
    },
    [ADD_STREAM_ACTION]: ({ commit }, payload: any) => {
        // eslint-disable-next-line no-console
        console.log("ADD_STREAM_ACTION", payload);
        commit(ADD_STREAM_MUTATION, payload);
    },
};
