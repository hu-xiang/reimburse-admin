<template>
  <div class="accountSubject">

    <!--搜索栏位-->

    <top-bar>
      <section>
        <label>科目编号</label>
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
        <el-button type="primary" @click="$router.push('/accountSubjectAdd')" size="mini">{{$t('message.addBtn')}}</el-button>
      </div>
      <el-table slot="table"
                v-loading="loading"
                @selection-change="handleSelectionChange"
                border
                stripe
                :data="accountSubjectTableList"
                style="width: 100%">
        <el-table-column align="center"
                         fixed="left"
                         :label="$t('message.operate')"
                         width="120">
          <template slot-scope="{row}">
            <el-button type="text"
                       @click="$router.push({path:'/accountSubjectEdit',query:{row:row}})"
                       size="mini">
              {{$t('message.editBtn')}}
            </el-button>
            <el-button type="text" size="mini" @click="handleDelete(row)">
              {{$t('message.deleteBtn')}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="ktopl" label="帐目表" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="saknr"
                         label="科目编码" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="txt50"
                         label="总帐科目名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="xbilk"
                         label="资产负债表科目" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="bilkt"
                         label="组科目号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="gvtyp"
                         label="损益表科目" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="ktoks"
                         label="组科目号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="xloev"
                         label="删除标记" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="xspeb"
                         label="冻结标记" show-overflow-tooltip>
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
    name: "accountSubject",
    data() {
      return {
        loading: false,
        accountSubjectTableList: [{}],
        searchContent: {
          accountSubject: '',
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
      this.getAccountSubjectList()
    },

    mounted() {
      this.$nextTick(function () {
        this.getAccountSubjectList();
      });
    },

    methods: {
      handleSearch() {
        this.getAccountSubjectList(1);
      },
      handleReset() {

      },
      handleAdd() {

      },
      handleDelete() {

      },
      handleEdit() {

      },

      getAccountSubjectList(bool) {
        if (bool) Object.assign(this.curSearchContent, this.searchContent);
        this.loading = true;
        this.$axios.get(`concur/gloConfig/accountSubject/list?${this.$qs.stringify(this.curSearchContent)}`).then(res => {
          this.loading = false;
          if (res && res.success) {
            this.accountSubjectTableList = res.result.records;
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
        this.getAccountSubjectList();
      },

      handleCurrentChange(val) {
        this.curSearchContent.pageNo = val;
        this.getAccountSubjectList();
      },

    }
  };
</script>

<style lang="scss" scoped>
  .comCode {

  }
</style>
