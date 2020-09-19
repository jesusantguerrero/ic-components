<template>
  <div
    class="day-slot"
    :class="{
      'on-air-program': isOnAir,
      'past-hour': hasPassed
    }"
  >
    <div class="content-body flex py-2">
      <div class="image_cover">
        <img :src="daySlot.url_imagen" alt="" />
      </div>
      <div class="program-name ml-6">
        <div class="badge-on-air flex items-center mb-1 w-20" v-if="isOnAir">
          Al aire
          <span class="rounded-full block bg-red-500 h-2 w-2 ml-2"></span>
        </div>
        <div class="pl-1 mb-1">
          <h4 class="font-bold text-xl">
            {{ daySlot.nombre }}
          </h4>
        </div>
        <div class="pl-1">
          {{ daySlot.descripcion.slice(0, 200) }}
          {{ daySlot.descripcion.length > 200 ? "..." : "" }}
        </div>
      </div>
    </div>

    <div class="flex justify-end items-center">
      <span
        class="mx-2 p-2 cursor-pointer hover:text-blue-500"
        v-if="daySlot.id && allowUpdate"
        @click="$emit('update-called', daySlot)"
      >
        <i class="fa fa-edit"></i>
      </span>

      <span
        class="mx-2 p-2 cursor-pointer rounded transition-all hover:text-red-700"
        v-if="daySlot.id && allowDelete"
        @click="$emit('delete-called', daySlot)"
      >
        <i class="fa fa-trash"></i>
      </span>
    </div>

    <div
      class="flex items-center justify-end border-l-2 border-gray-400 px-5"
      :class="{
        'flex-col items-baseline justify-center text-left my-6': isOnAir
      }"
    >
      <span class="block" v-if="isOnAir"> De</span>
      <span class="block"> {{ formatHour(daySlot.horaExacta) }}</span>
      <span class="block" v-if="isOnAir"> A </span>
      <span class="block mx-2" v-else> - </span>
      <span class="block"> {{ formatHour(daySlot.horaFinal) }} </span>
      <span class="ml-3" v-if="!isOnAir">
        <i class="fas fa-chevron-down"></i>
      </span>
    </div>
  </div>
</template>

<script>
import { format } from "date-fns";

export default {
  props: {
    daySlot: {
      type: Object,
      required: true
    },
    hasPassed: {
      type: Boolean,
      default: false
    },
    isOnAir: {
      type: Boolean,
      default: false
    },
    allowUpdate: {
      type: Boolean,
      default: false
    },
    allowDelete: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    formatHour(hour) {
      const date = new Date();
      const time = hour.split(":");
      date.setHours(time[0]);
      date.setMinutes(time[1]);
      return format(date, "hh:mm a");
    }
  }
};
</script>

<style lang="scss">
.badge-on-air {
  box-shadow: 4px 4px 4px rgba(255, 255, 255, 0.5);
}

.on-air-program {
  .content-body {
    color: white;
  }
}
.content-body {
  color: var(--primary-color);
}
</style>
