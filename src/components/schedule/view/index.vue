<template>
  <div class="mb-12">
    <controls v-model="diaActivo" @input="diaActivo = $event"></controls>
    <grid :selected-date="diaActivo" :schedule="schedule"> </grid>
  </div>
</template>

<script>
import { format } from "date-fns";
import Controls from "./controls";
import Grid from "./grid";
import axios from "axios";

export default {
  props: {
    endpoint: {
      type: String,
      required: true
    }
  },
  components: {
    Controls,
    Grid
  },
  data() {
    return {
      msg: "Horario Mahanahim",
      diaActivo: new Date(),
      horaActiva: 0,
      modoManual: false,
      mostrarTodos: false,
      schedule: []
    };
  },
  computed: {
    scheduleURL() {
      return `${this.endpoint}?fecha=${format(this.diaActivo, "yyyy-MM-dd")}`;
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
    async getSchedules() {
      this.schedule = await axios(this.scheduleURL)
        .then(({ data }) => {
          return data;
        })
        .catch(() => {
          return this.getBackupData();
        });
    },

    getBackupData() {
      return [
        {
          program_id: "1",
          nombre: "Desayunando",
          hora: "00:00:00",
          hora_final: "00:00:00",
          descripcion: "dasdasdas"
        },
        {
          program_id: "2",
          nombre: "El mismo golpe",
          hora: "18:00:00",
          hora_final: "00:00:00",
          descripcion: "Programa test"
        },
        {
          program_id: "3",
          nombre: "Then Again",
          hora: "20:00:00",
          hora_final: "21:30:00",
          descripcion: "Programa test"
        },
        {
          program_id: "4",
          nombre: "El matutino",
          hora: "20:30:00",
          hora_final: "21:30:00",
          descripcion: "Programa test"
        },
        {
          program_id: "5",
          nombre: "La tarde con jochy",
          hora: "20:45:00",
          hora_final: "21:30:00",
          descripcion: "Programa test"
        }
      ];
    }
  }
};
</script>
