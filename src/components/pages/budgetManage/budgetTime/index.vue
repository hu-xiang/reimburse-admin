<template>
  <div class="budgetEntry">
    <top-bar>
      <section>
        <label>预算年度</label>
        <el-date-picker
          value-format="yyyy"
          v-model="searchContent.budYear"
          type="year"
          placeholder="选择年"
          class="dateInput"
        ></el-date-picker>
      </section>
      <section>
        <label>是否关闭</label>
        <el-select v-model="searchContent.status" clearable>
          <el-option label="开启" :value="1"></el-option>
          <el-option label="关闭" :value="0"></el-option>
        </el-select>
      </section>
      <section>
        <label>开始日期</label>
        <el-date-picker
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="searchContent.startDate"
          type="date"
          placeholder="选择日期"
          class="dateInput"
        ></el-date-picker>
      </section>
      <section>
        <label>结束日期</label>
        <el-date-picker
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="searchContent.endDate"
          type="date"
          placeholder="选择日期"
          class="dateInput"
        ></el-date-picker>
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
        <!-- <el-table-column prop="id" label="预算单位id" show-overflow-tooltip></el-table-column> -->
        <el-table-column prop="budYear" label="预算年度" show-overflow-tooltip></el-table-column>
        <el-table-column prop="startDate" label="预算开始日期" show-overflow-tooltip></el-table-column>
        <el-table-column prop="endDate" label="预算结束日期" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="是否关闭" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span v-if="row.status==='1'">开启</span>
            <span v-if="row.status==='0'">关闭</span>
          </template>
        </el-table-column>
        <el-table-column prop="createId" label="创建人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createDate" label="创建日期" show-overflow-tooltip></el-table-column>
        <el-table-column prop="updateDate" label="操作时间" show-overflow-tooltip></el-table-column>
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
    <el-dialog :title="isAdd?'新增':'编辑'" :visible.sync="dialogVisible" width="500px">
      <el-form :model="form" ref="form" :rules="rules" label-width="120px">
        <el-form-item label="预算年度" prop="budYear">
          <el-date-picker
            value-format="yyyy"
            format="yyyy"
            v-model="form.budYear"
            type="year"
            placeholder="选择年"
            style="width:300px;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="预算开始日期" prop="startDate">
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="form.startDate"
            type="date"
            placeholder="选择日期"
            style="width:300px;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="预算结束日期" prop="endDate">
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="form.endDate"
            type="date"
            placeholder="选择日期"
            style="width:300px;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="是否关闭" prop="status">
          <el-select v-model="form.status" clearable style="width:300px;">
            <el-option label="开启" value="1"></el-option>
            <el-option label="关闭" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="eventSure" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "budgetEntry",
  data() {
    return {
      loading: false,
      tableList: [],
      searchContent: {
        budYear: "",
        status: "",
        startDate: "",
        endDate: ""
      },
      curSearchContent: {
        pageNo: 1, // （当前页）
        pageSize: 20 // 每页显示数量
      },
      total: 0, // 总条数
      dialogVisible: false,
      isAdd: true,
      form: {
        budYear: "",
        startDate: "",
        endDate: "",
        status: ""
      },
      rules: {
        budYear: [
          { required: true, message: "请输入预算年度", trigger: "blur" }
        ],
        startDate: [
          { required: true, message: "请选择预算开始日期", trigger: "blur" }
        ],
        endDate: [
          { required: true, message: "请选择预算结束日期", trigger: "blur" }
        ],
        status: [{ required: true, message: "请选择是否关闭", trigger: "change" }]
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
        budYear: "",
        status: "",
        startDate: "",
        endDate: ""
      };
      this.getList(1);
    },
    eventAdd() {
      (this.isAdd = true),
        (this.form = {
          budYear: "",
          startDate: "",
          endDate: "",
          status: ""
        });
      this.dialogVisible = true;
    },
    eventEdit(row) {
      (this.isAdd = false),
        (this.form = {
          id: row.id,
          budYear: new Date(`${row.budYear}-01-01 00:00:00`),
          startDate: row.startDate,
          endDate: row.endDate,
          status: row.status
        });
      this.dialogVisible = true;
    },
    eventSure() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.isAdd) {
            this.$axios
              .post("/concur/budget/budgetDate/add", this.form)
              .then(res => {
                if (res && res.success) {
                  this.$message.success(res.message);
                  this.dialogVisible = false;
                  this.getList(1);
                }
              });
          } else {
            this.$axios
              .put("/concur/budget/budgetDate/edit", this.form)
              .then(res => {
                if (res && res.success) {
                  this.$message.success(res.message);
                  this.dialogVisible = false;
                  this.getList(1);
                }
              });
          }
        }
      });
    },
    eventDel(row) {
      this.$confirm("确定要删除该预算时间吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .delete(
              `/concur/budget/budgetDate/delete?${this.$qs.stringify({
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
          `concur/budget/budgetDate/list?${this.$qs.stringify(
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
    }
  }
};
</script>

<style lang="scss" scoped>
.budgetEntry {
  .el-tree {
    margin-top: 20px;
  }
  /deep/ .dateInput .el-input__inner {
    padding-left: 30px;
  }
}
</style>