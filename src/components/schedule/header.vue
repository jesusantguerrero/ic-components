<template>
  <div class="w-full">
    <article class="header header-current mt-2 shadow-lg p-5 ">
      <div class="badge-on-air flex items-center mb-1 w-20 blue">
        Al aire
        <span class="rounded-full block bg-red-500 h-2 w-2 ml-2"></span>
      </div>

      <h3 class="text-xl font-bold mb-1">
        <span class="title">{{ currentProgram.nombre }}</span>
      </h3>

      <p class="capitalize">{{ formattedDate(currentProgram.fecha) }}</p>
      <p>
        {{ currentProgram.descripcion }}
      </p>
    </article>

    <article class="header header-next mt-2 shadow-lg p-5 text-white">
      <div
        class="badge-on-air flex items-center mb-1 w-32 bg-white text-blue-700"
      >
        A continuacion
      </div>

      <h3 class="text-xl font-bold">
        <span class="">{{ nextProgram.nombre }}</span>
      </h3>

      <p>
        {{ nextProgram.descripcion }}
      </p>
    </article>
  </div>
</template>

<script>
import { format } from "date-fns";
import { es } from "date-fns/locale";
import axios from "axios";

export default {
  props: {
    endpoint: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      msg: "Horario Mahanahim",
      isFormOpen: false,
      currentTime: new Date(),
      diaActivo: new Date(),
      horaActiva: 0,
      modoManual: false,
      mostrarTodos: false,
      schedule: []
    };
  },
  created() {
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
    this.getSchedules();
  },
  computed: {
    scheduleURL() {
      return `${this.endpoint}?fecha=${format(this.diaActivo, "yyyy-MM-dd")}`;
    },
    horaActual() {
      return new Date().getHours();
    },
    currentProgram() {
      return (
        this.schedule.find(program => {
          return this.isHourBetween(
            program.hora,
            program.hora_final,
            this.currentTime
          );
        }) || {}
      );
    },
    nextProgram() {
      return (
        this.schedule.find(program => {
          const date = new Date();
          if (this.currentProgram.hora_final) {
            const current = this.currentProgram.hora_final.split(":");
            date.setHours(current[0]);
            date.setMinutes(current[1]);

            return this.isHourBetween(
              program.hora,
              program.hora_final,
              date,
              true
            );
          }
        }) || {}
      );
    }
  },
  watch: {
    scheduleURL: {
      handler() {
        this.getSchedules();
      },
      immediate: true
    }
  },
  methods: {
    formattedDate(date) {
      if (date) {
        date = date.split("-");
        const localDate = new Date(date[0], date[1] - 1, date[2]);
        return date ? format(localDate, "EEEE, MMMM dd", { locale: es }) : "";
      }
      return "";
    },
    isHourBetween(horaInicial = "", horaFinal = "", fechaActual, bigger) {
      if (horaInicial && horaFinal && fechaActual) {
        const primerahoraString = horaInicial.replace(":", "");
        const segundahoraString = horaFinal.replace(":", "");
        const horaActualString = format(fechaActual, "HHmm");
        return (
          (!bigger
            ? horaActualString >= primerahoraString
            : primerahoraString > horaActualString) &&
          horaActualString <= segundahoraString
        );
      }
      return false;
    },
    async getSchedules() {
      this.schedule = await axios(this.scheduleURL).then(({ data }) => {
        return data;
      });
    },

    formatHour(hour) {
      if (hour) {
        const date = new Date();
        const time = hour.split(":");
        date.setHours(time[0]);
        date.setMinutes(time[1]);
        return format(date, "hh:mm a");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  border-radius: var(--primary-radius);
  &-current {
    min-height: 230px;
    .title {
      color: var(--primary-color);
    }
  }

  .badge-on-air {
    @apply px-2;
    border-radius: 2rem;

    &.blue {
      @apply px-2;
      color: white;
      background: var(--primary-color);
    }
  }

  &-next {
    background: var(--primary-color);
  }
}
</style>
