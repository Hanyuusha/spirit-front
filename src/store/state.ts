export interface ITypeStateRoom {
    Streams: { [key: string]: RoomUser };
    ShowStreams: RoomUser[];
}

export type RoomUser = {
    peerId: string;
    cname: string;
    userName: string;
    events?: RTCTrackEvent[];
};

export const state: ITypeStateRoom = {
    Streams: null,
    ShowStreams: null,
};
