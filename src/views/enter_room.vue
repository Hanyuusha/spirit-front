<template>
    <div id="enter-room">
        <v-form v-if="!showRoom">
            <v-container>
                <v-row>
                    <v-col cols="12" md="4">
                        <v-checkbox id="showVideo" v-model="showVideo" label="Включить видео" />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="4">
                        <v-checkbox id="showAudio" v-model="showAudio" label="Включить звук" />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="4" align-self="center">
                        <v-text-field v-model="userName" label="Желаемое имя" required></v-text-field>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="12" md="4" align-self="center">
                        <v-btn elevation="6" @click="enterRoom">Войти</v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-form>
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
