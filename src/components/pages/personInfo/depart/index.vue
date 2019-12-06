<template>
  <div class="depart">
    <h1>部门组织架构</h1>
    <div class="list-tree">
      <section>
        <div class="filter-tree-menu">
          <el-input
            v-model="filterText"
            @change="filterTextChange"
            clearable
            placeholder="请输入关键字进行过滤"
            style="max-width: 250px;margin-bottom: 20px"
            v-if="list.length > 0"
          ></el-input>
          <el-tree
            class="filter-tree"
            :default-expand-all="true"
            :data="list"
            :props="listProps"
            :filter-node-method="filterNode"
            ref="menuTree"
            node-key="id"
          ></el-tree>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: "depart",
  data() {
    return {
      list: [],
      filterText: "",
      listProps: {
        children: "children",
        label: "deptname"
      }
    };
  },
  mounted() {
    this.$nextTick(function() {
        this.getList();
    });
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.deptname.indexOf(value) > -1;
    },
    filterTextChange(value) {
      this.$refs.menuTree.filter(value);
    },
    getList() {
      this.loading = true;
      this.$axios.get("/concur/hrinfo/department/treelist").then(res => {
        this.loading = false;
        if (res && res.success) {
          this.list = res.result;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.depart {
  background-color: #ffffff;
  padding: 12px 12px 5px;
  border-radius: 10px;
  min-height: 500px;
  h1 {
    font-size: 16px;
    color: #000000;
    font-weight: bold;
  }
}
.list-tree {
  > section {
    display: flex;
  }
}

.filter-tree-menu {
  flex-basis: 35%;
  padding: 15px 5px;
}

.filter-tree {
  min-width: 250px;
}
</style>