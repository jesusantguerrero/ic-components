<template>
  <div class="wrap">
    <div class="container-fluid">
      <form action="" class="row" @submit.prevent="saveProgram">
        <div class="form-group col-md-12">
          <label for=""> Nombre: </label>
          <input
            type="text"
            class="form-control"
            v-model="formData.nombre"
            required
          />
        </div>

        <div class="form-group col-4">
          <label for="dia"> Dia: </label>
          <select
            class="form-control"
            name="dia"
            id="dia"
            required
            v-model="formData.dia"
          >
            <option :value="day" v-for="day in dayList" :key="day">
              {{ day }}
            </option>
          </select>
        </div>

        <div class="form-group col-4">
          <label for="hora"> Hora Inicial: </label>
          <select
            class="form-control"
            name="hora"
            id="hora"
            required
            v-model="formData.hora"
          >
            <option
              :value="hour.value"
              v-for="hour in hourList"
              :key="`hour-${hour.value}`"
            >
              {{ hour.label }}</option
            >
          </select>
        </div>

        <div class="form-group col-4">
          <label for="dia"> Hora Final: </label>
          <select
            class="form-control"
            v-model="formData.hora_final"
            name="hora-final"
            id="hora-final"
            required
          >
            <option
              :value="hour.value"
              v-for="hour in hourList"
              :key="`final-hour-${hour.value}`"
            >
              {{ hour.label }}</option
            >
          </select>
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
            rows="10"
          ></textarea>
        </div>

        <div class="col-12">
          <button type="submit" class="btn btn-primary">
            Guardar Programa
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    endpoint: {
      type: String,
      default: "http://store.test/wp-json/ics/v1/programs"
    }
  },
  data() {
    return {
      dayList: [
        "Domingo",
        "Lunes",
        "Martes",
        "Miercoles",
        "Jueves",
        "Viernes",
        "Sabado"
      ],
      formData: {
        nombre: "",
        dia: "",
        hora: "",
        hora_final: "",
        descripcion: ""
      }
    };
  },
  computed: {
    hourList() {
      const hourList = [];
      const minutes = ["00", "30"];
      for (let hour = 0; hour < 24; hour++) {
        let hourString = hour;
        let meridian = "AM";

        if (hour > 11) {
          hourString = hour > 12 ? hour - 12 : hour;
          meridian = "PM";
        }

        if (hourString < 10) {
          hourString = "0" + hourString;
        }

        if (hour == 0) {
          hourString = 12;
        }

        const hours = minutes.map(minute => {
          return {
            value: `${hour}:${minute}`,
            label: `${hourString}:${minute} ${meridian}`
          };
        });

        hourList.push(...hours);
      }

      return hourList;
    }
  },
  methods: {
    clearForm() {
      this.formData = {
        nombre: "",
        dia: "",
        hora: "",
        horaFinal: "",
        descripcion: ""
      };
    },

    saveProgram() {
      if (this.endpoint) {
        const params = new URLSearchParams();
        Object.entries(this.formData).forEach(([name, value]) => {
          params.append(name, value);
        });

        fetch(this.endpoint, {
          method: "post",
          body: params
        })
          .then(res => res.json())
          .then(res => {
            alert(res.nombre + " Guardado con exito!");
            this.clearForm();
          })
          .catch(err => {
            console.log(err);
            console.dir(err);
          });
      } else {
        alert("No hay endpoint valido");
      }
    }
  }
};
</script>

<style></style>
