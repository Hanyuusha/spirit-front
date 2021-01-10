import { RoomUser } from "../store/state";

class RTCPeer {
    readonly localStream: MediaStream;
    readonly callback: any;
    private pearConnection: RTCPeerConnection;
    private TURN_SERVER_URL = process.env.VUE_APP_TURN_SERVER_URL;
    private TURN_SERVER_USERNAME = process.env.VUE_APP_TURN_SERVER_USERNAME;
    private TURN_SERVER_CREDENTIAL = process.env.VUE_APP_TURN_SERVER_CREDENTIAL;
    // WebRTC config: you don't have to change this for the example to work
    // If you are testing on localhost, you can just use PC_CONFIG = {}
    private PC_CONFIG = {
        iceServers: [
            {
                urls: `turn:${this.TURN_SERVER_URL}?transport=tcp`,
                username: this.TURN_SERVER_USERNAME,
                credential: this.TURN_SERVER_CREDENTIAL,
            },
            {
                urls: `turn:${this.TURN_SERVER_URL}?transport=udp`,
                username: this.TURN_SERVER_USERNAME,
                credential: this.TURN_SERVER_CREDENTIAL,
            },
        ],
    };

    constructor(localStream: MediaStream, callback: any) {
        this.localStream = localStream;
        this.callback = callback;
    }

    private async sendAnswer() {
        // eslint-disable-next-line no-console
        console.debug("Send answer");
        try {
            const answer = await this.pearConnection.createAnswer();
            await this.setAndSendLocalDescription(answer);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error("sendAnswer failed: ", error);
        }
    }

    private async setAndSendLocalDescription(sessionDescription: any) {
        try {
            await this.pearConnection.setLocalDescription(sessionDescription);
            this.callback(sessionDescription);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error("setAndSendLocalDescription failed: ", error);
        }
    }

    private onIceCandidate(event: RTCPeerConnectionIceEvent) {
        if (event.candidate) {
            // eslint-disable-next-line no-console
            console.debug("ICE candidate");
            this.callback({ type: "candidate", candidate: event.candidate });
        }
    }

    public createPeerConnection() {
        try {
            this.pearConnection = new RTCPeerConnection(this.PC_CONFIG);
            this.pearConnection.onicecandidate = (evt: any) => {
                this.onIceCandidate(evt);
            };
            this.localStream.getTracks().forEach((track) => this.pearConnection.addTrack(track, this.localStream));
            // eslint-disable-next-line no-console
            console.debug("PeerConnection created", this.pearConnection);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error("PeerConnection failed: ", error);
        }
    }

    public async sendOffer() {
        // eslint-disable-next-line no-console
        console.debug("Send offer");
        try {
            const offer = await this.pearConnection.createOffer();
            await this.setAndSendLocalDescription(offer);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error("sendOffer failed: ", error);
        }
    }

    public async handleSignalingData(payload: any) {
        const webrtc: any = payload["webrtc"];
        if (webrtc.type !== undefined) {
            if (webrtc.type === "offer") {
                try {
                    await this.pearConnection.setRemoteDescription(new RTCSessionDescription(webrtc));
                    await this.sendAnswer();
                    return this.createUser(payload);
                } catch (error) {
                    // eslint-disable-next-line no-console
                    console.error("setRemoteDescription with type 'offer' failed : ", error);
                }
            }
            if (webrtc.type === "answer") {
                try {
                    await this.pearConnection.setRemoteDescription(new RTCSessionDescription(webrtc));
                } catch (error) {
                    // eslint-disable-next-line no-console
                    console.error("setRemoteDescription with type 'answer' failed : ", error);
                }
            }
            if (webrtc.type === "candidate") {
                try {
                    await this.pearConnection.addIceCandidate(new RTCIceCandidate(webrtc.candidate));
                } catch (error) {
                    // eslint-disable-next-line no-console
                    console.error("addIceCandidate with type 'candidate' failed : ", error);
                }
            }
        }
    }
    public setOnAddStream(func: any) {
        this.pearConnection.ontrack = func;
    }

    private createUser(payload: any) {
        const cnameRgx = /a=ssrc:\d+\scname:\{([\w\d-]+)\}/gi;
        const sdp = payload["webrtc"]["sdp"].split("\r\n");
        sdp.find((line: string) => cnameRgx.test(line));
        const user: RoomUser = {
            peerId: payload["sid"],
            cname: RegExp.$1,
            userName: payload["user_name"],
        };
        return user;
    }
}

export default RTCPeer;
