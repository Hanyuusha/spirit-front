<template>
    <div class="video">
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

    private mounted() {
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
