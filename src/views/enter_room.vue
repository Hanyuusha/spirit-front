<template>
    <div id="enter-room">
        <div v-if="!showRoom">
            <div>
                <label for="showVideo">Включить Видео</label>
                <input id="showVideo" v-model="showVideo" type="checkbox" />
            </div>
            <div>
                <label for="showAudio">Включить Звук</label>
                <input id="showAudio" v-model="showAudio" type="checkbox" />
            </div>
            <div>
                <label for="userName">Желаемое имя</label>
                <input id="userName" v-model="userName" type="text" />
            </div>
            <input type="button" value="Войти" @click="enterRoom" />
        </div>
        <room
            :show-room="showRoom"
            :show-audio="showAudio"
            :show-video="showVideo"
            :user-name="userName"
            :room-id="roomId"
        />
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Room from "@/components/room.vue";

@Component({
    components: {
        Room,
    },
})
export default class EnterRoom extends Vue {
    private showRoom: boolean = false;
    private showVideo: boolean = true;
    private showAudio: boolean = true;
    private userName: string = "Guest (you)";
    @Prop() roomId: string;

    private enterRoom() {
        this.showRoom = true;
    }
}
</script>

<style scoped></style>
