<template>
  <div class="budgetEntry">
    <top-bar>
      <section>
        <label>管控方式</label>
        <el-select v-model="searchContent.contype" clearable>
          <el-option label="月度" :value="1"></el-option>
          <el-option label="季度" :value="2"></el-option>
          <el-option label="年度" :value="3"></el-option>
        </el-select>
      </section>
      <section>
        <label>审批状态</label>
        <el-select v-model="searchContent.auditStatus" clearable>
          <el-option label="审批通过" :value="1"></el-option>
          <el-option label="审批未通过" :value="2"></el-option>
          <el-option label="待审批" :value="0"></el-option>
        </el-select>
      </section>
      <section>
        <label>部门</label>
        <el-input v-model="deptName" @focus="eventFocus"></el-input>
        <!-- <depart v-model="searchContent.deptId"></depart> -->
      </section>
      <section>
        <label>预算类型</label>
        <el-input v-model="budTypeName" @focus="eventFocus1"></el-input>
      </section>
      <section>
        <label>申请人</label>
        <el-input v-model="searchContent.createName"></el-input>
      </section>
      <section>
        <el-button type="primary" @click="eventSearch" size="mini">{{$t('message.searchBtn')}}</el-button>
        <el-button @click="eventReset" size="mini">{{$t('message.resetBtn')}}</el-button>
      </section>
    </top-bar>
    <table-bar>
      <div slot="top">
        <el-button
          type="primary"
          @click="$router.push('/budAppAdd')"
          size="mini"
        >{{$t('message.addBtn')}}</el-button>
        <el-button type="success" size="mini" @click="eventApproval">审批</el-button>
      </div>
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
        <el-table-column align="center" fixed="left" :label="$t('message.operate')" width="120">
          <template slot-scope="{row}">
            <el-button
              type="text"
              @click="$router.push({path:'/budAppEdit',query:{row:row}})"
              size="mini"
            >{{$t('message.editBtn')}}</el-button>
            <el-button type="text" size="mini" @click="eventDel(row)">{{$t('message.deleteBtn')}}</el-button>
          </template>
        </el-table-column>
        <el-table-column type="selection" width="40" align="center" fixed="left" :selectable="checkSelectable"></el-table-column>
        <el-table-column prop="auditStatus" label="审批状态" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span v-if="row.auditStatus==='1'" style="color:#67C23A">审批通过</span>
            <span v-if="row.auditStatus==='2'" style="color:red">审批未通过</span>
            <span v-if="row.auditStatus==='0'">待审批</span>
          </template>
        </el-table-column>
        <el-table-column prop="applyId" label="预算申请单号" show-overflow-tooltip min-width="100px"></el-table-column>
        <el-table-column prop="deptName" label="部门名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="mainType" label="预算大类" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span v-if="row.mainType===1">费用类</span>
          </template>
        </el-table-column>
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
        <el-table-column prop="status" label="是否下达" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span v-if="row.status==='1'">是</span>
            <span v-if="row.status==='0'">否</span>
          </template>
        </el-table-column>
        <el-table-column prop="budVersion" label="预算版本" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createName" label="创建人" show-overflow-tooltip></el-table-column>
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
    </table-bar>
    <!-- 部门树形弹框 -->
    <el-dialog title="部门组织结构" :visible.sync="dialogVisible" width="500px">
      <el-input
        v-model="deptname"
        clearable
        placeholder="请输入关键字进行过滤"
        style="width:300px;margin-right:10px;"
      ></el-input>
      <el-button type="primary" @click="eventSearchDep" size="mini">{{$t('message.searchBtn')}}</el-button>
      <el-button @click="eventResetDep" size="mini">{{$t('message.resetBtn')}}</el-button>
      <el-tree
        class="filter-tree"
        :data="list"
        show-checkbox
        :props="listProps"
        :filter-node-method="filterNode"
        :check-strictly="true"
        ref="depTree"
        node-key="id"
        @check="checkDept"
      ></el-tree>
      <el-pagination
        style="margin-top:10px;"
        small
        @size-change="handleSizeChange1"
        @current-change="handleCurrentChange1"
        :current-page="curSearchContent1.pageNo"
        :page-sizes="[10, 20, 50]"
        :page-size="curSearchContent1.pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total1"
      ></el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="selectSure" size="mini">确 定</el-button>
      </span>
    </el-dialog>
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
    <el-dialog title="审批" :visible.sync="dialogVisible3" width="500px">
      <el-form :model="form" ref="form" :rules="rules" label-width="120px">
        <el-form-item label="审批状态" prop="auditStatus">
          <el-select v-model="form.auditStatus" clearable style="width:300px;">
            <el-option label="审批通过" value="1"></el-option>
            <el-option label="审批未通过" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible3 = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="eventSure" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { log } from 'util';
export default {
  name: "budgetEntry",
  data() {
    return {
      loading: false,
      tableList: [],
      searchContent: {
        contype: "",
        auditStatus: "",
        deptId: "",
        budtypeId: "",
        createName: ""
      },
      deptName: "",
      budTypeName: "",
      curSearchContent: {
        pageNo: 1, // （当前页）
        pageSize: 20 // 每页显示数量
      },
      total: 0, // 总条数
      dialogVisible: false,
      list: [],
      listProps: {
        children: "children",
        label: "deptname"
      },
      deptname: "",
      budName: "",
      dialogVisible1: false,
      list1: [],
      listProps1: {
        children: "children",
        label: "budName"
      },
      curSearchContent1: {
        pageNo: 1, // （当前页）
        pageSize: 10 // 每页显示数量
      },
      total1: 0, // 总条数
      multipleSelection: [],
      dialogVisible3: false,
      form: {
        auditStatus: ""
      },
      rules: {
        auditStatus: [
          { required: true, message: "请选择审批状态", trigger: "change" }
        ]
      }
    };
  },
  mounted() {
    this.$nextTick(function() {
      this.getList(1);
    });
  },
  methods: {
    checkDept(value, data) {
      if (data.checkedNodes.length > 1) {
        this.$message.warning("一次只能选择一个部门查询");
        this.$refs.depTree.setChecked(value, false);
      }
    },
    checkType(value, data) {
      if (data.checkedNodes.length > 1) {
        this.$message.warning("一次只能选择一个预算类型查询");
        this.$refs.budTypeTree.setChecked(value, false);
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.deptname.indexOf(value) > -1;
    },
    filterNode1(value, data) {
      if (!value) return true;
      return data.budName.indexOf(value) > -1;
    },
    eventSearchDep() {
      this.$refs.depTree.filter(this.deptname);
    },
    eventResetDep() {
      this.deptname = "";
      this.$refs.depTree.filter(this.deptname);
    },
    eventSearchType() {
      this.$refs.budTypeTree.filter(this.budName);
    },
    eventResetType() {
      this.budName = "";
      this.$refs.budTypeTree.filter(this.budName);
    },
    eventFocus() {
      this.dialogVisible = true;
      this.$axios
        .get(
          `/concur/hrinfo/department/treelist?${this.$qs.stringify(
            this.curSearchContent1
          )}`
        )
        .then(res => {
          if (res && res.success) {
            this.list = res.result;
            this.total1 = res.total;
          }
        });
    },
    selectSure() {
      const list = this.$refs.depTree.getCheckedNodes();
      if (list.length > 0) {
        this.searchContent.deptId = list[0].id;
        this.deptName = list[0].deptname;
      }
      this.dialogVisible = false;
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
      this.deptName = "";
      this.budTypeName = "";
      this.searchContent = {
        contype: "",
        auditStatus: "",
        deptId: "",
        budtypeId: "",
        createName: ""
      };
      this.getList(1);
    },
    eventDel(row) {
      this.$confirm("确定要删除该预算申请吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .delete(
              `/concur/budget/budgetApply/delete?${this.$qs.stringify({
                id: row.applyId
              })}`
            )
            .then(res => {
              if (res && res.success) {
                this.$message.success(res.message);
                this.getList(1);
              }
            });
        })
        .catch(() => {});
    },
    getList(bool) {
      if (bool) Object.assign(this.curSearchContent, this.searchContent);
      this.loading = true;
      this.$axios
        .get(
          `/concur/budget/budgetApply/list?${this.$qs.stringify(
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
      this.getList(1);
    },
    handleCurrentChange(val) {
      this.curSearchContent.pageNo = val;
      this.getList(1);
    },
    handleSizeChange1(val) {
      this.curSearchContent1.pageSize = val;
      this.eventFocus();
    },
    handleCurrentChange1(val) {
      this.curSearchContent1.pageNo = val;
      this.eventFocus();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    checkSelectable(row) {
      return (row.auditStatus!=='2'&&row.auditStatus!=='1')
    },
    eventApproval() {
      if (!this.multipleSelection.length > 0) {
        this.$message.warning("请选择您需要审批的预算申请");
        return;
      }
      this.dialogVisible3 = true;
    },
    eventSure() {
      const list = [];
      this.$refs.form.validate(valid => {
        if (valid) {
          this.multipleSelection.forEach((item) =>{
            list.push(item.applyId)
          })
          const submitForm = {
            list: list,
            auditStatus: this.form.auditStatus
          }
          this.$axios
            .put("/concur/budget/budgetApply/auditList", this.$qs.stringify(submitForm,{arrayFormat: 'repeat'}))
            .then(res => {
              if (res && res.success) {
                this.$message.success(res.message);
                this.dialogVisible3 = false;
                this.getList(1);
              }
            });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.budgetEntry {
  .el-tree {
    margin-top: 20px;
  }
}
</style>