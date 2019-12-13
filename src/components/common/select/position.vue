<template>
  <el-select filterable :value="value" @change="change" clearable>
    <el-option v-for="item in options" :key="item.id" :value="item.id" :label="item.postdesc"></el-option>
  </el-select>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number],
      default: ""
    }
  },
  data() {
    return {
      options: []
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    change(val) {
      this.$emit("input", val);
      this.$emit("change", val);
    },
    async getList(compId) {
      this.$axios.get("/concur/hrinfo/post/list").then(res => {
        if (res && res.success) {
          this.options = res.result.records;
        }
      });
    }
  }
};
</script>

<style lang="scss" module="s">
</style>
