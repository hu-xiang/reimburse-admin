<template>
  <div class="userInfo">
    <top-bar>
      <section>
        <label>工号</label>
        <el-input v-model="searchContent.memJobno"></el-input>
      </section>
      <section>
        <label>姓名</label>
        <el-input v-model="searchContent.memName"></el-input>
      </section>
      <section>
        <label>部门</label>
        <el-select v-model="deptName" placeholder="请选择部门" @focus="eventFocus"></el-select>
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
          @click="$router.push('/userAdd')"
          size="mini"
          v-if="$auths('/userAdd')"
        >{{$t('message.addBtn')}}</el-button>
      </div>
      <el-table
        slot="table"
        v-loading="loading"
        border
        stripe
        :data="tableList"
        style="width: 100%"
      >
        <el-table-column
          align="center"
          fixed="left"
          :label="$t('message.operate')"
          width="120"
          v-if="$auths('/userEdit') || $auths('/userDelete')"
        >
          <template slot-scope="{row}">
            <el-button
              type="text"
              @click="$router.push({path:'/userEdit',query:{row:row}})"
              size="mini"
              v-if="$auths('/userEdit')"
            >{{$t('message.editBtn')}}</el-button>
            <el-button
              type="text"
              size="mini"
              @click="eventDel(row)"
              v-if="$auths('/userDelete')"
            >{{$t('message.deleteBtn')}}</el-button>
          </template>
        </el-table-column>
        <el-table-column type="index" width="40" align="center"></el-table-column>
        <el-table-column prop="memName" label="姓名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="memJobno" label="工号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="memSex" label="性别" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span v-if="row.memSex===0">男</span>
            <span v-if="row.memSex===1">女</span>
          </template>
        </el-table-column>
        <el-table-column prop="islead" label="是否有上级" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span v-if="row.islead==='1'">是</span>
            <span v-if="row.islead==='0'">否</span>
          </template>
        </el-table-column>
        <el-table-column prop="memIdcard" label="身份证号码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="memBirthday" label="出生日期" show-overflow-tooltip></el-table-column>
        <el-table-column prop="memJoinDate" label="入职日期" show-overflow-tooltip></el-table-column>
        <el-table-column prop="memLeaveDate" label="离职日期" show-overflow-tooltip></el-table-column>
        <el-table-column prop="memEmail" label="邮箱" show-overflow-tooltip></el-table-column>
        <el-table-column prop="memPhone" label="手机号码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="deptname" label="部门名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="rankname" label="职级名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="postdesc" label="岗位描述" show-overflow-tooltip></el-table-column>
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
  </div>
</template>

<script>
export default {
  name: "userInfo",
  data() {
    return {
      loading: false,
      tableList: [],
      searchContent: {
        memJobno: "",
        memName: "",
        depId: "",
      },
      curSearchContent: {
        pageNo: 1, // （当前页）
        pageSize: 20 // 每页显示数量
      },
      total: 0, // 总条数
      deptName: '',
      dialogVisible: false,
      deptname: '',
      list: [],
      listProps: {
        children: "children",
        label: "deptname"
      },
      curSearchContent1: {
        pageNo: 1, // （当前页）
        pageSize: 10 // 每页显示数量
      },
      total1: 0, // 总条数
    };
  },
  mounted() {
    this.$nextTick(function() {
      this.getList(1);
    });
  },
  methods: {
    eventSearch() {
      this.getList(1);
    },
    eventReset() {
      this.deptName = "";
      this.searchContent = {
        memJobno: "",
        memName: "",
        depId: "",
      };
      this.getList(1);
    },
    eventDel(row) {
      this.$confirm("确定要删除该人员吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .delete(
              `/concur/hrinfo/member/delete?${this.$qs.stringify(
                {id: row.id}
              )}`
            )
            .then(res => {
              if (res && res.success) {
                this.$messageAlert.success(res.message);
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
          `/concur/hrinfo/member/list?${this.$qs.stringify(
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
    eventSearchDep() {
      this.$refs.depTree.filter(this.deptname);
    },
    eventResetDep() {
      this.deptname = "";
      this.$refs.depTree.filter(this.deptname);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.deptname.indexOf(value) > -1;
    },
    checkDept(value, data) {
      if (data.checkedNodes.length > 1) {
        this.$messageAlert.warning("一次只能选择一个部门查询");
        this.$refs.depTree.setChecked(value, false);
      }
    },
    selectSure() {
      const list = this.$refs.depTree.getCheckedNodes();
      if (list.length > 0) {
        this.searchContent.depId = list[0].id;
        this.deptName = list[0].deptname;
      }
      this.dialogVisible = false;
    },
    handleSizeChange1(val) {
      this.curSearchContent1.pageSize = val;
      this.eventFocus();
    },
    handleCurrentChange1(val) {
      this.curSearchContent1.pageNo = val;
      this.eventFocus();
    },
  }
};
</script>

<style lang="scss" scoped>
.userInfo {
  .el-tree {
    margin-top: 20px;
  }
}
</style>