<template>
  <div class="hello px-24">
    <div class="board__toolbar flex justify-between">
      <div class="w-full text-left">
        <button>Vista</button>
      </div>

      <div class="w-full">
        <button class="btn btn-blue">New Task</button>
        <input type="search" class="form-input ml-2" name="" id="" placeholder="search"/>
        <span class="ml-2"> person </span>
        <span class="ml-2">see</span>
        <span class="ml-2"> pinned </span>
        <span class="ml-2"> filter </span>
        <span class="ml-2"> sort </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "HelloWorld",
  props: {
    msg: String
  },
  data() {
    return {
      views: [],
      stages: [],
      rules: [],
      projects: [],
      items: [{}],
      priorities: [],
      status: [],
      comments: [],
      contacts: []
    };
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.btn {
  @apply font-bold py-2 px-4 rounded;
}

.btn-blue {
  @apply bg-blue-500 text-white;
}

.btn-blue:hover {
  @apply bg-blue-700;
}

.board__toolbar {
  @apply pt-8
}

.form-input {
  @apply shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight;
}
</style>
