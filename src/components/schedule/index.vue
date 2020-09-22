<template>
  <div class="">
    <div v-if="!isFormOpen">
      <button
        class="text-blue-600 rounded-lg w-56 p-3 border-2 border-gray-400"
        @click="openForm()"
        v-if="allowAdd"
      >
        Agregar Programa
      </button>
      <button
        class="text-blue-600 rounded-lg w-56 p-3 border-2 border-gray-400"
        @click="nextMode = 'week'"
        v-if="allowAdd"
      >
        Change Mode
      </button>

      <controls
        v-model:day="selectedDay"
        v-model:week="selectedWeek"
        viewMode="day"
        nextMode="day"
        @input="selectedDay = $event"
      ></controls>

      <grid
        class="mx-8"
        :selected-date="selectedDay"
        :schedule="schedule"
        :allow-add="allowAdd"
        :allow-delete="allowDelete"
        :allow-update="allowUpdate"
        @delete-called="deleteItem"
        @update-called="openForm"
        @add-called="openForm"
      >
      </grid>
    </div>
  </div>
</template>

<script>
import { format } from "date-fns";
import Controls from "./controls";
import Grid from "./grid";
import axios from "axios";
import { defineComponent } from "vue";

export default defineComponent({
  name: "Schedule",
  props: {
    endpoint: {
      type: String,
      required: true
    },
    allowAdd: {
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
  components: {
    Controls,
    Grid
  },
  data() {
    return {
      isFormOpen: false,
      selectedDay: new Date(),
      formData: {},
      schedule: []
    };
  },
  computed: {
    scheduleURL() {
      return `${this.endpoint}?fecha=${format(this.selectedDay, "yyyy-MM-dd")}`;
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
    },

    openForm(formData) {
      this.formData = formData;
      this.isFormOpen = true;
    },

    onSaved(item) {
      this.getSchedules();
      this.isFormOpen = false;
      this.formData = {};
    },

    onCanceled() {
      this.isFormOpen = false;
      this.formData = {};
    },

    deleteItem(item) {
      confirm("Este programa se eliminará", "Eliminar programa").then(
        action => {
          if (action == "confirm") {
            axios({
              url: `${this.endpoint}/${item.id}`,
              method: "delete",
              data: {
                delete_related: true
              }
            })
              .then(() => {
                this.getSchedules();
              })
              .catch(e => {
                console.log(e);
              });
          }
        }
      );
    }
  }
});
</script>
