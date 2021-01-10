<template>
    <div class="video">
        <video ref="stream" autoplay playsinline width="200px" height="200px"></video>
        <div>{{ user.userName }}</div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { RoomUser } from "@/store/state";

@Component
export default class RoomVideo extends Vue {
    @Prop() user: RoomUser;

    private mounted() {
        // @ts-ignore
        this.$refs.stream.srcObject = this.user.events[0].streams[0];
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
