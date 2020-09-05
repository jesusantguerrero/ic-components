<template>
  <div class="login flex justify-center items-center h-screen">
    <div class="form-card">
      <h2 class="text-2xl">Login</h2>
      <form action="">
        <div class="mb-4">
          <label for="identity" class="block mb-2 font-bold">Identity</label>
          <input
            type="text"
            class="border-2 border-gray-400"
            v-model="formData.indentity"
          />
        </div>
        <button
          class="bg-blue-500 text-white px-3 py-2"
          @click.prevent="login()"
        >
          Login as guest
        </button>
      </form>
      <span class="block mb-2"> Or </span>
      <button class="bg-blue-500 text-white px-3 py-2">
        Login with google
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Login",
  props: {
    endpoint: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      formData: {
        identity: ""
      }
    };
  },
  mounted() {
    const token = localStorage.getItem("identity");
    if (token) {
      this.formData.indentity = token;
      this.login();
    }
  },
  methods: {
    login() {
      this.getAccessToken(this.formData.indentity);
    },

    getAccessToken(identity) {
      axios({
        method: "GET",
        url: `${this.endpoint}/getToken?identity=${identity}`
      })
        .then(({ data }) => {
          localStorage.setItem("identity", identity);
          this.$emit("logged", data, identity);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style></style>
