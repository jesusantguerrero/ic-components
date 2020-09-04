<template>
  <div class="about">
    <chat></chat>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Chat from "@/components/chat/index.vue"; // @ is an alias to /src

export default defineComponent({
  name: "Abount",
  components: {
    Chat
  }
});
</script>