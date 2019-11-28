<template>
  <div class="role">
    <top-bar>
      <section>
        <label>角色名称</label>
        <el-input v-model="searchContent.roleName"></el-input>
      </section>
      <section>
        <label>创建时间</label>
        <el-date-picker
          v-model="searchContent.time"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </section>
      <section>
        <el-button type="primary" @click="eventSearch" size="mini">查询</el-button>
        <el-button @click="eventReset" size="mini">重置</el-button>
      </section>
    </top-bar>
    <table-bar>
      <div slot="top">
        <el-button type="primary" @click="$router.push('/roleAdd')" size="mini">新增</el-button>
      </div>
      <el-table slot="table"
        v-loading="loading"
        border 
        stripe
        :data="tableList"
        style="width: 100%">
        <el-table-column align="center"
          fixed="left"
          label="操作"
          width="120">
          <template slot-scope="{row}">
            <el-button type="text"
              @click="$router.push({path:'/roleEdit',query:{row:row}})"
              size="mini">
              编辑
            </el-button>
            <el-button type="text" size="mini" @click="eventDel(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="roleName"
          label="角色名称">
        </el-table-column>
        <el-table-column prop="roleCode"
          label="角色编码">
        </el-table-column>
        <el-table-column prop="description"
          label="备注">
        </el-table-column>
        <el-table-column prop="createTime"
          label="创建时间">
        </el-table-column>
        <el-table-column prop="updateTime"
          label="更新时间">
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
  name: "role",
  data() {
    return {
      loading: false,
      tableList: [{}],
      searchContent: {
          roleName: '',
          time: '',
      },
      curSearchContent: {
        pageNum: 1, // （当前页）
        pageSize: 20, // 每页显示数量
      },
      total: 0, // 总条数
    };
  },
  mounted() {
    this.$nextTick(function() {
        this.getList();
    });
  },
  methods: {
    eventSearch() {},
    eventReset() {},
    getList(bool) {
      if (bool) Object.assign(this.curSearchContent, this.searchContent);
      this.loading = true;
      this.$axios.get("/sys/role/list", this.curSearchContent).then(res => {
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
      this.curSearchContent.pageNum = val;
      this.getList();
    },
  }
};
</script>

<style lang="scss" scoped>
.role {
}
</style>