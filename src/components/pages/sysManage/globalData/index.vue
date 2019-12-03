<template>
  <div class="globalData">

    <!--搜索栏位-->

    <top-bar>
      <section>
        <label>系统名称</label>
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
        <el-button type="primary" @click="$router.push('/globalDataAdd')" size="mini">{{$t('message.addBtn')}}</el-button>
      </div>
      <el-table slot="table"
                v-loading="loading"
                @selection-change="handleSelectionChange"
                border
                stripe
                :data="globalDataTableList"
                style="width: 100%">
        <el-table-column align="center"
                         fixed="left"
                         :label="$t('message.operate')"
                         width="120">
          <template slot-scope="{row}">
            <el-button type="text"
                       @click="$router.push({path:'/globalDataEdit',query:{row:row}})"
                       size="mini">
              {{$t('message.editBtn')}}
            </el-button>
            <el-button type="text" size="mini" @click="handleDelete(row)">
              {{$t('message.deleteBtn')}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="sysName"
                         label="系统名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="logo"
                         label="logo" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="isShow"
                         label="申请单显示预算费用" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="isUse"
                         label="是否启用预算审批" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="isRel"
                         label="报销是否关联申请单" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="createId"
                         label="创建人" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="createDate"
                         label="创建时间" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="updateId"
                         label="操作人" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="updateDate"
                         label="操作时间" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="curId"
                         label="集团币别" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="ktext"
                         label="货币名称" show-overflow-tooltip>
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
    name: "globalData",
    data() {
      return {
        loading: false,
        globalDataTableList: [{}],
        searchContent: {
          gloConfig: '',
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
      this.getGlobalDataList()
    },

    mounted() {
      this.$nextTick(function () {
        this.getGlobalDataList();
      });
    },

    methods: {
      handleSearch() {
        this.getGlobalDataList(1);
      },
      handleReset() {

      },
      handleAdd() {

      },
      handleDelete() {

      },
      handleEdit() {

      },

      getGlobalDataList(bool) {
        if (bool) Object.assign(this.curSearchContent, this.searchContent);
        this.loading = true;
        this.$axios.get(`concur/gloConfig/gloConfig/list?${this.$qs.stringify(this.curSearchContent)}`).then(res => {
          this.loading = false;
          if (res && res.success) {
            this.globalDataTableList = res.result.records;
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
        this.getGlobalDataList();
      },

      handleCurrentChange(val) {
        this.curSearchContent.pageNum = val;
        this.getGlobalDataList();
      },

    }
  };
</script>

<style lang="scss" scoped>
  .comCode {

  }
</style>
