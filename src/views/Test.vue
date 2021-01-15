<template>
  <div class="mt-2 w-5/12 p-10 text-left">
    <label for="message" class="block font-bold text-left">
      Voice test
    </label>

    <textarea
      name="message"
      id="message"
      cols="30"
      rows="10"
      class="p-2 rounded-md bg-gray-100 border-2 border-gray-500 w-full"
      v-model="messageText"
      placeholder="Write a text"
    >
    </textarea>

    <div class="w-full">
      <select
        v-model="language"
        v-if="voices"
        class="w-full h-8 rounded-md  border-2 border-gray-500 bg-gray-100"
      >
        <option :value="voice" v-for="voice in voices" :key="voice.voiceURI">
          {{ voice.name }}
        </option>
      </select>
    </div>
    <button
      class="rounded-md bg-blue-400 text-white w-full h-10 mt-4 hover:bg-blue-600"
      @click="play()"
    >
      play
    </button>
  </div>
</template>

<script lang="typecript">
import { reactive, ref } from "vue";

export default {
  setup() {
    const voices = reactive(window.speechSynthesis.getVoices());
    const language = ref(voices[6]);
    const messageText = ref("Hola mundo");
    const isPlaying = ref(false);

    const play = () => {
      const msg = new SpeechSynthesisUtterance();
      msg.voice = language.value;
      msg.voiceURI = "native";
      msg.text = messageText.value;
      msg.lang = "es-DO";
      msg.onstart = () => {
        isPlaying.value = true;
      }

      msg.onend = () => {
        isPlaying.value = false;
      };

      speechSynthesis.speak(msg);
    };

    return {
      play,
      voices,
      language,
      messageText,
      isPlaying
    };
  }
};
</script>

<style></style>
