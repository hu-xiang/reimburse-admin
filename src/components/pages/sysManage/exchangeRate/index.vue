<template>
  <div class="exchangeRate">
    <!--搜索栏位-->

    <top-bar>
      <section>
        <label>源货币名称</label>
        <el-input v-model="searchContent.fktext"></el-input>
      </section>
      <section>
        <label>目标货币名称</label>
        <el-input v-model="searchContent.tktext"></el-input>
      </section>
      <section>
        <label>汇率</label>
        <el-input v-model="searchContent.ukurs"></el-input>
      </section>
      <section>
        <label>汇率有效日期</label>
        <el-date-picker
          class="dateInput"
          v-model="searchContent.gdatu"
          type="date"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="汇率有效日期"
        ></el-date-picker>
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
        :data="exchangeRateTableList"
        style="width: 100%"
      >
        <el-table-column type="index" width="40" align="center"></el-table-column>
        <el-table-column prop="curId" label="源货币" show-overflow-tooltip></el-table-column>
        <el-table-column prop="targetCurId" label="目标货币" show-overflow-tooltip></el-table-column>
        <el-table-column prop="gdatu" label="汇率有效日期" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ukurs" label="汇率" show-overflow-tooltip></el-table-column>
        <el-table-column prop="tfact" label="目标货币比率" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ffact" label="源货币比率" show-overflow-tooltip></el-table-column>
        <el-table-column prop="fktext" label="源货币名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="tktext" label="目标货币名称" show-overflow-tooltip></el-table-column>
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
  name: "exchangeRate",
  data() {
    return {
      loading: false,
      exchangeRateTableList: [{}],
      searchContent: {
        fktext: "",
        tktext: "",
        ukurs: "",
        gdatu: ""
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
      this.getExchangeRateList(1);
    });
  },

  methods: {
    handleSearch() {
      this.getExchangeRateList(1);
    },
    handleReset() {
      this.searchContent = {
        fktext: "",
        tktext: "",
        ukurs: "",
        gdatu: ""
      };
      this.getExchangeRateList(1);
    },
    getExchangeRateList(bool) {
      if (bool) Object.assign(this.curSearchContent, this.searchContent);
      this.loading = true;
      this.$axios
        .get(
          `concur/gloConfig/exchangeRate/list?${this.$qs.stringify(
            this.curSearchContent
          )}`
        )
        .then(res => {
          this.loading = false;
          if (res && res.success) {
            this.exchangeRateTableList = res.result.records;
            this.total = res.result.total;
          }
        });
      Object.assign(this.searchContent, this.curSearchContent);
    },
    handleSizeChange(val) {
      this.curSearchContent.pageSize = val;
      this.getExchangeRateList();
    },

    handleCurrentChange(val) {
      this.curSearchContent.pageNo = val;
      this.getExchangeRateList();
    }
  }
};
</script>

<style lang="scss" scoped>
.exchangeRate {
  /deep/ .dateInput .el-input__inner {
    padding-left: 30px;
  }
}
</style>
