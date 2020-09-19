<template>
  <div class="wrap">
    <div class="container-fluid">
      <form action="" class="row" @submit.prevent="saveProgram">
        <div class="col-12">
          <article class="prose lg:prose-xl mb-5">
            <h3>{{ title }}</h3>
          </article>
        </div>
        <div class="form-group col-md-12">
          <label for=""> Nombre: </label>
          <input
            type="text"
            class="form-control"
            v-model="formData.nombre"
            required
          />
        </div>

        <div class="flex">
          <div class="form-group w-1/4">
            <label class="demonstration">Fecha:</label>
            <el-date-picker
              v-model="formData.fecha"
              type="date"
              placeholder="selecciona una fecha"
            >
            </el-date-picker>
          </div>

          <div class="form-group w-1/4">
            <label for="hora"> Hora Inicial: </label>
            <el-time-picker
              v-model="formData.hora"
              required
              placeholder="selecciona una hora"
              format="hh:mm a"
              :editable="false"
              :picker-options="{
                start: '00:00',
                step: '00:15',
                end: '23:45'
              }"
            >
            </el-time-picker>
          </div>

          <div class="form-group w-1/4">
            <label for="dia"> Hora Final: </label>
            <el-time-picker
              required
              :editable="false"
              v-model="formData.hora_final"
              placeholder="selecciona una hora final"
              format="hh:mm a"
              :picker-options="{
                start: '00:00',
                step: '00:15',
                end: '23:45'
              }"
            >
            </el-time-picker>
          </div>

          <div class="form-group w-1/4">
            <label class="demonstration">Fecha Final:</label>
            <el-date-picker
              v-model="formData.fecha_final"
              type="date"
              input-class="w-full"
              placeholder="selecciona una fecha"
            >
            </el-date-picker>
          </div>
        </div>

        <div class="form-group col-12">
          <label for=""> URL imagen: </label>
          <input
            v-model="formData.url_imagen"
            name="url_imagen"
            id="url_imagen"
            class="form-control"
          />
        </div>

        <div class="form-group col-12">
          <div>
            <label for=""> Frecuencia: </label>
            <select
              name=""
              id=""
              v-model="formData.frecuencia"
              class="form-control"
            >
              <option value=""> No Repetir</option>
              <option value="DAILY">Repetir cada dia</option>
              <option value="WEEK_DAY"
                >Repetir los <span class="capitalize">{{ day }}</span></option
              >
              <option value="WEEK">Cada Semana</option>
            </select>
          </div>
        </div>

        <div class="form-group col-12" v-if="formData.frecuencia == 'WEEK'">
          <div>
            <label for=""> Se Repite el: </label>
            <div class="flex grid-cols-7">
              <label
                :for="day"
                v-for="day in ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB']"
                :key="day"
                class="mr-5"
              >
                <input
                  type="checkbox"
                  :name="day"
                  :id="day"
                  class="mr-1"
                  v-model="formData.week_days"
                />
                {{ day }}
              </label>
            </div>
          </div>
        </div>

        <div class="form-group col-12" v-if="formData.frecuencia">
          <div>
            <label for=""> Termina: </label>
            <label for="">
              <input type="radio" name="termina" id="" value="none" />
              Nunca
            </label>
            <label for="">
              <input type="radio" name="termina" id="" value="date" />
              Hasta el
            </label>

            <label for="">
              <input type="radio" name="termina" id="" value="count" />
              Despues de
            </label>
          </div>
        </div>

        <div class="form-group col-12">
          <label for=""> Descripcion: </label>
          <textarea
            required
            v-model="formData.descripcion"
            name="descripcion"
            id="descripcion"
            class="form-control"
            cols="30"
            rows="5"
          ></textarea>
        </div>

        <div class="flex justify-end">
          <button
            type="submit"
            class="btn bg-gray-700"
            @click="$emit('canceled')"
          >
            Cancelar
          </button>

          <button
            type="submit"
            class="btn btn-primary ml-4"
            :disabled="isLoading"
          >
            {{ saveButtonText }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { format, toDate } from "date-fns";
import { es } from "date-fns/locale/";
import axios from "axios";

export default {
  props: {
    endpoint: {
      type: String,
      default: "http://mahanahim.test/wp-json/ic-schedule/v1/programs"
    },
    data: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {
    title() {
      return this.formData.id
        ? `Actualizar ${this.formData.nombre}`
        : "Agregar Nuevo Programa";
    },
    saveButtonText() {
      return this.formData.id ? "Guardar Cambios" : "Agregar Programa";
    },

    day() {
      return format(this.formData.fecha, "iiii", { locale: es });
    }
  },
  watch: {
    data: {
      handler() {
        if (Object.keys(this.data).length) {
          const formData = { ...this.data };
          if (this.data.fecha) {
            const date = formData.fecha.split("-");
            formData.fecha = toDate(new Date(date[0], date[1] - 1, date[2]));
            formData.hora = this.setTime(this.data.hora);
            formData.hora_final = this.setTime(this.data.hora_final);
          }
          this.formData = { ...formData };
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      isLoading: false,
      formData: {
        nombre: "",
        fecha: new Date(),
        hora: new Date(),
        week_days: [],
        frecuencia: "",
        hora_final: "",
        descripcion: ""
      }
    };
  },
  methods: {
    setTime(data) {
      const date = new Date();
      const hourDate = data.split(":");
      date.setHours(hourDate[0]);
      date.setMinutes(hourDate[1]);
      date.setSeconds(0);
      return date;
    },

    clearForm() {
      this.formData = {
        programa_padre: "",
        frecuencia: "",
        fecha_final: "",
        nombre: "",
        fecha: "",
        hora: "",
        horaFinal: "",
        descripcion: ""
      };
    },

    prepareData() {
      const formData = { ...this.formData };
      formData.fecha = format(formData.fecha, "yyyy-MM-dd");
      formData.hora = format(formData.hora, "HH:mm:ss");
      formData.hora_final = format(formData.hora_final, "HH:mm:ss");
      if (formData.fecha_final) {
        formData.fecha_final = format(formData.fecha_final, "yyyy-MM-dd");
      }
      return formData;
    },

    saveProgram() {
      if (this.endpoint) {
        this.isLoading = true;
        const params = new URLSearchParams();
        Object.entries(this.prepareData()).forEach(([name, value]) => {
          params.append(name, value);
        });

        const url = this.formData.id
          ? `${this.endpoint}/${this.formData.id}`
          : this.endpoint;
        const method = this.formData.id ? "PUT" : "POST";

        axios({
          url,
          method,
          data: params
        })
          .then(({ data }) => {
            this.$notify({
              type: "success",
              message: `${data.nombre} Guardado con exito!`
            });
            this.clearForm();
            this.$emit("saved");
          })
          .catch(err => {
            this.$notify({
              type: "error",
              message: err.toString()
            });
          })
          .finally(() => {
            this.isLoading = false;
          });
      } else {
        this.$notify({
          type: "error",
          message: "No hay endpoint valido"
        });
      }
    }
  }
};
</script>

<style lang="scss">
.form-group {
  @apply mb-5;
  label {
    @apply block text-gray-700 text-sm font-bold mb-2;
  }
}

.form-control {
  @apply shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight;

  &:focus {
    @apply outline-none shadow-outline;
  }
}

.btn {
  @apply bg-green-700 text-white px-5 py-2;
}
</style>
