import { client } from ".."

export default {
    name: 'raw',
    once: false,
    async run(d) {
        return client.MusicManager.updateVoiceState(d);
    }
}