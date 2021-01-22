<template>
    <v-container v-if="showRoom" class="grey lighten-5">
        <v-row no-gutters>
            <v-col v-for="(user, index) in streams" :key="index" cols="12" sm="4">
                <v-card class="pa-2" outlined tile>
                    <room-video :user="user" :is-self="user.uuid === id"></room-video>
                </v-card>
            </v-col>
        </v-row>
        <v-btn @click="switchDevice('video')">Cam</v-btn>
        <v-btn @click="switchDevice('audio')">Mic</v-btn>
    </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { uuid } from "vue-uuid";
import { Socket } from "vue-socket.io-extended";
import { namespace } from "vuex-class";
import { ADD_USER_ACTION, ADD_STREAM_ACTION, REMOVE_USER_ACTION } from "@/store/actions";
import RoomVideo from "@/components/video.vue";
import { RoomStream } from "@/store/state";
import { GET_STREAMS, HAS_USER } from "@/store/getters";
import PC_CONFIG from "@/utils/constants";
const roomNs = namespace("room");

@Component({
    components: {
        RoomVideo,
    },
})
export default class Room extends Vue {
    @Prop() showRoom: boolean;
    @Prop() showVideo: boolean;
    @Prop() showAudio: boolean;
    @Prop() userName: string;
    @Prop() roomId: string;

    @roomNs.Action(ADD_USER_ACTION) addUser: any;
    @roomNs.Action(ADD_STREAM_ACTION) addStream: any;
    @roomNs.Action(REMOVE_USER_ACTION) removeUser: any;
    @roomNs.Getter(HAS_USER) hasUser: any;
    @roomNs.Getter(GET_STREAMS) streams: any;

    private id: string;
    private localStream: MediaStream;
    private pearConnections: { [key: string]: RTCPeerConnection } = {};

    @Socket("ready")
    async onReady() {
        // eslint-disable-next-line no-console
        console.debug("socket ready, register ", this.id);
        this.emitRegister("all");
    }

    @Socket("register")
    async onRegister(payload: any) {
        // eslint-disable-next-line no-console
        // console.debug("receive", payload, payload["to"] === "all");
        const uuid = payload["uuid"];
        if ((payload["to"] === this.id || payload["to"] === "all") && !this.hasUser(uuid)) {
            this.emitRegister(uuid);
            delete payload["to"];
            payload["events"] = [];
            await this.addUser(payload);
        }
        if (payload["to"] === this.id && this.hasUser(uuid)) {
            await this.registerPeerConnection(uuid);
            await this.sendOffer(uuid);
        }
    }

    @Socket("webrtc")
    async onWebrtc(payload: any) {
        // eslint-disable-next-line no-console
        // console.debug("received ", payload);
        if (payload["to"] == this.id) {
            await this.handleSignalingData(payload);
        }
    }

    @Watch("showRoom")
    private async onShowRoom() {
        this.id = uuid.v4();
        // eslint-disable-next-line no-console
        console.debug("my id ", this.id);
        await this.getLocalStream();
    }

    private async getLocalStream() {
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia({
                audio: this.showAudio,
                video: this.showVideo,
            });
            await this.addUser({ uuid: this.id, userName: this.userName, events: [] });
            await this.addStream({ uuid: this.id, event: this.localStream });
            this.$socket.client.connect();
            // eslint-disable-next-line no-console
            console.debug("Stream found");
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error("Stream not found: ", error);
        }
    }

    private async onAddStream(event: RTCTrackEvent, uuid: string) {
        // eslint-disable-next-line no-console
        console.debug("Receive stream ", event, uuid);
        const payload: RoomStream = {
            uuid: uuid,
            event: event,
        };
        await this.addStream(payload);
    }

    private async sendAnswer(uuid: string) {
        // eslint-disable-next-line no-console
        console.debug("Send answer", uuid);
        try {
            const connection = this.pearConnections[uuid];
            const answer = await connection.createAnswer();
            await connection.setLocalDescription(answer);
            this.emitWebrtc(answer, uuid);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error("sendAnswer failed: ", error);
        }
    }

    private registerPeerConnection(uuid: string) {
        try {
            const pearConnection: RTCPeerConnection = new RTCPeerConnection(PC_CONFIG);
            pearConnection.onicecandidate = (evt) => this.onIceCandidate(evt, uuid);
            this.localStream.getTracks().forEach((track) => pearConnection.addTrack(track, this.localStream));
            pearConnection.ontrack = (evt) => this.onAddStream(evt, uuid);
            pearConnection.oniceconnectionstatechange = (evt) => this.checkPeerDisconnect(evt, uuid);
            // eslint-disable-next-line no-console
            console.log("register peer connection", uuid, pearConnection);
            this.pearConnections[uuid] = pearConnection;
            return pearConnection;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error("PeerConnection failed: ", error);
        }
    }

    private onIceCandidate(evt: any, uuid: string) {
        if (evt.candidate) {
            // eslint-disable-next-line no-console
            console.debug("ICE candidate");
            const payload = { type: "candidate", candidate: evt.candidate };
            this.emitWebrtc(payload, uuid);
        }
    }

    private async sendOffer(uuid: string) {
        try {
            const connection = this.pearConnections[uuid];
            const offer = await connection.createOffer();
            await connection.setLocalDescription(offer);
            this.emitWebrtc(offer, uuid);
            // eslint-disable-next-line no-console
            console.debug("Create offer ", uuid, offer);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error("sendOffer failed: ", error);
        }
    }

    private async handleSignalingData(payload: any) {
        const webrtc: any = payload["webrtc"];
        const uuid = payload["uuid"];
        if (webrtc.type === "offer") {
            try {
                // eslint-disable-next-line no-console
                console.debug("Receive offer, setRemoteDescription and send answer. uuid: ", uuid);
                let connection = this.pearConnections[uuid];
                if (connection === undefined) {
                    connection = this.registerPeerConnection(uuid);
                }
                await connection.setRemoteDescription(new RTCSessionDescription(webrtc));
                await this.sendAnswer(uuid);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error("setRemoteDescription with type 'offer' failed : ", error);
            }
        }
        if (webrtc.type === "answer") {
            try {
                // eslint-disable-next-line no-console
                console.debug("Receive answer, setRemoteDescription. uuid: ", uuid);
                const connection = this.pearConnections[uuid];
                await connection.setRemoteDescription(new RTCSessionDescription(webrtc));
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error("setRemoteDescription with type 'answer' failed : ", error);
            }
        }
        if (webrtc.type === "candidate") {
            try {
                const connection = this.pearConnections[uuid];
                // eslint-disable-next-line no-console
                console.debug("Receive candidate, addIceCandidate");
                await connection.addIceCandidate(new RTCIceCandidate(webrtc.candidate));
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error("addIceCandidate with type 'candidate' failed : ", error);
            }
        }
    }

    private emitWebrtc(payload: any, to: string) {
        this.$socket.client.emit("webrtc", { to: to, uuid: this.id, webrtc: payload });
    }

    private emitRegister(to: string = undefined) {
        if (this.hasUser(to)) {
            return;
        }
        let payload: any = { uuid: this.id, userName: this.userName };
        if (to !== undefined) {
            // eslint-disable-next-line no-console
            console.debug("Send register to", to);
            payload["to"] = to;
        }
        this.$socket.client.emit("register", payload);
    }
    private async checkPeerDisconnect(event: any, uuid: string) {
        const peerCon = this.pearConnections[uuid].iceConnectionState;
        // eslint-disable-next-line no-console
        console.log(`connection with peer ${uuid} ${peerCon}`);
        if (peerCon === "failed" || peerCon === "closed" || peerCon === "disconnected") {
            delete this.pearConnections[uuid];
            await this.removeUser(uuid);
        }
    }

    private switchDevice(type: string) {
        const track = this.localStream.getTracks().find((track: any) => track.kind === type);
        if (track !== undefined) {
            track.enabled = !track.enabled;
        }
    }
}
</script>
