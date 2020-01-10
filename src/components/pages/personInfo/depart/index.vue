<template>
  <div class="depart">
    <top-bar>
      <section>
        <label>部门名称</label>
        <el-input v-model="searchContent.deptname" clearable placeholder="请输入部门名称"></el-input>
      </section>
      <section>
        <label>部门负责人</label>
        <el-input v-model="searchContent.memName" clearable placeholder="请输入部门负责人"></el-input>
      </section>
      <section>
        <el-button type="primary" @click="eventSearch" size="mini">{{$t('message.searchBtn')}}</el-button>
        <el-button @click="eventReset" size="mini">{{$t('message.resetBtn')}}</el-button>
      </section>
    </top-bar>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>部门组织架构</span>
      </div>
      <div class="text item">
        <el-table
          class="filter-tree"
          :data="list"
          row-key="id"
          border
          stripe
          :tree-props="{children: 'children'}"
        >
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
          <el-table-column prop="updateName" label="操作人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="updateDate" label="操作时间" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" :label="$t('message.operate')" width="80">
            <template slot-scope="{row}">
              <el-button
                type="text"
                @click="$router.push({path:'/departEdit',query:{row:row}})"
                size="mini"
                :disabled="row.isend==='1'"
              >{{$t('message.editBtn')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          slot="page"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="curSearchContent.pageNo"
          :page-sizes="[10, 20, 50]"
          :page-size="curSearchContent.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "depart",
  data() {
    return {
      list: [],
      searchContent: {
        deptname: "",
        memName: ""
      },
      curSearchContent: {
        pageNo: 1, // （当前页）
        pageSize: 10 // 每页显示数量
      },
      total: 0 // 总条数
    };
  },
  mounted() {
    this.$nextTick(function() {
      this.getList();
    });
  },
  methods: {
    eventSearch() {
      this.getList(1);
    },
    eventReset() {
      this.searchContent = {
        deptname: "",
        memName: ""
      };
      this.getList(1);
    },
    getList() {
      this.loading = true;
      Object.assign(this.curSearchContent, this.searchContent)
      this.$axios
        .get(
          `/concur/hrinfo/department/treelist?${this.$qs.stringify(
            this.curSearchContent
          )}`
        )
        .then(res => {
          this.loading = false;
          if (res && res.success) {
            this.list = res.result;
            this.total = res.total;
          }
        });
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
.box-card {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 12px;
  margin-top: 7px;
}
.filter-tree {
  margin-bottom: 20px;
}
</style>