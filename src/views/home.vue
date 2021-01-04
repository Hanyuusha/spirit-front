<template>
    <div class="home">
        <video ref="remoteStream" autoplay playsinline width="100%" height="100%"></video>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Socket } from "vue-socket.io-extended";

@Component({})
export default class Home extends Vue {
    private localStream: MediaStream;
    public pearConnection: RTCPeerConnection;
    private TURN_SERVER_URL = "localhost:3478";
    private TURN_SERVER_USERNAME = "username";
    private TURN_SERVER_CREDENTIAL = "credential";
    // WebRTC config: you don't have to change this for the example to work
    // If you are testing on localhost, you can just use PC_CONFIG = {}
    private PC_CONFIG = {
        iceServers: [
            {
                urls: "turn:" + this.TURN_SERVER_URL + "?transport=tcp",
                username: this.TURN_SERVER_USERNAME,
                credential: this.TURN_SERVER_CREDENTIAL,
            },
            {
                urls: "turn:" + this.TURN_SERVER_URL + "?transport=udp",
                username: this.TURN_SERVER_USERNAME,
                credential: this.TURN_SERVER_CREDENTIAL,
            },
        ],
    };

    @Socket("ready")
    onReady() {
        // eslint-disable-next-line no-console
        console.debug("socket ready");
        this.sendOffer();
    }

    @Socket("data")
    onData(payload: any) {
        // eslint-disable-next-line no-console
        console.debug("socket receive", payload);
        this.handleSignalingData(payload);
    }

    constructor() {
        super();
        this.getLocalStream();
    }

    private getLocalStream() {
        navigator.mediaDevices
            .getUserMedia({ audio: true, video: true })
            .then((stream) => {
                // eslint-disable-next-line no-console
                console.debug("Stream found");
                this.localStream = stream;
                this.createPeerConnection();
                this.$socket.client.connect();
            })
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.error("Stream not found: ", error);
            });
    }

    private createPeerConnection() {
        try {
            this.pearConnection = new RTCPeerConnection(this.PC_CONFIG);
            this.pearConnection.onicecandidate = this.onIceCandidate;
            this.localStream.getTracks().forEach((track) => this.pearConnection.addTrack(track, this.localStream));
            this.pearConnection.ontrack = this.onAddStream;
            // eslint-disable-next-line no-console
            console.debug("PeerConnection created", this.pearConnection);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error("PeerConnection failed: ", error);
        }
    }

    private sendOffer() {
        // eslint-disable-next-line no-console
        console.debug("Send offer");
        this.pearConnection.createOffer().then(this.setAndSendLocalDescription, (error) => {
            // eslint-disable-next-line no-console
            console.error("Send offer failed: ", error);
        });
    }

    private sendAnswer() {
        // eslint-disable-next-line no-console
        console.debug("Send answer");
        this.pearConnection.createAnswer().then(this.setAndSendLocalDescription, (error) => {
            // eslint-disable-next-line no-console
            console.error("Send answer failed: ", error);
        });
    }

    private setAndSendLocalDescription(sessionDescription: any) {
        this.pearConnection.setLocalDescription(sessionDescription);
        // eslint-disable-next-line no-console
        console.debug("Local description set");
        this.emit(sessionDescription);
    }

    private onIceCandidate(event: RTCPeerConnectionIceEvent) {
        if (event.candidate) {
            // eslint-disable-next-line no-console
            console.debug("ICE candidate");
            this.emit({ type: "candidate", candidate: event.candidate });
        }
    }

    private onAddStream(event: RTCTrackEvent) {
        // eslint-disable-next-line no-console
        console.debug("Add stream", event);
        const el: any = this.$refs["remoteStream"];
        el.srcObject = event.streams[0];
    }

    private handleSignalingData(payload: any) {
        if (payload.type !== undefined) {
            if (payload.type === "offer") {
                this.pearConnection.setRemoteDescription(new RTCSessionDescription(payload));
                this.sendAnswer();
            } else if (payload.type === "answer") {
                this.pearConnection.setRemoteDescription(new RTCSessionDescription(payload));
            } else if (payload.type === "candidate") {
                this.pearConnection.addIceCandidate(new RTCIceCandidate(payload.candidate));
            }
        }
    }

    private emit(payload: any) {
        this.$socket.client.emit("data", payload);
    }
}
</script>
