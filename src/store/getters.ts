import { GetterTree } from "vuex";
import { IAppState } from "@/store";
import { ITypeStateRoom, RoomUser } from "./state";
export const GET_STREAMS = "GET_STREAMS";
export const getters: GetterTree<ITypeStateRoom, IAppState> = {
    [GET_STREAMS]: (state) => {
        if (state.Streams != null) {
            return Object.values(state.Streams).filter(
                (user: RoomUser) => user.events.length == 2 && user.userName !== "",
            );
        }
        return [];
    },
};
