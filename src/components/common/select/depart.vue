<template>
  <el-cascader
    v-model="deptIds"
    :options="options"
    change-on-select
    clearable
    :show-all-levels="false"
    @change="handleChange"
    :props="props"
  ></el-cascader>
</template>

<script>
export default {
  props: {
    value: {
      type: [Number, String],
      default: null
    },
  },
  data() {
    return {
      props: {
        value: "id",
        label: "deptname",
        children: "children"
      },
      deptIds: [],
      options: []
    };
  },
  mounted() {
    this.getTreeList();
  },
  methods: {
    handleChange(val) {
      const deptId = val[val.length - 1];
      this.$emit("input", deptId);
      this.$emit("change", val);
    },
    getTreeList() {
      this.$axios.get("/concur/hrinfo/department/treelist").then(res => {
        if (res && res.success) {
          this.options = res.result;
        }
      });
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.deptIds = val;
      } else {
        this.deptIds = [];
      }
    },
  }
};
</script>

<style lang="scss" module="s">
</style>
