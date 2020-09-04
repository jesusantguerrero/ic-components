<template>
  <div class="login h-screen">
    <header class="bg-blue-500 grid grid-cols-8 text-white">
      <div
        class="back-button py-5 px-5 hover:bg-blue-700 flex items-center justify-center"
        @click.prevent="leaveChannel"
      >
        <i class="fa fa-chevron-left"></i>
      </div>

      <div class="py-5 px-5 col-start-2 col-end-8 text-left">
        <h4 class="text-2xl">
          {{ channel.friendlyName }}
        </h4>
        <p>{{ description }}</p>
      </div>

      <div
        class="back-button py-5 px-5 hover:bg-blue-700 flex items-center justify-center"
      >
        <i class="fa fa-cogs"></i>
      </div>
    </header>
  </div>
</template>

<script>
export default {
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      description: ""
    };
  },
  created() {
    this.getDescription();
  },
  methods: {
    async getDescription() {
      return await this.channel.getAttributes().then(attributes => {
        this.description = attributes.description;
      });
    },
    leaveChannel() {
      this.$emit("left", this.channel);
    }
    // todo Update members or show members
  }
};
</script>

<style></style>
