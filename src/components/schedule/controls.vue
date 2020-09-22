<template>
  <div class="mt-5 controls">
    <div class="month-name pl-8 font-bold capitalize">
      {{ getMonthName(selectedDay) }}
    </div>
    <div class="controls-container">
      <div class="w-full flex justify-start">
        <div class="day-controls" @click.prevent="controls.previous()">
          <i class="fa fa-chevron-left"></i>
        </div>
      </div>

      <div
        v-for="day in selectedWeek"
        :key="`item-${day}`"
        class="w-full flex justify-center"
      >
        <div
          class="day-item"
          :class="{ 'selected-day': isSelectedDate(day) }"
          @click="selectedDay = day"
        >
          <span class="text-xl font-bold block">{{ getDateLabel(day) }}</span>
          <span class="capitalize">{{ getDayName(day) }}</span> <br />
        </div>
      </div>

      <div class="w-full flex justify-end">
        <div class="day-controls" @click.prevent="controls.next()">
          <i class="fa fa-chevron-right"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useWeekPager } from "@/utils/useWeekPager.js";
import { watch, toRefs } from "vue";

export default {
  name: "Controls",
  props: {
    day: {
      type: Date
    },
    week: {
      type: Array
    },
    nextMode: {
      type: String,
      default: "day"
    }
  },
  setup(props, { emit }) {
    const { day, week, nextMode } = toRefs(props);
    const { controls, selectedWeek, selectedDay } = useWeekPager({
      nextMode: nextMode.value
    });

    const emitWeek = value => {
      emit("update:week", value);
    };
    watch(week, controls.setWeek, { immediate: true });
    watch(selectedWeek, emitWeek, { immediate: true });

    const emitDay = value => {
      emit("update:day", value);
    };
    watch(day, controls.setDay, { immediate: true });
    watch(selectedDay, emitDay, { immediate: true });

    // viewHelpers
    const getISODate = date => {
      return date.toISOString ? date.toISOString().slice(0, 10) : "";
    };

    const isToday = date => {
      return getISODate(new Date()) == getISODate(date);
    };

    const isSelectedDate = date => {
      return getISODate(selectedDay.value) == getISODate(date);
    };

    const getDayName = date => {
      return format(date, "iii", {
        locale: es
      });
    };

    const getMonthName = date => {
      return format(date, "MMM, yyyy", {
        locale: es
      });
    };

    const getDateLabel = date => {
      return format(date, "dd", {
        locale: es
      });
    };

    return {
      selectedWeek,
      selectedDay,

      // methods
      controls,
      // ui helpers
      getISODate,
      isToday,
      isSelectedDate,
      getDayName,
      getMonthName,
      getDateLabel
    };
  }
};
</script>

<style lang="scss">
$primary-color: var(--primary-color);

.controls {
  @apply text-left bg-white shadow-lg mb-1 p-2 border-gray-100 border-2;
  border-radius: 12px;
}

.controls-container {
  @apply grid grid-cols-3 pb-3;
  user-select: none;
}

.day-item,
.day-controls {
  @apply text-center capitalize text-gray-600 py-2  cursor-pointer w-20;
  transition: all ease 0.3s;
  border-radius: 0.8rem;
  display: none;

  &:hover {
    @apply text-white;
    background: var(--primary-color);
  }
}

.day-controls {
  @apply flex justify-center items-center text-gray-700;
  &:hover {
    @apply bg-gray-400 text-gray-700;
  }
}

.selected-day {
  @apply visible text-white shadow-lg;
  display: block;
  background: var(--primary-color);
  box-shadow: 4px 4px 6px var(--primary-color-5);
}

@media (min-width: 768px) {
  .controls-container {
    @apply grid-cols-9;
    user-select: none;
  }

  .day-item {
    display: block;
  }
}
</style>
