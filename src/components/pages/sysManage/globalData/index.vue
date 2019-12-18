<template>
  <div class="globalData">
    <!--搜索栏位-->

    <top-bar>
      <section>
        <label>系统名称</label>
        <el-input v-model="searchContent.sysName"></el-input>
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
        :data="globalDataTableList"
        style="width: 100%"
      >
        <el-table-column align="center" fixed="left" :label="$t('message.operate')">
          <template slot-scope="{row}">
            <el-button @click="eventEdit(row)" type="text" size="mini">
              <span v-if="!row.disabled">保存</span>
              <span v-else>{{$t('message.editBtn')}}</span>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="sysName" label="系统名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="logo" label="logo" show-overflow-tooltip></el-table-column>
        <el-table-column prop="isShow" label="申请单显示预算费用" show-overflow-tooltip min-width="120px">
          <template slot-scope="{row}">
            <el-select v-model="row.isShow" :disabled="row.disabled">
              <el-option label="显示" value="1"></el-option>
              <el-option label="不显示" value="0"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="isUse" label="是否启用预算审批" show-overflow-tooltip min-width="120px">
          <template slot-scope="{row}">
            <el-select v-model="row.isUse" :disabled="row.disabled">
              <el-option label="启用" value="1"></el-option>
              <el-option label="不启用" value="0"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="isRel" label="报销是否关联申请单" show-overflow-tooltip min-width="120px">
          <template slot-scope="{row}">
            <el-select v-model="row.isRel" :disabled="row.disabled">
              <el-option label="关联" value="1"></el-option>
              <el-option label="不关联" value="0"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="createId" label="创建人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createDate" label="创建时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="updateId" label="操作人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="updateDate" label="操作时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="curId" label="集团币别" show-overflow-tooltip></el-table-column>
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
  name: "globalData",
  data() {
    return {
      loading: false,
      globalDataTableList: [{}],
      searchContent: {
        sysName: ""
      },
      curSearchContent: {
        pageNo: 1, // 当前页
        pageSize: 20 // 每页显示数量
      },
      total: 0, // 总条数
      isEditOrSave: true
    };
  },
  created() {
    this.getGlobalDataList();
  },

  mounted() {
    this.$nextTick(function() {
      this.getGlobalDataList(1);
    });
  },

  methods: {
    handleSearch() {
      this.getGlobalDataList(1);
    },
    handleReset() {
      this.searchContent = {
        sysName: ""
      };
      this.getGlobalDataList(1);
    },
    eventEdit(row) {
      if (row.disabled) {
        this.$set(row, "disabled", !row.disabled);
        return;
      }
      const obj = {
        sysId: row.sysId,
        isShow: row.isShow,
        isRel: row.isRel,
        isUse: row.isUse
      };
      this.$axios.put("/concur/gloConfig/gloConfig/edit", obj).then(res => {
        if (res && res.success) {
          this.$message.success(res.message);
          this.$set(row, "disabled", !row.disabled);
        }
        this.getGlobalDataList(1);
      });
      console.log(row);
    },
    getGlobalDataList(bool) {
      if (bool) Object.assign(this.curSearchContent, this.searchContent);
      this.loading = true;
      this.$axios
        .get(
          `concur/gloConfig/gloConfig/list?${this.$qs.stringify(
            this.curSearchContent
          )}`
        )
        .then(res => {
          this.loading = false;

          if (res && res.success) {
            this.globalDataTableList = res.result.records;
            if (this.globalDataTableList.length > 0) {
              this.globalDataTableList.forEach(item => {
                this.$set(item, "disabled", true);
              });
            }

            this.total = res.result.total;
            for(let i=0;i<this.globalDataTableList.length;i++){
              this.radio=this.globalDataTableList[i].isShow
            }
          }
        });
      Object.assign(this.searchContent, this.curSearchContent);
    },
    handleSizeChange(val) {
      this.curSearchContent.pageSize = val;
      this.getGlobalDataList();
    },
    handleCurrentChange(val) {
      this.curSearchContent.pageNo = val;
      this.getGlobalDataList();
    }
  }
};
</script>

<style lang="scss" scoped>
.comCode {
}
</style>
