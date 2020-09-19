<template>
  <div class="mt-5 controls">
    <div class="month-name pl-8 font-bold capitalize">
      {{ getMonthName(selectedDay) }}
    </div>
    <div class="controls-container">
      <div class="w-full flex justify-start">
        <div class="day-controls" @click.prevent="prevWeek()">
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
        <div class="day-controls" @click.prevent="nextWeek()">
          <i class="fa fa-chevron-right"></i>
        </div>
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
  data() {
    return {
      selectedWeek: [],
      selectedDay: new Date(),
      today: new Date(),
      firstDayOfWeek: 0
    };
  },
  watch: {
    nextMode: {
      handler() {
        this.checkWeek();
      },
      immediate: true
    },
    selectedDay: {
      handler() {
        this.$emit("update:day", this.selectedDay);
      },
      immediate: true
    },
    selectedWeek: {
      handler() {
        this.$emit("update:week", this.selectedWeek);
      },
      immediate: true
    },
    day: {
      handler(newDate) {
        this.selectedDay = newDate || this.selectedDay;
      },
      immediate: true
    },
    week: {
      handler(newWeek) {
        this.selectedWeek = newWeek || this.selectedWeek;
      },
      immediate: true
    }
  },
  created() {
    this.checkWeek();
  },
  methods: {
    checkWeek() {
      this.selectedWeek = this.getWeek(new Date());
    },

    getWeek(date) {
      const weekMethod =
        this.nextMode != "week" ? this.getWeekDays : this.getCalendarWeek;
      return weekMethod(date);
    },

    getWeekDays(date) {
      const firstDate = new Date(date.setDate(date.getDate() - 4));
      const selectedWeek = [];
      for (let i = 0; i < 7; i++) {
        firstDate.setDate(firstDate.getDate() + 1);
        selectedWeek.push(new Date(firstDate));
      }
      return selectedWeek;
    },

    getCalendarWeek(date) {
      const firstDate = new Date(
        date.setDate(date.getDate() - date.getDay() + this.firstDayOfWeek)
      );
      const week = [new Date(firstDate)];
      while (
        firstDate.setDate(firstDate.getDate() + 1) &&
        firstDate.getDay() !== this.firstDayOfWeek
      ) {
        week.push(new Date(firstDate));
      }
      return week;
    },
    isSelectedDayInWeek() {
      if (this.nextMode != "week") {
        this.selectedDay = this.selectedWeek[3];
      } else {
        const isSelectedDayInWeek = this.selectedWeek
          .filter(date => this.getISODate(date))
          .includes(this.getISODate(this.selectedDay));
        if (!isSelectedDayInWeek) {
          this.selectedDay = this.selectedWeek[0];
        }
      }
    },
    gotoToday() {
      this.selectedDay = new Date();
      this.todayMode = !this.todayMode;
    },
    nextWeek() {
      let date = new Date(this.week[6].setDate(this.week[6].getDate() + 1));
      if (this.nextMode != "week") {
        date = new Date(
          this.selectedWeek[3].setDate(this.selectedWeek[3].getDate() + 1)
        );
      }
      this.selectedWeek = this.getWeek(date);
      this.isSelectedDayInWeek();
    },
    prevWeek() {
      let date = new Date(this.week[0].setDate(this.week[0].getDate() - 1));
      if (this.nextMode != "week") {
        date = new Date(
          this.selectedWeek[3].setDate(this.selectedWeek[3].getDate() - 1)
        );
      }
      this.selectedWeek = this.getWeek(date);
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
      return format(date, "iii", {
        locale: es
      });
    },
    getMonthName(date) {
      return format(date, "MMM, yyyy", {
        locale: es
      });
    },
    getDateLabel(date) {
      return format(date, "dd", {
        locale: es
      });
    }
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
