<template>
  <div class="hello px-24">
    <div class="board__toolbar flex justify-between mb-10">
      <div class="w-full text-left">
        <button>Vista</button>
      </div>

      <div class="w-full">
        <button class="btn btn-blue" @click="createMode=!createMode">New Task</button>
        <input
          type="search"
          class="form-input ml-2"
          name=""
          id=""
          placeholder="search"
        />
        <span class="ml-2 toolbar-buttons"> <i class="fa fa-user"></i> </span>
        <span class="ml-2 toolbar-buttons"><i class="fa fa-eye"></i></span>
        <span class="ml-2 toolbar-buttons">
          <i class="fa fa-thumbtack"></i
        ></span>
        <span class="ml-2 toolbar-buttons"> <i class="fa fa-filter"></i> </span>
        <span class="ml-2 toolbar-buttons"> <i class="fa fa-sort"></i> </span>
      </div>
    </div>

    <item-group
      v-for="stage in stages"
      :key="stage.name"
      :stage="stage"
      :items="items"
      :new-item="newItem"
      :create-mode="createMode"
      @saved="addItem"
      class="mt-4"
    >

    </item-group>
  </div>
</template>

<script>
import ItemGroup from "./ItemGroup";
import { defineComponent } from "vue";

export default defineComponent({
  name: "HelloWorld",
  components: {
    ItemGroup
  },
  props: {
    msg: String
  },
  data() {
    return {
      createMode: false,
      boards: [],
      views: [],
      stages: [
        {
          name: "emails",
          title: "Emails",
          fields: [
            {
              name: "owner",
              title: "Owner"
            },
            {
              name: "status",
              title: "Status",
              rules: 
                {
                  bg: [
                    {
                      result: "green",
                      value: "done"
                    },
                    {
                      result: "blue",
                      value: "to do"
                    },
                    {
                      result: "red",
                      value: "high"
                    }
                  ]
                }
            },
            {
              name: "due_date",
              title: "Due Date"
            },
            {
              name: "priority",
              title: "Priority",
              rules: 
                {
                  bg: [
                    {
                      result: "green",
                      value: "low"
                    },
                    {
                      result: "blue",
                      value: "medium"
                    },
                    {
                      result: "red",
                      value: "high"
                    }
                  ]
                }
            }
          ]
        }
      ],
      rules: [],
      projects: [],
      items: [
        {
          title: "Test",
          owner: "Jesus Guerrero",
          status: "To Do",
          due_date: new Date().toISOString().slice(0, 10),
          priority: "High"
        },
         {
          title: "Test",
          owner: "Jesus Guerrero",
          status: "To Do",
          due_date: new Date().toISOString().slice(0, 10),
          priority: "low"
        },
        {
          title: "Test",
          owner: "Jesus Guerrero",
          status: "To Do",
          due_date: new Date().toISOString().slice(0, 10),
          priority: "medium"
        }
      ],
      priorities: [],
      status: [],
      comments: [],
      contacts: []
    };
  },
  methods: {
    addItem(newItem) {
       this.items.unshift(newItem);
       this.createMode = false;
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
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
  @apply pt-8;
}

.toolbar-buttons {
  @apply px-2 rounded-full inline-flex items-center justify-center cursor-pointer;
  width: 34px;
  height: 34px;

  &:hover {
    @apply bg-gray-300;
  }
}

.form-input {
  @apply shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight;
}
</style>
