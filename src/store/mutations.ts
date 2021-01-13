import { MutationTree } from "vuex";
import { ITypeStateRoom, RoomUser, RoomStream } from "./state";
export const ADD_USER_MUTATION = "ADD_USER_MUTATION";
export const REMOVE_USER_MUTATION = "REMOVE_USER_MUTATION";
export const ADD_STREAM_MUTATION = "ADD_STREAM_MUTATION";

export const mutations: MutationTree<ITypeStateRoom> = {
    [ADD_USER_MUTATION]: (state: ITypeStateRoom, user: RoomUser) => {
        state.Users.push(user);
        // eslint-disable-next-line no-console
        console.log("ADD_USER_MUTATION", user);
    },
    [ADD_STREAM_MUTATION]: (state: ITypeStateRoom, payload: RoomStream) => {
        const user = state.Users.find((user: RoomUser) => user.uuid === payload.uuid);
        user.events.push(payload.event);
        // eslint-disable-next-line no-console
        console.log("ADD_STREAM_MUTATION", payload);
    },
    [REMOVE_USER_MUTATION]: (state: ITypeStateRoom, uuid: string) => {
        const user = state.Users.find((user: RoomUser) => user.uuid === uuid);
        const index = state.Users.indexOf(user);
        state.Users.splice(index, 1);
        // eslint-disable-next-line no-console
        console.log("REMOVE_USER_MUTATION", uuid);
    },
};
