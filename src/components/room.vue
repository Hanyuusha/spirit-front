<template>
    <div v-if="showRoom" class="home">
        <room-video v-for="(stream, index) in streams || []" :key="index" :user="stream"></room-video>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { Socket } from "vue-socket.io-extended";
import { namespace } from "vuex-class";
import RTCPeer from "@/api/rtc_peer";
import { ADD_USER_ACTION, ADD_STREAM_ACTION } from "@/store/actions";
import RoomVideo from "@/components/video.vue";

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
    @roomNs.State((state) => state.ShowStreams) streams: any;
    private peer: RTCPeer;

    @Socket("ready")
    async onReady() {
        // eslint-disable-next-line no-console
        console.debug("socket ready");
        await this.peer.sendOffer();
    }

    @Socket("data")
    async onData(payload: any) {
        // eslint-disable-next-line no-console
        // console.debug("socket receive", payload);
        const user = await this.peer.handleSignalingData(payload);
        if (user !== undefined) {
            await this.addUser(user);
        }
    }

    @Watch("showRoom")
    private async onShowRoom() {
        await this.getLocalStream();
    }

    private async getLocalStream() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: this.showAudio, video: this.showVideo });
            // eslint-disable-next-line no-console
            console.debug("Stream found");
            this.peer = new RTCPeer(stream, this.emit);
            this.peer.createPeerConnection();
            this.peer.setOnAddStream(this.onAddStream);
            this.$socket.client.connect();
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error("Stream not found: ", error);
        }
    }

    private async onAddStream(event: RTCTrackEvent) {
        const cnameRgx = /a=ssrc:\d+\scname:\{([\w\d-]+)\}/gi;
        // @ts-ignore
        const lines = event.originalTarget.remoteDescription["sdp"].split("\r\n");
        lines.find((line: string) => cnameRgx.test(line));
        if (RegExp.$1 !== null) {
            await this.addStream({ cname: RegExp.$1, stream: event });
        }
    }

    public emit(payload: any) {
        this.$socket.client.emit("data", { userName: this.userName, ...payload });
    }
}
</script>
