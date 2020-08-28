<template>
  <div class="item-group-cell">
    <span @dblclick="toggleEditMode()" v-if="!isEditMode">
      {{ item[fieldName] }}
    </span>
    <input
			v-else
			@blur="saveChanges"
      type="text"
			class="form-input"
      :name="`${index}-${fieldName}`"
      id=""
      v-model="value"
    />
  </div>
</template>

<script>
export default {
  props: {
    fieldName: {
      type: String,
    },
    fieldType: {
      type: String,
      default: "text",
    },
    item: {
      type: Object,
    },
    index: {
      type: Number,
		},
		isNew: {
			type: Boolean
		}
  },
	watch:{
		isNew: {
			handler(isNew) {
				this.isEditMode = isNew
			},
			immediate: true
		},
		item: {
			handler(item) {
				if (item[this.fieldName] != this.value) {
					this.value = item[this.fieldName];
				}
			},
			deep: true,
			immediate: true
		}
	},
  data() {
    return {
      value: "",
      isEditMode: false,
    };
  },
  methods: {
    toggleEditMode() {
      this.isEditMode = !this.isEditMode;
		},
		saveChanges() {
			this.$emit('saved', this.value);
			if (!this.isNew) {
				this.toggleEditMode();
			}
		}
  },
};
</script>

<style scoped lang="scss">
.form-input {
  @apply shadow-none appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight;
}
</style>
