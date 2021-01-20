<template>
    <v-form>
        <v-container>
            <v-row>
                <v-col cols="12" md="4" align-self="center">
                    <v-text-field v-model="roomName" label="Создать или войти в конфу" required></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="4" align-self="center">
                    <v-btn elevation="6" @click="enterRoom">Войти</v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-form>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class Home extends Vue {
    private roomName: string = "";

    private enterRoom() {
        this.$router.push({ name: "room", params: { roomId: this.roomName } });
    }
}
</script>

<style scoped></style>
