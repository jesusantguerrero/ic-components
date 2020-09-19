<template>
  <div class="about">
    <chat display="full"></chat>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Chat from "@/components/chat/index.vue"; // @ is an alias to /src

export default defineComponent({
  name: "Chat",
  components: {
    Chat
  }
});
</script>

<style lang="scss" scoped>
body {
  width: 100%;
}
</style>
