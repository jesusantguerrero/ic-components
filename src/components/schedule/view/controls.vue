<template>
  <div class="mt-5">
    <div class="controls-container">
      <div class="day-controls" @click.prevent="prevWeek()">
        <i class="fa fa-chevron-left"></i>
      </div>
      <div
        class="day-item"
        :class="{ 'selected-day': isSelectedDate(day) }"
        v-for="day in week"
        :key="`item-${day}`"
        @click="selectedDay = day"
      >
        <span>{{ getDayName(day) }}</span> <br />
        <span>{{ getDateLabel(day) }}</span>
      </div>
      <div class="day-controls" @click.prevent="nextWeek()">
        <i class="fa fa-chevron-right"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default {
  name: "Controls",
  props: {
    value: {
      type: Date
    }
  },
  data() {
    return {
      week: [],
      today: new Date(),
      selectedDay: new Date(),
      firstDayOfWeek: 0
    };
  },
  watch: {
    selectedDay: {
      handler() {
        this.$emit("input", this.selectedDay);
      },
      immediate: true
    },
    value: {
      handler(newDate) {
        this.selectedDay = newDate || this.selectedDay;
      },
      immediate: true
    }
  },
  created() {
    this.week = this.getWeek(new Date());
  },
  methods: {
    getWeek(date) {
      const firstDate = new Date(date.setDate(date.getDate() - 4));
      const week = [];
      for (let i = 0; i < 7; i++) {
        firstDate.setDate(firstDate.getDate() + 1);
        week.push(new Date(firstDate));
      }
      return week;
    },
    isSelectedDayInWeek() {
      this.selectedDay = this.week[3];
    },
    gotoToday() {
      this.selectedDay = new Date();
      this.todayMode = !this.todayMode;
    },
    nextWeek() {
      this.week = this.getWeek(
        new Date(this.week[3].setDate(this.week[3].getDate() + 1))
      );
      this.isSelectedDayInWeek();
    },
    prevWeek() {
      this.week = this.getWeek(
        new Date(this.week[3].setDate(this.week[3].getDate() - 1))
      );
      this.isSelectedDayInWeek();
    },
    getISODate(date) {
      return date.toISOString().slice(0, 10);
    },
    isToday(date) {
      return this.getISODate(new Date()) == this.getISODate(date);
    },
    isSelectedDate(date) {
      return this.getISODate(this.selectedDay) == this.getISODate(date);
    },
    getDayName(date) {
      return format(date, "iiii", {
        locale: es
      });
    },
    getDateLabel(date) {
      return format(date, "dd MMMM", {
        locale: es
      });
    }
  }
};
</script>

<style lang="scss">
.controls-container {
  @apply grid grid-cols-3 text-left;
  user-select: none;
}

.day-item,
.day-controls {
  @apply text-center capitalize bg-blue-500 text-white py-2 border-blue-500 border-2 cursor-pointer;
  transition: all ease 0.3s;
  display: none;

  &:hover {
    @apply bg-blue-700;
  }
}

.day-controls {
  @apply flex justify-center items-center bg-blue-700 text-white;
}

.selected-day {
  @apply border-green-200 bg-blue-700 visible;
  display: block;
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
