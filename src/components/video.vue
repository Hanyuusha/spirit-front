<template>
    <div class="video">
        <v-slider
            v-if="!isSelf"
            hint="Громкость"
            max="1"
            min="0"
            step="0.01"
            value="1"
            @change="onVolumeChanged"
        ></v-slider>
        <video
            v-if="isSelf"
            ref="stream"
            muted
            autoplay
            width="400px"
            height="400px"
            poster="../assets/no_signal.gif"
        ></video>
        <video
            v-else
            ref="stream"
            muted
            controls
            autoplay
            width="400px"
            height="400px"
            poster="../assets/no_signal.gif"
        ></video>
        <p>{{ user.userName }}</p>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class RoomVideo extends Vue {
    @Prop() user: any;
    @Prop() isSelf: boolean;
    private video: any;

    private onVolumeChanged(volume: number) {
        this.video.volume = volume;
    }

    private mounted() {
        this.video = this.$refs.stream;
        if (this.isSelf) {
            this.video.srcObject = this.user.events[0];
        } else {
            this.video.srcObject = this.user.events[0].streams[0];
            setTimeout(() => {
                this.video.muted = false;
            }, 5000);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
