<template>
  <div class="bankAccount">
    <!--搜索栏位-->

    <top-bar>
      <section>
        <label>银行账号</label>
        <el-input v-model="searchContent.zdimuscod"></el-input>
      </section>
      <section>
        <label>账号类型</label>
        <el-select v-model="searchContent.zbtyp" clearable>
          <el-option label="储蓄" :value="1"></el-option>
          <el-option label="支票" :value="2"></el-option>
          <el-option label="现金" :value="3"></el-option>
          <el-option label="其他" :value="4"></el-option>
        </el-select>
      </section>
      <section>
        <label>账户名称</label>
        <el-input v-model="searchContent.txt50"></el-input>
      </section>
      <section>
        <label>公司名称</label>
        <el-input v-model="searchContent.butxt"></el-input>
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
        :data="bankAccountTableList"
        style="width: 100%"
      >
        <el-table-column type="index" width="40" align="center"></el-table-column>
        <el-table-column prop="comId" label="公司代码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="banks" label="银行国家代码" show-overflow-tooltip min-width="90px"></el-table-column>
        <el-table-column prop="bankl" label="银行编号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="zdimuscod" label="银行账号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="curId" label="货币码/币别表" show-overflow-tooltip min-width="90px"></el-table-column>
        <el-table-column prop="zbtyp" label="账号类型" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span v-if="row.zbtyp==='1'">储蓄</span>
            <span v-if="row.zbtyp==='2'">支票</span>
            <span v-if="row.zbtyp==='3'">现金</span>
            <span v-if="row.zbtyp==='4'">其他</span>
          </template>
        </el-table-column>
        <el-table-column prop="txt50" label="账户名称" show-overflow-tooltip></el-table-column>
        <el-table-column
          prop="swift"
          label="国际付款的 SWIFT/BIC"
          show-overflow-tooltip
          min-width="140px"
        ></el-table-column>
        <el-table-column prop="zzhxz" label="账户性质" show-overflow-tooltip></el-table-column>
        <el-table-column prop="zzhyt" label="账户用途" show-overflow-tooltip></el-table-column>
        <el-table-column prop="zkhjl" label="客户经理" show-overflow-tooltip></el-table-column>
        <el-table-column prop="telf1" label="第一个电话号" show-overflow-tooltip min-width="90px"></el-table-column>
        <el-table-column prop="telf2" label="第二个电话号" show-overflow-tooltip min-width="90px"></el-table-column>
        <el-table-column prop="telfx" label="传真号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="zkkrq" label="开户日期" show-overflow-tooltip></el-table-column>
        <el-table-column prop="zzxrq" label="注销日期" show-overflow-tooltip></el-table-column>
        <el-table-column prop="accId" label="会计科目" show-overflow-tooltip></el-table-column>
        <el-table-column prop="butxt" label="公司名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ktext" label="货币名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="atxt50" label="总帐科目名称" show-overflow-tooltip min-width="90px"></el-table-column>
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
  name: "bankAccount",
  data() {
    return {
      loading: false,
      bankAccountTableList: [{}],
      searchContent: {
        zdimuscod: "",
        zbtyp: "",
        txt50: "",
        butxt: ""
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
      this.getBankAccountList(1);
    });
  },

  methods: {
    handleSearch() {
      this.getBankAccountList(1);
    },
    handleReset() {
      this.searchContent = {
        zdimuscod: "",
        zbtyp: "",
        txt50: "",
        butxt: ""
      };
      this.getBankAccountList(1);
    },
    getBankAccountList(bool) {
      if (bool) Object.assign(this.curSearchContent, this.searchContent);
      this.loading = true;
      this.$axios
        .get(
          `concur/gloConfig/bankAccount/list?${this.$qs.stringify(
            this.curSearchContent
          )}`
        )
        .then(res => {
          this.loading = false;
          if (res && res.success) {
            this.bankAccountTableList = res.result.records;
            this.total = res.result.total;
          }
        });
      Object.assign(this.searchContent, this.curSearchContent);
    },
    handleSizeChange(val) {
      this.curSearchContent.pageSize = val;
      this.getBankAccountList();
    },
    handleCurrentChange(val) {
      this.curSearchContent.pageNo = val;
      this.getBankAccountList();
    }
  }
};
</script>

<style lang="scss" scoped>
.bankAccount {
}
</style>
