<template>
    <div class="video">
        <v-slider
            v-if="!isSelf"
            hint="Громкость"
            max="1"
            min="0"
            step="0.01"
            value="0.5"
            @change="onVolumeChanged"
        ></v-slider>
        <video v-if="isSelf" ref="stream" muted autoplay playsinline width="400px" height="400px"></video>
        <video v-else ref="stream" autoplay playsinline width="400px" height="400px"></video>
        <p>{{ user.userName }}</p>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class RoomVideo extends Vue {
    @Prop() user: any;
    @Prop() isSelf: boolean;

    private onVolumeChanged(volume: number) {
        // @ts-ignore
        this.$refs.stream.volume = volume;
    }

    private mounted() {
        // @ts-ignore
        this.$refs.stream.volume = 0.5;
        if (this.isSelf) {
            // @ts-ignore
            this.$refs.stream.srcObject = this.user.events[0];
        } else {
            // @ts-ignore
            this.$refs.stream.srcObject = this.user.events[0].streams[0];
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
