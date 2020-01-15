<template>
  <div class="fee">
    <top-bar>
      <section>
        <label>部门</label>
        <!-- <el-input v-model="searchContent.deptId"></el-input> -->
        <el-select v-model="deptname" placeholder="请选择部门" @focus="eventFocus1"></el-select>
      </section>
      <section>
        <label>申请人</label>
        <el-input v-model="searchContent.mem_name"></el-input>
      </section>
      <section>
        <el-button type="primary" @click="eventSearch" size="mini">{{$t('message.searchBtn')}}</el-button>
        <el-button @click="eventReset" size="mini">{{$t('message.resetBtn')}}</el-button>
      </section>
    </top-bar>
    <table-bar>
      <el-table slot="table" v-loading="loading" border stripe :data="list" style="width: 100%">
        <el-table-column type="index" width="40" align="center"></el-table-column>
        <el-table-column prop="applyId" label="出差申请单号" show-overflow-tooltip min-width="100px;"></el-table-column>
        <el-table-column prop="mem_name" label="申请人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="mem_deptname" label="部门" show-overflow-tooltip></el-table-column>
        <el-table-column prop="b_deptname" label="受益部门" show-overflow-tooltip></el-table-column>
        <el-table-column prop="account" label="原币金额" show-overflow-tooltip></el-table-column>
        <el-table-column prop="laccount" label="本币金额" show-overflow-tooltip></el-table-column>
        <el-table-column prop="s_rname" label="出发地点" show-overflow-tooltip></el-table-column>
        <el-table-column prop="e_rname" label="目的地点" show-overflow-tooltip></el-table-column>
        <el-table-column prop="butxt" label="费用中心" show-overflow-tooltip></el-table-column>
        <el-table-column prop="txt50" label="费用科目" show-overflow-tooltip></el-table-column>
        <el-table-column prop="busreason" label="出差事由" show-overflow-tooltip></el-table-column>
        <el-table-column prop="posid" label="wbs" show-overflow-tooltip></el-table-column>
        <el-table-column prop="rate" label="项目分摊比率" show-overflow-tooltip min-width="100px;">
          <template slot-scope="{row}">
            <span>{{row.rate}}%</span>
          </template>
        </el-table-column>
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
    <el-dialog title="部门组织结构" :visible.sync="dialogVisible1" width="800px">
      <top-bar>
        <section>
          <label>部门名称</label>
          <el-input v-model="searchContent1.deptname" clearable placeholder="请输入部门名称"></el-input>
        </section>
        <section>
          <label>部门负责人</label>
          <el-input v-model="searchContent1.memName" clearable placeholder="请输入部门负责人"></el-input>
        </section>
        <section>
          <el-button type="primary" @click="eventSearch1" size="mini">{{$t('message.searchBtn')}}</el-button>
          <el-button @click="eventReset1" size="mini">{{$t('message.resetBtn')}}</el-button>
        </section>
      </top-bar>
      <el-table
        class="filter-tree"
        :data="list1"
        ref="table1"
        row-key="id"
        border
        stripe
        :tree-props="{children: 'children'}"
        @selection-change="handleSelectionChange1"
      >
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column prop="deptname" label="部门名称" min-width="200px" show-overflow-tooltip></el-table-column>
        <el-table-column prop="deptLv" label="部门层级" show-overflow-tooltip></el-table-column>
        <el-table-column prop="isend" label="是否末级部门" show-overflow-tooltip min-width="100px">
          <template slot-scope="{row}">
            <span v-if="row.isend==='1'">是</span>
            <span v-if="row.isend==='0'">否</span>
          </template>
        </el-table-column>
        <el-table-column prop="butxt" label="公司名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="bukrs" label="公司代码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="kostl" label="成本中心" show-overflow-tooltip></el-table-column>
        <el-table-column prop="memName" label="部门负责人" show-overflow-tooltip></el-table-column>
      </el-table>
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
        <el-button @click="dialogVisible1 = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="selectSure1" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "fee",
  data() {
    return {
      deptname: "",
      loading: false,
      list: [],
      searchContent: {
        mem_deptname: "",
        mem_name: ""
      },
      curSearchContent: {
        pageNo: 1, // 当前页
        pageSize: 20 // 每页显示数量
      },
      total: 0, // 总条数

      dialogVisible1: false,
      list1: [],
      searchContent1: {
        deptname: "",
        memName: ""
      },
      curSearchContent1: {
        pageNo: 1, // （当前页）
        pageSize: 10 // 每页显示数量
      },
      total1: 0, // 总条数
      selected1: []
    };
  },
  mounted() {
    this.$nextTick(function() {
      this.getList();
    });
  },
  methods: {
    handleSelectionChange1(val) {
      this.selected1 = val;
      if (val.length > 1) {
        this.$refs.table1.toggleRowSelection(val[0]);
      }
    },
    selectSure1() {
      this.dialogVisible1 = false;
      this.deptname = this.selected1[0].deptname;
      this.searchContent.mem_deptname = this.selected1[0].id;
    },
    eventSearch1() {
      this.curSearchContent1.pageNo = 1;
      this.eventFocus1();
    },
    eventReset1() {
      this.curSearchContent1.pageNo = 1;
      this.searchContent1 = {
        deptname: "",
        memName: ""
      };
      this.eventFocus1();
    },
    handleSizeChange1(val) {
      this.curSearchContent1.pageSize = val;
      this.eventFocus1();
    },
    handleCurrentChange1(val) {
      this.curSearchContent1.pageNo = val;
      this.eventFocus1();
    },
    eventFocus1() {
      this.dialogVisible1 = true;
      Object.assign(this.curSearchContent1, this.searchContent1);
      this.$axios
        .get(
          `/concur/hrinfo/department/treelist?${this.$qs.stringify(
            this.curSearchContent1
          )}`
        )
        .then(res => {
          if (res && res.success) {
            this.list1 = res.result;
            this.total1 = res.total;
          }
        });
    },
    eventSearch() {
      this.getList(1);
    },
    eventReset() {
      this.deptname = "";
      this.searchContent = {
        mem_deptname: "",
        mem_name: ""
      };
      this.getList(1);
    },
    getList(bool) {
      if (bool) Object.assign(this.curSearchContent, this.searchContent);
      this.loading = true;
      this.$axios
        .get(
          `/concur/report/reimbursement/list?${this.$qs.stringify(
            this.curSearchContent
          )}`
        )
        .then(res => {
          this.loading = false;
          if (res && res.success) {
            this.list = res.result.records;
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
    }
  }
};
</script>

<style lang="scss" scoped>
.fee {
}
</style>