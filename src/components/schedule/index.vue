<template>
  <div class="mb-12">
    <controls v-model="diaActivo" @input="diaActivo = $event"></controls>
    <grid :selected-date="diaActivo" :schedule="schedule"> </grid>
  </div>
</template>

<script>
import Controls from "./controls";
import Grid from "./grid";

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

  created() {
    this.getSchedules();
  },
  computed: {
    horaActual() {
      if (this.modoManual) {
        return this.horaActiva;
      } else {
        return new Date().getHours();
      }
    },

    programaActual() {
      const diaActual = this.programacion.find(dia => dia.dia == this.hoy);
      return diaActual.programas.find(
        programa => programa.hora == this.horaActual
      );
    }
  },
  methods: {
    getSchedules() {
      this.setBackupData();
      return;
      //   fetch(this.endpoint + "?action=get_schedules", {
      //     method: "get"
      //   })
      //     .then(response => response.json())
      //     .then(response => {
      //       if (!response) {
      //         this.setBackupData();
      //         return;
      //       }
      //       this.schedule = response;
      //     })
      //     .catch(() => {
      //       this.setBackupData();
      //     });
    },

    setBackupData() {
      this.schedule = [
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
