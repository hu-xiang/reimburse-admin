<template>
  <div class="rank">
    <top-bar>
      <section>
        <label>职级名称</label>
        <el-input v-model="searchContent.rankname"></el-input>
      </section>
      <section>
        <el-button type="primary" @click="eventSearch" size="mini">{{$t('message.searchBtn')}}</el-button>
        <el-button @click="eventReset" size="mini">{{$t('message.resetBtn')}}</el-button>
      </section>
    </top-bar>
    <table-bar>
      <div slot="top">
        <el-button type="primary" @click="eventAdd" size="mini">{{$t('message.addBtn')}}</el-button>
      </div>
      <el-table
        slot="table"
        v-loading="loading"
        border
        stripe
        :data="tableList"
        style="width: 100%"
      >
        <el-table-column align="center" fixed="left" :label="$t('message.operate')" width="120">
          <template slot-scope="{row}">
            <el-button type="text" @click="eventEdit(row)" size="mini">{{$t('message.editBtn')}}</el-button>
            <el-button type="text" size="mini" @click="eventDel(row)">{{$t('message.deleteBtn')}}</el-button>
          </template>
        </el-table-column>
        <el-table-column type="index" width="40" align="center"></el-table-column>
        <!-- <el-table-column prop="id" label="职级id" show-overflow-tooltip></el-table-column> -->
        <el-table-column prop="rankname" label="职级名称" show-overflow-tooltip></el-table-column>
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

    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="form" ref="form" :rules="rules" label-width="100px">
        <el-form-item label="职级名称" prop="rankname">
          <el-input v-model.trim="form.rankname"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="eventSure" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "rank",
  data() {
    return {
      loading: false,
      tableList: [],
      searchContent: {
        rankname: ""
      },
      curSearchContent: {
        pageNo: 1, // （当前页）
        pageSize: 20 // 每页显示数量
      },
      total: 0, // 总条数
      title: "新增职级",
      dialogFormVisible: false,
      form: {
        rankname: ""
      },
      rules: {
        rankname: [
          { required: true, message: "请输入职级名称", trigger: "blur" }
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
    eventSearch() {
      this.getList(1);
    },
    eventReset() {
      this.searchContent = {
        rankname: ""
      };
      this.getList(1);
    },
    eventAdd() {
      (this.title = "新增职级"),
        (this.form = {
          rankname: ""
        });
      this.dialogFormVisible = true;
    },
    eventEdit(row) {
      (this.title = "编辑职级"),
        (this.form = {
          id: row.id,
          rankname: row.rankname
        });
      this.dialogFormVisible = true;
    },
    eventSure() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.title === "新增职级") {
            this.$axios.post("/concur/hrinfo/rank/add", this.form).then(res => {
              if (res && res.success) {
                this.$message.success(res.message);
                this.dialogFormVisible = false;
                this.getList(1);
              }
            });
          } else {
            this.$axios.put("/concur/hrinfo/rank/edit", this.form).then(res => {
              if (res && res.success) {
                this.$message.success(res.message);
                this.dialogFormVisible = false;
                this.getList(1);
              }
            });
          }
        }
      });
    },
    eventDel(row) {
      this.$confirm("确定要删除该职级吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .delete(
              `/concur/hrinfo/rank/delete?${this.$qs.stringify({
                id: row.id
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
          `/concur/hrinfo/rank/list?${this.$qs.stringify(
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
    }
  }
};
</script>

<style lang="scss" scoped>
.rank {
}
</style>