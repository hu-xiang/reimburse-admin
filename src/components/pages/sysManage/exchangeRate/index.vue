<template>
  <div class="exchangeRate">

    <!--搜索栏位-->

    <top-bar>
      <section>
        <label>地区编号</label>
        <el-input></el-input>
      </section>
      <section>
        <label>占个位子</label>
        <el-input></el-input>
      </section>
      <section>
        <el-button type="primary" @click="handleSearch" size="mini">{{$t('message.searchBtn')}}</el-button>
        <el-button @click="handleReset" size="mini">{{$t('message.resetBtn')}}</el-button>
      </section>
    </top-bar>

    <!---------------------------------------------------血淋淋的切割线-------------------------------------------------->

    <!--表格数据区域-->

    <table-bar>
      <div slot="top">
        <el-button type="primary" @click="$router.push('/exchangeRateAdd')" size="mini">{{$t('message.addBtn')}}</el-button>
      </div>
      <el-table slot="table"
                v-loading="loading"
                @selection-change="handleSelectionChange"
                border
                stripe
                :data="exchangeRateTableList"
                style="width: 100%">
        <el-table-column align="center"
                         fixed="left"
                         :label="$t('message.operate')"
                         width="120">
          <template slot-scope="{row}">
            <el-button type="text"
                       @click="$router.push({path:'/exchangeRateEdit',query:{row:row}})"
                       size="mini">
              {{$t('message.editBtn')}}
            </el-button>
            <el-button type="text" size="mini" @click="handleDelete(row)">
              {{$t('message.deleteBtn')}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="curId"
                         label="源货币" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="targetCurId"
                         label="目标货币" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="gdatu"
                         label="汇率有效日期" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="ukurs"
                         label="汇率" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="tfact"
                         label="目标货币比率" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="ffact"
                         label="源货币比率" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="f_ktext"
                         label="源货币名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="t_ktext"
                         label="目标货币名称" show-overflow-tooltip>
        </el-table-column>

      </el-table>
      <el-pagination slot="page"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="curSearchContent.pageNo"
                     :page-sizes="[20, 30, 50, 100]"
                     :page-size="curSearchContent.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
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
          exchangeRate: '',
          pageNo:'',
          pageSize:''
        },
        curSearchContent: {
          pageNo: 1, // 当前页
          pageSize: 20, // 每页显示数量
        },
        total: 0, // 总条数
      };
    },
    created() {
      this.getExchangeRateList()
    },

    mounted() {
      this.$nextTick(function () {
        this.getExchangeRateList();
      });
    },

    methods: {
      handleSearch() {
        this.getExchangeRateList(1);
      },
      handleReset() {

      },
      handleAdd() {

      },
      handleDelete() {

      },
      handleEdit() {

      },

      getExchangeRateList(bool) {
        if (bool) Object.assign(this.curSearchContent, this.searchContent);
        this.loading = true;
        this.$axios.get(`concur/gloConfig/exchangeRate/list?${this.$qs.stringify(this.curSearchContent)}`).then(res => {
          this.loading = false;
          if (res && res.success) {
            this.exchangeRateTableList = res.result.records;
            this.total = res.result.total;
          }
        });
        Object.assign(this.searchContent, this.curSearchContent);
      },

      handleSelectionChange(val) {
        this.selectedRowKeys = val;
      },

      handleSizeChange(val) {
        this.curSearchContent.pageSize = val;
        this.getExchangeRateList();
      },

      handleCurrentChange(val) {
        this.curSearchContent.pageNo = val;
        this.getExchangeRateList();
      },

    }
  };
</script>

<style lang="scss" scoped>
  .exchangeRate {

  }
</style>
