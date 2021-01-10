import { MutationTree } from "vuex";
import { ITypeStateRoom, RoomUser } from "./state";
export const ADD_USER_MUTATION = "ADD_USER_MUTATION";
export const ADD_STREAM_MUTATION = "ADD_STREAM_MUTATION";
export const UPDATE_UI_MUTATION = "UPDATE_UI_MUTATION";
export const mutations: MutationTree<ITypeStateRoom> = {
    [ADD_USER_MUTATION]: (state: ITypeStateRoom, user: RoomUser) => {
        if (state.Streams === null) {
            state.Streams = {};
        }

        state.Streams[user.cname].userName = user.userName;
        state.Streams[user.cname].peerId = user.peerId;
    },
    [ADD_STREAM_MUTATION]: (state: ITypeStateRoom, payload: any) => {
        if (state.Streams == null) {
            state.Streams = {};
        }
        const cname = payload["cname"];
        if (state.Streams[cname] == null) {
            state.Streams[cname] = { userName: "", peerId: "", cname: cname, events: [] };
        }
        state.Streams[cname].events.push(payload["stream"]);
    },
    [UPDATE_UI_MUTATION]: (state: ITypeStateRoom) => {
        // eslint-disable-next-line no-console
        console.log("UPDATE_UI_MUTATION");
        state.ShowStreams = Object.values(state.Streams).filter(
            (user: RoomUser) => user.events.length > 1 && user.userName !== "",
        );
    },
};
