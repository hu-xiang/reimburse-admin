<template>
  <div class="budgetApply">
    <top-bar>
      <section>
        <label>管控方式</label>
        <el-select v-model="searchContent.contype" clearable>
          <el-option label="月度" :value="1"></el-option>
          <el-option label="季度" :value="2"></el-option>
          <el-option label="年度" :value="3"></el-option>
        </el-select>
      </section>
      <!-- <section>
        <label>审批状态</label>
        <el-select v-model="searchContent.auditStatus" clearable>
          <el-option label="审批通过" value="1"></el-option>
          <el-option label="审批未通过" value="2"></el-option>
          <el-option label="待审批" value="0"></el-option>
        </el-select>
      </section>-->
      <!-- <section>
        <label>预算类型</label>
        <el-input v-model="budTypeName" @focus="eventFocus1"></el-input>
      </section>-->
      <section>
        <el-button type="primary" @click="eventSearch" size="mini">{{$t('message.searchBtn')}}</el-button>
        <el-button @click="eventReset" size="mini">{{$t('message.resetBtn')}}</el-button>
      </section>
    </top-bar>
    <el-table
      ref="table"
      slot="table"
      v-loading="loading"
      border
      stripe
      :data="tableList"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="index" width="40" align="center" fixed="left"></el-table-column>
      <el-table-column prop="auditStatus" label="审批状态" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span v-if="row.auditStatus==='1'" style="color:#67C23A">审批通过</span>
          <span v-if="row.auditStatus==='2'" style="color:red">审批未通过</span>
          <span v-if="row.auditStatus==='0'">待审批</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="是否下达" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span v-if="row.status==='1'">是</span>
          <span v-if="row.status==='0'">否</span>
        </template>
      </el-table-column>
      <el-table-column prop="applyId" label="预算申请单号" show-overflow-tooltip min-width="100px"></el-table-column>
      <el-table-column prop="deptName" label="部门名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="mainName" label="预算大类" show-overflow-tooltip></el-table-column>
      <el-table-column prop="budName" label="预算类型" show-overflow-tooltip></el-table-column>
      <el-table-column prop="contype" label="管控方式" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span v-if="row.contype==='1'">月度</span>
          <span v-if="row.contype==='2'">季度</span>
          <span v-if="row.contype==='3'">年度</span>
        </template>
      </el-table-column>
      <el-table-column prop="startDate" label="预算开始时间" show-overflow-tooltip min-width="100px"></el-table-column>
      <el-table-column prop="endDate" label="预算结束时间" show-overflow-tooltip min-width="100px"></el-table-column>
      <el-table-column prop="waers" label="货币码" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ktext" label="货币名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="exrate" label="汇率" show-overflow-tooltip></el-table-column>
      <el-table-column prop="amount" label="预算总金额" show-overflow-tooltip></el-table-column>
      <el-table-column prop="lamount" label="本币总金额" show-overflow-tooltip></el-table-column>
      <el-table-column prop="isshare" label="是否分摊下级部门" show-overflow-tooltip min-width="120px">
        <template slot-scope="{row}">
          <span v-if="row.isshare==='1'">是</span>
          <span v-if="row.isshare==='0'">否</span>
        </template>
      </el-table-column>

      <el-table-column prop="createName" label="申请人" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createDate" label="创建日期" show-overflow-tooltip></el-table-column>
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
    <!-- 预算类型树形弹框 -->
    <el-dialog title="预算类型" :visible.sync="dialogVisible1" width="500px">
      <el-input
        v-model="budName"
        clearable
        placeholder="请输入关键字进行过滤"
        style="width:300px;margin-right:10px;"
      ></el-input>
      <el-button type="primary" @click="eventSearchType" size="mini">{{$t('message.searchBtn')}}</el-button>
      <el-button @click="eventResetType" size="mini">{{$t('message.resetBtn')}}</el-button>
      <el-tree
        class="filter-tree"
        :default-expand-all="true"
        :data="list1"
        show-checkbox
        :props="listProps1"
        :filter-node-method="filterNode1"
        :check-strictly="true"
        ref="budTypeTree"
        node-key="id"
        @check="checkType"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="selectSure1" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "budgetApply",
  data() {
    return {
      loading: false,
      tableList: [],
      searchContent: {
        contype: "",
        //auditStatus: ""
        // budtypeId: "",
      },
      budTypeName: "",
      curSearchContent: {
        pageNo: 1, // （当前页）
        pageSize: 20 // 每页显示数量
      },
      total: 0, // 总条数
      budName: "",
      dialogVisible1: false,
      list1: [],
      listProps1: {
        children: "children",
        label: "budName"
      },
      multipleSelection: []
    };
  },
  mounted() {
    this.$nextTick(function() {
      this.getList(1);
    });
  },
  methods: {
    checkType(value, data) {
      if (data.checkedNodes.length > 1) {
        this.$messageAlert.warning("一次只能选择一个预算类型查询");
        this.$refs.budTypeTree.setChecked(value, false);
      }
    },
    filterNode1(value, data) {
      if (!value) return true;
      return data.budName.indexOf(value) > -1;
    },
    eventSearchType() {
      this.$refs.budTypeTree.filter(this.budName);
    },
    eventResetType() {
      this.budName = "";
      this.$refs.budTypeTree.filter(this.budName);
    },
    eventFocus1() {
      this.dialogVisible1 = true;
      this.$axios.get("/concur/budget/budgetType/treelist").then(res => {
        if (res && res.success) {
          this.list1 = res.result;
        }
      });
    },
    selectSure1() {
      const list = this.$refs.budTypeTree.getCheckedNodes();
      if (list.length > 0) {
        this.searchContent.budtypeId = list[0].id;
        this.budTypeName = list[0].budName;
      }
      this.dialogVisible1 = false;
    },
    eventSearch() {
      this.getList(1);
    },
    eventReset() {
      this.budTypeName = "";
      this.searchContent = {
        contype: "",
        //auditStatus: "",
        //budtypeId: "",
      };
      this.getList(1);
    },
    getList(bool) {
      if (bool) Object.assign(this.curSearchContent, this.searchContent);
      this.loading = true;
      this.$axios
        .get(
          `/concur/worktab/myApplication/list?${this.$qs.stringify(
            this.curSearchContent
          )}`
        )
        .then(res => {
          this.loading = false;
          if (res && res.success) {
            this.tableList = res.result.records;
            this.total = res.result.total;
          }
        });
      Object.assign(this.searchContent, this.curSearchContent);
    },
    handleSizeChange(val) {
      this.curSearchContent.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.curSearchContent.pageNo = val;
      this.getList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
};
</script>

<style lang="scss" scoped>
.budgetApply {
  .el-tree {
    margin-top: 20px;
  }
}
</style>