<template>
  <div id="app" class="w-full flex justify-center flex-col items-center py-12">
      <form>
        <div>
          <label for=""> Client Id</label>
          <input type="text" v-model="formData.clientId" class="form-control" />
        </div>

        <div>
          <label for=""> Api key</label>
          <input type="text" v-model="formData.apiKey" class="form-control" />
        </div>

        <div>
          <label for=""> Scope</label>
          <input type="text" v-model="formData.scope" class="form-control" />
        </div>
      </form>
    <div class="flex" style="width:1200px">

      <button @click="handleAuth">
        Sign With Google
      </button>
      <div class="w-3/5 mr-2">
        <div class="bg-black w-full h-full mr-2 rounded">
          <iframe
            width="700"
            height="315"
            src="https://www.youtube.com/embed/wYYe9nH4fFI"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>
      <div class="w-2/5">
        <ic-schedule-header
          endpoint="http://mahanahim.test/wp-json/ic-schedule/v1/programs"
        >
        </ic-schedule-header>
      </div>
    </div>

    <div style="width: 1200px" class="mt-5">
      <ic-schedule-view
        endpoint="http://mahanahim.test/wp-json/ic-schedule/v1/programs"
      >
      </ic-schedule-view>
    </div>
  </div>
</template>

<script>
import IcScheduleView from "@/components/schedule";
import IcScheduleHeader from "@/components/schedule/header";
import useGoogleAuth from "@/utils/useGoogleAuth";
import { defineComponent } from "vue";

export default defineComponent({
  name: "Schedule",
  props: {
    endpoint: {
      type: String,
      required: true
    }
  },
  components: {
    IcScheduleView,
    IcScheduleHeader
  },
  data() {
    return {
      formData: {
        scope: "",
        clientId: "ic-daily-1605823129076",
        apiKey: "587675303568-jhrj3u7gl2s8e5d47j46v1a3bi9bmits.apps.googleusercontent.com",
        accessType: "offline"
      }
    };
  },
  methods: {
    handleAuth() {
      const { authInstance, user } = useGoogleAuth(this.formData);
    }
  }
});
</script>

<style lang="scss">
:root {
  --primary-color: #030371;
  --primary-color-7: rgba(3, 3, 113, 0.7);
  --primary-color-6: rgba(3, 3, 113, 0.6);
  --primary-color-5: rgba(3, 3, 113, 0.5);
  --primary-radius: 12px;
}
</style>
