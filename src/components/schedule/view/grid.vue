<template>
  <div>
    <div
      class="flex justify-between bg-black text-white border-gray-500 border-b-2 py-2 px-12"
    >
      <div class="flex items-center">Hora</div>
      <div>
        <button
          class="bg-green-600 text-white p-3"
          v-if="isToday"
          @click="toggleViewAll"
        >
          {{ textToggleMostrar }}
        </button>
      </div>
    </div>
    <div
      v-for="daySlot in agenda"
      :key="daySlot.horaExacta"
      class="day-slot"
      :class="{
        'on-air-program': daySlot.hora == horaActual && isToday,
        'past-hour': hourHasPassed(daySlot)
      }"
    >
      <div class="flex items-center">
        {{ formatHour(daySlot.horaExacta) }}
      </div>
      <div>
        <div>
          <h2 class="font-bold">
            {{ daySlot.nombre }}
          </h2>
        </div>
        <div>
          {{ daySlot.descripcion }}
        </div>
      </div>

      <div>
        <div
          v-if="daySlot.hora == horaActual && isToday"
          class="flex items-center justify-end"
        >
          <span class="rounded p-2 badge-on-air">Al Aire</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { isToday, format } from "date-fns";

export default {
  props: {
    selectedDate: {
      type: Date,
      required: true
    },
    schedule: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      agenda: [],
      modoManual: false,
      mostrarTodos: false
    };
  },
  watch: {
    schedule: {
      handler() {
        console.log(this.schedule);
        this.agenda = this.getAgenda();
      },
      immediate: true
    }
  },
  computed: {
    horaActual() {
      if (this.modoManual) {
        return this.horaActiva;
      } else {
        return new Date().getHours();
      }
    },

    isToday() {
      return isToday(this.selectedDate);
    },
    textToggleMostrar() {
      return this.mostrarTodos ? "Al aire" : "Programas Anteriores";
    },

    iconToggleMostrar() {
      return this.mostrarTodos ? "Al aire" : "Programas Anteriores";
    }
  },
  methods: {
    getAgenda() {
      const agenda = [];
      for (let hora = 0; hora < 24; hora++) {
        let horaString = hora;
        let horaProxima = hora + 1;

        if (hora < 10) {
          horaString = "0" + horaString;
        }

        if (horaProxima < 10) {
          horaProxima = "0" + horaProxima;
        }

        if (horaProxima == 24) {
          horaProxima = "00";
        }

        const programas = this.schedule.filter(
          programa => programa.hora.slice(0, 2) == horaString
        );
        const proximoPrograma = null;
        const horaExacta = `${hora}:00`;

        if (!programas.length) {
          const programa = {
            hora,
            horaExacta,
            descripcion: "Sin descripcion",
            horaFinal: proximoPrograma
              ? proximoPrograma.slice(0, 5)
              : horaProxima + ":00",
            nombre: `N / A`
          };
          agenda.push(programa);
        } else {
          programas.forEach(programa => {
            programa.horaExacta = programa.hora.slice(0, 5);
            programa.horaFinal = programa.hora_final.slice(0, 5);
            agenda.push(programa);
          });
        }
      }

      return agenda;
    },

    hourHasPassed(programa) {
      const hours =
        typeof programa.hora == "string"
          ? programa.hora.split(":")[0]
          : programa.hora;
      return (
        Number(hours) < this.horaActual && this.isToday && !this.mostrarTodos
      );
    },

    formatHour(hour) {
      const date = new Date();
      const time = hour.split(":");
      date.setHours(time[0]);
      date.setMinutes(time[1]);
      return format(date, "hh:mm a");
    },

    toggleViewAll() {
      this.mostrarTodos = !this.mostrarTodos;
    }
  }
};
</script>

<style lang="scss">
.day-slot {
  @apply grid grid-cols-4 bg-gray-100 border-gray-500 border-b-2 py-2 px-12;
}

.on-air-program {
  background: #338de3;
  color: white;
}

.badge-on-air {
  color: #338de3;
  background: white;
}

.past-hour {
  display: none;
}
</style>
