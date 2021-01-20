export const TURN_SERVER_URL = process.env.VUE_APP_TURN_SERVER_URL;
export const TURN_SERVER_USERNAME = process.env.VUE_APP_TURN_SERVER_USERNAME;
export const TURN_SERVER_CREDENTIAL = process.env.VUE_APP_TURN_SERVER_CREDENTIAL;
// WebRTC config: you don't have to change this for the example to work
// If you are testing on localhost, you can just use PC_CONFIG = {}
const PC_CONFIG = {
    iceServers: [
        {
            urls: `turn:${TURN_SERVER_URL}?transport=tcp`,
            username: TURN_SERVER_USERNAME,
            credential: TURN_SERVER_CREDENTIAL,
        },
        {
            urls: `turn:${TURN_SERVER_URL}?transport=udp`,
            username: TURN_SERVER_USERNAME,
            credential: TURN_SERVER_CREDENTIAL,
        },
    ],
};

export default PC_CONFIG;
