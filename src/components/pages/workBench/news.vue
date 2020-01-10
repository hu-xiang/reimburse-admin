<template>
  <div class="news">
      <!-- <div slot="top">
        <el-button
          type="primary"
          @click="eventAdd"
          size="mini"
        >{{$t('message.addBtn')}}</el-button>
      </div> -->
      <el-table
        ref="table"
        slot="table"
        v-loading="loading"
        stripe
        border
        :data="tableList"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="index" width="40" align="center" fixed="left"></el-table-column>
        <el-table-column prop="title" label="标题" show-overflow-tooltip></el-table-column>
        <el-table-column prop="content" label="内容" show-overflow-tooltip></el-table-column>
        <el-table-column prop="accessory" label="附件" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createDate" label="创建时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createName" label="创建人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="updateDate" label="修改时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="updateName" label="修改人" show-overflow-tooltip></el-table-column>
      </el-table>
      <el-pagination
        slot="page"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="curSearchContent.pageNo"
        :page-sizes="[20, 30, 50, 100]"
        :page-size="curSearchContent.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
  </div>
</template>

<script>
export default {
  name: "news",
  data() {
    return {
      loading: false,
      tableList: [],
      curSearchContent: {
        pageNo: 1, // （当前页）
        pageSize: 20 // 每页显示数量
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
    getList() {
      this.loading = true;
      this.$axios
        .get(
          `/concur/worktab/message/list?${this.$qs.stringify(
            this.curSearchContent
          )}`
        )
        .then(res => {
          this.loading = false;
          if (res && res.success) {
            this.tableList = res.result.records;
            this.total = res.result.total;
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
    },
  }
};
</script>

<style lang="scss" scoped>
.budgetApply {
  .el-tree {
    margin-top: 20px;
  }
}
</style>