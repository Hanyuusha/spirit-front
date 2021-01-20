import { GetterTree } from "vuex";
import { IAppState } from "@/store";
import { ITypeStateRoom, RoomUser } from "./state";
export const GET_STREAMS = "GET_STREAMS";
export const HAS_USER = "HAS_USER";
export const getters: GetterTree<ITypeStateRoom, IAppState> = {
    [GET_STREAMS]: (state) => {
        if (state.Users != null) {
            return Object.values(state.Users).filter(
                (user: RoomUser) => user.events != undefined && user.events.length > 0,
            );
        }
        return [];
    },
    [HAS_USER]: (state) => (uuid: string) => {
        return state.Users != null && state.Users.find((user: RoomUser) => user.uuid === uuid) != undefined;
    },
};
