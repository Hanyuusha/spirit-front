<template>
    <div class="video">
        <video ref="stream" autoplay playsinline width="200px" height="200px"></video>
        <p>{{ user.userName }}</p>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component
export default class RoomVideo extends Vue {
    @Prop() user: any;

    @Watch("user", { immediate: true, deep: true })
    private onUserChanged() {
        // eslint-disable-next-line no-console
        console.log("User", this.user);
        if (this.user.events[0] !== undefined) {
            // @ts-ignore
            this.$refs.stream.srcObject = this.user.events[0].streams[0];
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
