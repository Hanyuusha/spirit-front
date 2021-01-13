export interface ITypeStateRoom {
    Users: RoomUser[];
}

export type RoomUser = {
    uuid: string;
    userName: string;
    events?: RTCTrackEvent[];
};

export type RoomStream = {
    uuid: string;
    event: RTCTrackEvent;
};

export const state: ITypeStateRoom = {
    Users: [],
};
