<template>
  <header class="bg-blue-500 grid grid-cols-8 text-white">
    <div class="col-start-1 col-end-8 flex">
      <div
        v-if="showBackButton"
        class="back-button py-5 px-5 hover:bg-blue-700 flex items-center justify-center cursor-pointer w-6"
        @click.prevent="$emit('back')"
      >
        <i :class="leftIcon"></i>
      </div>

      <div class="py-5 px-5 text-left">
        <h4 class="text-2xl">
          {{ title }}
        </h4>
        <p>{{ description }}</p>
      </div>
    </div>

    <div
      v-if="showSettings"
      class="back-button py-5 px-5 hover:bg-blue-700 flex items-center justify-center cursor-pointer"
      @click="$emit('settings')"
    >
      <i :class="rightIcon"></i>
    </div>
  </header>
</template>

<script>
export default {
  props: {
    showBackButton: {
      type: Boolean
    },
    leftIcon: {
      type: String,
      default: "fa fa-chevron-left"
    },
    rightIcon: {
      type: String,
      default: "fa fa-cogs"
    },
    showSettings: {
      type: Boolean
    },
    description: {
      type: String
    },
    title: {
      type: String
    }
  }
};
</script>

<style></style>
