import { getMonth, isLastDayOfMonth } from "date-fns";
import { watch, ref } from "vue";

export const useWeekPager = props => {
  const nextMode = ref(props.nextMode);

  // Utils
  const getISODate = date => {
    return date.toISOString().slice(0, 10);
  };

  const setSelectedDayInWeek = (selectedDay, selectedWeek, nextMode) => {
    let day;
    if (nextMode != "week") {
      day = selectedWeek[3];
    } else {
      const isSelectedDayInWeek = selectedWeek
        .filter(date => getISODate(date))
        .includes(getISODate(selectedDay));
      if (!isSelectedDayInWeek) {
        day = selectedWeek[0];
      }
    }

    return day;
  };

  // state
  const firstDayOfWeek = ref(0);

  // Week
  const selectedWeek = ref([]);

  const setWeek = value => {
    selectedWeek.value = value || selectedWeek.value;
  };

  const getWeekDays = date => {
    const firstDate = new Date(date.setDate(date.getDate() - 4));
    const selectedWeek = [];
    for (let i = 0; i < 7; i++) {
      firstDate.setDate(firstDate.getDate() + 1);
      selectedWeek.push(new Date(firstDate));
    }
    return selectedWeek;
  };

  const getCalendarWeek = date => {
    const firstDate = new Date(
      date.setDate(date.getDate() - date.getDay() + firstDayOfWeek.value)
    );
    const week = [new Date(firstDate)];
    while (
      firstDate.setDate(firstDate.getDate() + 1) &&
      firstDate.getDay() !== firstDayOfWeek.value
    ) {
      week.push(new Date(firstDate));
    }
    return week;
  };

  const getCalendarMonth = date => {
    const firstDate = new Date(
      date.setDate(date.getDate() - (date.getDate() - 1))
    );
    const month = [new Date(firstDate)];
    while (!isLastDayOfMonth(firstDate)) {
      firstDate.setDate(firstDate.getDate() + 1);
      month.push(new Date(firstDate));
    }
    return month;
  };

  const getWeek = date => {
    const controls = {
      day: getWeekDays,
      week: getCalendarWeek,
      month: getCalendarMonth
    };
    const mode = nextMode.value || "week";
    return controls[mode](date);
  };

  const checkWeek = () => {
    selectedWeek.value = getWeek(new Date());
  };

  watch(nextMode, checkWeek, { immediate: true });

  // Day
  const selectedDay = ref(new Date());
  const setDay = value => {
    selectedDay.value = value || selectedDay.value;
  };

  // controls
  const next = () => {
    const dayIndex =
      nextMode.value == "day" ? 3 : selectedWeek.value.length - 1;
    const date = new Date(
      selectedWeek.value[dayIndex].setDate(
        selectedWeek.value[dayIndex].getDate() + 1
      )
    );

    selectedWeek.value = getWeek(date);
    selectedDay.value = setSelectedDayInWeek(
      selectedDay.value,
      selectedWeek.value,
      nextMode.value
    );
  };

  const previous = () => {
    const dayIndex = nextMode.value == "day" ? 3 : 0;
    const date = new Date(
      selectedWeek.value[dayIndex].setDate(
        selectedWeek.value[dayIndex].getDate() - 1
      )
    );
    selectedWeek.value = getWeek(date);
    selectedDay.value = setSelectedDayInWeek(
      selectedDay.value,
      selectedWeek.value,
      nextMode.value
    );
  };

  checkWeek();

  return {
    // state
    selectedDay,
    selectedWeek,

    // methods
    controls: {
      setWeek,
      setDay,
      previous,
      next
    }
  };
};
