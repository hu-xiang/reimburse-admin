<template>
  <div class="bankAccount">

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
        <el-button type="primary" @click="$router.push('/bankAccountAdd')" size="mini">{{$t('message.addBtn')}}</el-button>
      </div>
      <el-table slot="table"
                v-loading="loading"
                @selection-change="handleSelectionChange"
                border
                stripe
                :data="bankAccountTableList"
                style="width: 100%">
        <el-table-column align="center"
                         fixed="left"
                         :label="$t('message.operate')"
                         width="120">
          <template slot-scope="{row}">
            <el-button type="text"
                       @click="$router.push({path:'/bankAccountEdit',query:{row:row}})"
                       size="mini">
              {{$t('message.editBtn')}}
            </el-button>
            <el-button type="text" size="mini" @click="handleDelete(row)">
              {{$t('message.deleteBtn')}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="comId"
                         label="公司代码" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="banks"
                         label="银行国家代码" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="bankl"
                         label="银行编号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="zdimuscod"
                         label="银行账号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="curId"
                         label="货币码/币别表" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="zbtyp"
                         label="账号类型" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="txt50"
                         label="账户名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="swift"
                         label="国际付款的 SWIFT/BIC" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="zzhxz"
                         label="账户性质" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="zzhyt"
                         label="账户用途" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="zkhjl"
                         label="客户经理" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="telf1"
                         label="第一个电话号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="telf2"
                         label="第二个电话号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="telfx"
                         label="传真号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="zkkrq"
                         label="开户日期" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="zzxrq"
                         label="注销日期" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="accId"
                         label="会计科目" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="butxt"
                         label="公司名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="ktext"
                         label="货币名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="atxt50"
                         label="总帐科目名称" show-overflow-tooltip>
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
    name: "bankAccount",
    data() {
      return {
        loading: false,
        bankAccountTableList: [{}],
        searchContent: {
          bankAccount: '',
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
      this.getBankAccountList()
    },

    mounted() {
      this.$nextTick(function () {
        this.getBankAccountList();
      });
    },

    methods: {
      handleSearch() {
        this.getBankAccountList(1);
      },
      handleReset() {

      },
      handleAdd() {

      },
      handleDelete() {

      },
      handleEdit() {

      },

      getBankAccountList(bool) {
        if (bool) Object.assign(this.curSearchContent, this.searchContent);
        this.loading = true;
        this.$axios.get(`concur/gloConfig/bankAccount/list?${this.$qs.stringify(this.curSearchContent)}`).then(res => {
          this.loading = false;
          if (res && res.success) {
            this.bankAccountTableList = res.result.records;
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
        this.getBankAccountList();
      },

      handleCurrentChange(val) {
        this.curSearchContent.pageNo = val;
        this.getBankAccountList();
      },

    }
  };
</script>

<style lang="scss" scoped>
  .bankAccount {

  }
</style>
