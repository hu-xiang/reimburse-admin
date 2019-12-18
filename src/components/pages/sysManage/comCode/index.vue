<template>
  <div class="comCode">
    <!--搜索栏位-->

    <top-bar>
      <section>
        <label>公司代码</label>
        <el-input v-model="searchContent.bukrs"></el-input>
      </section>
      <section>
        <el-button type="primary" @click="handleSearch" size="mini">{{$t('message.searchBtn')}}</el-button>
        <el-button @click="handleReset" size="mini">{{$t('message.resetBtn')}}</el-button>
      </section>
    </top-bar>

    <!---------------------------------------------------血淋淋的切割线-------------------------------------------------->

    <!--表格数据区域-->

    <table-bar>
      <el-table
        slot="table"
        v-loading="loading"
        border
        stripe
        :data="comCodeTableList"
        style="width: 100%"
      >
        <el-table-column type="index" width="40" align="center"></el-table-column>
        <el-table-column prop="butxt" label="公司名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ktopl" label="账目表" show-overflow-tooltip></el-table-column>
        <el-table-column prop="curId" label="货币" show-overflow-tooltip></el-table-column>
        <el-table-column prop="land1" label="国家" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ort01" label="城市" show-overflow-tooltip></el-table-column>
        <el-table-column prop="bukrs" label="公司代码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ktext" label="货币名称" show-overflow-tooltip></el-table-column>
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
    </table-bar>
  </div>
</template>

<script>
export default {
  name: "comCode",
  data() {
    return {
      loading: false,
      comCodeTableList: [{}],
      searchContent: {
        bukrs: ""
      },
      curSearchContent: {
        pageNo: 1, // 当前页
        pageSize: 20 // 每页显示数量
      },
      total: 0 // 总条数
    };
  },

  mounted() {
    this.$nextTick(function() {
      this.getComCodeList(1);
    });
  },

  methods: {
    handleSearch() {
      this.getComCodeList(1);
    },
    handleReset() {
      this.searchContent = {
        bukrs: ""
      };
      this.getComCodeList(1);
    },
    getComCodeList(bool) {
      if (bool) Object.assign(this.curSearchContent, this.searchContent);
      this.loading = true;
      this.$axios
        .get(
          `concur/gloConfig/curCompany/list?${this.$qs.stringify(
            this.curSearchContent
          )}`
        )
        .then(res => {
          this.loading = false;
          if (res && res.success) {
            this.comCodeTableList = res.result.records;
            this.total = res.result.total;
          }
        });
      Object.assign(this.searchContent, this.curSearchContent);
    },
    handleSizeChange(val) {
      this.curSearchContent.pageSize = val;
      this.getComCodeList();
    },
    handleCurrentChange(val) {
      this.curSearchContent.pageNo = val;
      this.getComCodeList();
    }
  }
};
</script>

<style lang="scss" scoped>
.comCode {
}
</style>
