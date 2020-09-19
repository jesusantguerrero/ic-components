<template>
  <div>
    <div class="flex justify-end py-2">
      <div>
        <button
          class="text-blue-600 rounded-lg w-56 p-3 border-2 border-gray-400"
          v-if="isToday"
          @click="toggleViewAll"
        >
          {{ textToggleMostrar }}
        </button>
      </div>
    </div>

    <grid-item
      v-for="daySlot in agenda"
      :key="daySlot.horaExacta"
      :day-slot="daySlot"
      :is-on-air="
        isHourBetween(daySlot.hora, daySlot.hora_final, currentTime) && isToday
      "
      :has-passed="hourHasPassed(daySlot)"
      :allow-delete="allowDelete"
      :allow-update="allowUpdate"
      @update-called="$emit('update-called', $event)"
      @delete-called="$emit('delete-called', $event)"
    />
  </div>
</template>

<script>
import { isToday, format } from "date-fns";
import { uniqBy } from "lodash-es";
import GridItem from "./grid-item";

export default {
  components: {
    GridItem
  },
  props: {
    selectedDate: {
      type: Date,
      required: true
    },
    allowUpdate: {
      type: Boolean,
      default: false
    },
    allowDelete: {
      type: Boolean,
      default: false
    },
    schedule: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      currentTime: new Date(),
      agenda: [],
      modoManual: false,
      mostrarTodos: false
    };
  },
  created() {
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  },
  watch: {
    schedule: {
      handler() {
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
      let programaAnterior = {};
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

        const date = new Date();
        const lastIndex = programas.length - 1;
        const lastHour =
          lastIndex >= 0
            ? programas[lastIndex].hora
            : programaAnterior.horaFinal || horaProxima + ":00";
        const current = lastHour.split(":");

        const proximoPrograma = this.schedule.find(program => {
          date.setHours(current[0]);
          date.setMinutes(current[1]);
          date.setSeconds(0);

          return this.isHourBetween(
            program.hora,
            program.hora_final,
            date,
            true,
            "aqui"
          );
        });

        const horaExacta = `${hora}:00`;

        if (!programas.length) {
          const programa = {
            hora: programaAnterior.hora_final
              ? programaAnterior.hora_final
              : hora,
            horaExacta: programaAnterior.hora_final
              ? programaAnterior.hora_final
              : horaExacta,
            descripcion: "Sin descripcion ",
            horaFinal: proximoPrograma
              ? proximoPrograma.hora
              : horaProxima + ":00",
            nombre: `N / A`
          };

          programaAnterior = programa;

          agenda.push(programa);
        } else {
          programas.forEach(programa => {
            programa.horaExacta = programa.hora.slice(0, 5);
            programa.horaFinal = programa.hora_final.slice(0, 5);
            agenda.push(programa);
            programaAnterior = programa;
          });
        }
      }

      return uniqBy(agenda, "hora");
    },

    hourHasPassed(programa) {
      if (typeof programa.hora == "string" && programa.horaFinal) {
        const segundahoraString = programa.horaFinal
          .replaceAll(":", "")
          .slice(0, 4);
        const horaActualString = format(this.currentTime, "HHmm");
        return (
          segundahoraString < horaActualString &&
          this.isToday &&
          !this.mostrarTodos
        );
      } else {
        const hours = programa.hora;
        return (
          Number(hours) < this.horaActual && this.isToday && !this.mostrarTodos
        );
      }
    },
    toggleViewAll() {
      this.mostrarTodos = !this.mostrarTodos;
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
    }
  }
};
</script>

<style lang="scss">
.day-slot {
  @apply grid grid-cols-3 border-gray-200 border-2 py-2 px-12 my-2 shadow-sm;
  position: relative;
  border-radius: var(--primary-radius);

  &::before {
    @apply w-1 h-4 bg-blue-400 rounded-lg;
    content: "";
    left: -3px;
    position: absolute;
    top: 15px;
  }
}

.on-air-program {
  min-height: 180px;
  color: white;
  background: var(--primary-color);
  border-color: var(--primary-color);
  box-shadow: 4px 4px 6px var(--primary-color-5);
}

.badge-on-air {
  @apply px-2;
  border-radius: 2rem;
  color: #338de3;
  background: white;
}

.past-hour {
  display: none;
}

.image_cover {
  @apply bg-gray-400 rounded-full;
  width: 50px;
  min-height: 50px;
  overflow: hidden;
}

.on-air-program {
  .image_cover {
    @apply bg-gray-400 rounded-lg;
    width: 200px;
  }
}
</style>
