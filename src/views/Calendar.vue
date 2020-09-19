<template>
  <div class="home">
    <router-link :to="{ name: 'Schedule' }"> Schedule </router-link>
    <board msg="Welcome to Your Vue.js + TypeScript App" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Board from "@/components/board/index.vue"; // @ is an alias to /src

export default defineComponent({
  name: "Home",
  components: {
    Board
  }
});
</script>
