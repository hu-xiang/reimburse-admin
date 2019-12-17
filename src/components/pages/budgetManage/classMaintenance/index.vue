<template>
  <div class="depart">
    <top-bar>
      <section>
        <label>类型名称</label>
        <el-input v-model="searchContent.budName" clearable placeholder="请输入关键字进行过滤"></el-input>
      </section>
      <section>
        <el-button type="primary" @click="eventSearch" size="mini">{{$t('message.searchBtn')}}</el-button>
        <el-button @click="eventReset" size="mini">{{$t('message.resetBtn')}}</el-button>
      </section>
    </top-bar>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>预算类型</span>
      </div>
      <div class="text item">
        <el-tree
          class="filter-tree"
          :default-expand-all="true"
          :data="list"
          :props="listProps"
          :filter-node-method="filterNode"
          ref="menuTree"
          node-key="id"
        >
            <span slot-scope="{ node, data }">
              <span class="node-name">{{ data.budName}}</span>
            </span>
        </el-tree>
        <el-pagination
        slot="page"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="curSearchContent.pageNo"
        :page-sizes="[10, 20, 50]"
        :page-size="curSearchContent.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      </div>
    </el-card>
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
        label: "budName"
      },
      searchContent: {
        budName: ""
      },
      curSearchContent: {
        pageNo: 1, // （当前页）
        pageSize: 10 // 每页显示数量
      },
      total: 0, // 总条数
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
      return data.budName.indexOf(value) > -1;
    },
    eventSearch() {
      this.$refs.menuTree.filter(this.searchContent.budName);
    },
    eventReset() {
      this.searchContent = {
        budName: ""
      };
      this.$refs.menuTree.filter(this.searchContent.budName);
    },
    getList() {
      this.loading = true;
      this.$axios.get(
        `concur/budget/budgetType/treelist?${this.$qs.stringify(
            this.curSearchContent
          )}`).then(res => {
        this.loading = false;
        if (res && res.success) {
          this.list = res.result;
          this.total = res.total;
        }
      });
    },
    handleSizeChange(val) {
      this.curSearchContent.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.curSearchContent.pageNo = val;
      this.getList();
    }
  }
};
</script>

<style lang="scss" scoped>
.box-card {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 12px;
  margin-top: 7px;
}
</style>