<template>
  <div class="contCenter">

    <!--搜索栏位-->

    <top-bar>
      <section>
        <label>成本中心</label>
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
        <el-button type="primary" @click="$router.push('/costCenterAdd')" size="mini">{{$t('message.addBtn')}}</el-button>
      </div>
      <el-table slot="table"
                v-loading="loading"
                @selection-change="handleSelectionChange"
                border
                stripe
                :data="costCenterTableList"
                style="width: 100%">
        <el-table-column align="center"
                         fixed="left"
                         :label="$t('message.operate')"
                         width="120">
          <template slot-scope="{row}">
            <el-button type="text"
                       @click="$router.push({path:'/costCenterEdit',query:{row:row}})"
                       size="mini">
              {{$t('message.editBtn')}}
            </el-button>
            <el-button type="text" size="mini" @click="handleDelete(row)">
              {{$t('message.deleteBtn')}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="kokrs" label="控制范围" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="kostl"
                         label="成本中心" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="datbi"
                         label="截止日期" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="datab"
                         label="开始日期" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="ktext"
                         label="名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="ltext"
                         label="描述" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="comId"
                         label="公司代码" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="kosar"
                         label="成本中心类型" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="gsber"
                         label="业务范围" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="khinr"
                         label="层次结构范围" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="waers"
                         label="货币码" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="prctr"
                         label="利润中心" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="butxt"
                         label="公司名称" show-overflow-tooltip>
        </el-table-column>

      </el-table>
      <el-pagination slot="page"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="curSearchContent.pageNum"
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
    name: "costCenter",
    data() {
      return {
        loading: false,
        costCenterTableList: [{}],
        searchContent: {
          costSenter: '',
          pageNo:'',
          pageSize:''
        },
        curSearchContent: {
          pageNum: 1, // 当前页
          pageSize: 20, // 每页显示数量
        },
        total: 0, // 总条数
      };
    },
    created() {
      this.getCostCenterList()
    },

    mounted() {
      this.$nextTick(function () {
        this.getCostCenterList();
      });
    },

    methods: {
      handleSearch() {
        this.getCostCenterList(1);
      },
      handleReset() {

      },
      handleAdd() {

      },
      handleDelete() {

      },
      handleEdit() {

      },

      getCostCenterList(bool) {
        if (bool) Object.assign(this.curSearchContent, this.searchContent);
        this.loading = true;
        this.$axios.get(`concur/gloConfig/costSenter/list?${this.$qs.stringify(this.curSearchContent)}`).then(res => {
          this.loading = false;
          if (res && res.success) {
            this.costCenterTableList = res.result.records;
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
        this.getCostCenterList();
      },

      handleCurrentChange(val) {
        this.curSearchContent.pageNum = val;
        this.getCostCenterList();
      },

    }
  };
</script>

<style lang="scss" scoped>
  .comCode {

  }
</style>
