<template>
  <div class="zone">

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
        <el-button type="primary" @click="$router.push('/zoneAdd')" size="mini">{{$t('message.addBtn')}}</el-button>
      </div>
      <el-table slot="table"
                v-loading="loading"
                @selection-change="handleSelectionChange"
                border
                stripe
                :data="zoneTableList"
                style="width: 100%">
        <el-table-column align="center"
                         fixed="left"
                         :label="$t('message.operate')"
                         width="120">
          <template slot-scope="{row}">
            <el-button type="text"
                       @click="$router.push({path:'/zoneEdit',query:{row:row}})"
                       size="mini">
              {{$t('message.editBtn')}}
            </el-button>
            <el-button type="text" size="mini" @click="handleDelete(row)">
              {{$t('message.deleteBtn')}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="rnumber"
                         label="地区编号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="rname"
                         label="地区名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="rtype"
                         label="地区类型" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="parentId"
                         label="上层编号" show-overflow-tooltip>
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
        <el-table-column prop="isOut"
                         label="是否海外" show-overflow-tooltip>
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
    name: "zone",
    data() {
      return {
        loading: false,
        zoneTableList: [{}],
        searchContent: {
          gloConfig: '',
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
      this.getZoneList()
    },

    mounted() {
      this.$nextTick(function () {
        this.getZoneList();
      });
    },

    methods: {
      handleSearch() {
        this.getZoneList(1);
      },
      handleReset() {

      },
      handleAdd() {

      },
      handleDelete() {

      },
      handleEdit() {

      },

      getZoneList(bool) {
        if (bool) Object.assign(this.curSearchContent, this.searchContent);
        this.loading = true;
        this.$axios.get(`concur/gloConfig/region/list?${this.$qs.stringify(this.curSearchContent)}`).then(res => {
          this.loading = false;
          if (res && res.success) {
            this.zoneTableList = res.result.records;
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
        this.getZoneList();
      },

      handleCurrentChange(val) {
        this.curSearchContent.pageNo = val;
        this.getZoneList();
      },

    }
  };
</script>

<style lang="scss" scoped>
  .zone {

  }
</style>
