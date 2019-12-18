<template>
  <div class="curCurrency">
    <!--搜索栏位-->

    <top-bar>
      <section>
        <label>货币码</label>
        <el-input v-model="searchContent.waers"></el-input>
      </section>
      <section>
        <label>货币名称</label>
        <el-input v-model="searchContent.ktext"></el-input>
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
        :data="curCurrencyTableList"
        style="width: 100%"
      >
        <el-table-column prop="waers" label="货币码" show-overflow-tooltip></el-table-column>
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
  name: "curCurrency",
  data() {
    return {
      loading: false,
      curCurrencyTableList: [{}],
      searchContent: {
        waers: "",
        ktext: "",
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
      this.getCurCurrencyList(1);
    });
  },

  methods: {
    handleSearch() {
      this.getCurCurrencyList(1);
    },
    handleReset() {
      this.searchContent = {
        waers: "",
        ktext: "",
      };
      this.getCurCurrencyList(1);
    },
    getCurCurrencyList(bool) {
      if (bool) Object.assign(this.curSearchContent, this.searchContent);
      this.loading = true;
      this.$axios
        .get(
          `concur/gloConfig/curCurrency/list?${this.$qs.stringify(
            this.curSearchContent
          )}`
        )
        .then(res => {
          this.loading = false;
          if (res && res.success) {
            this.curCurrencyTableList = res.result.records;
            this.total = res.result.total;
          }
        });
      Object.assign(this.searchContent, this.curSearchContent);
    },
    handleSizeChange(val) {
      this.curSearchContent.pageSize = val;
      this.getCurCurrencyList();
    },
    handleCurrentChange(val) {
      this.curSearchContent.pageNo = val;
      this.getCurCurrencyList();
    }
  }
};
</script>

<style lang="scss" scoped>
.curCurrency {
}
</style>
