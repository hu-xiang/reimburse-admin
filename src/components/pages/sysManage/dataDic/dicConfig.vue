<template>
  <content-bar :pathArr="pathArr">
    <top-bar>
      <section>
        <label>字典值</label>
        <el-input v-model="searchContent.value"></el-input>
      </section>
      <section>
        <label>字典状态</label>
        <el-select v-model="searchContent.status" clearable>
          <el-option label="启用" value="1"></el-option>
          <el-option label="未启用" value="0"></el-option>
        </el-select>
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
        <el-table-column align="center" fixed="left" :label="$t('message.operate')" width="150">
          <template slot-scope="{row}">
            <el-button type="text" @click="eventEdit(row)" size="mini">{{$t('message.editBtn')}}</el-button>
            <el-button type="text" size="mini" @click="eventDel(row)">{{$t('message.deleteBtn')}}</el-button>
          </template>
        </el-table-column>
        <el-table-column type="index" width="40" align="center"></el-table-column>
        <el-table-column prop="value" label="字典值" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="字典状态" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span v-if="row.status==='0'">未启用</span>
            <span v-if="row.status==='1'">启用</span>
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
    <el-dialog :title="isAdd?'新增数据字典':'编辑数据字典'" :visible.sync="dialogVisible" width="500px">
      <el-form :model="form" ref="form" :rules="rules" label-width="120px">
        <el-form-item label="字典值" prop="value">
          <el-input v-model="form.code" placeholder="请输入字典值" style="width: 300px"></el-input>
        </el-form-item>

        <el-form-item label="字典状态" prop="status">
          <el-select v-model="form.status" clearable style="width:300px;" placeholder="请选择字典状态">
            <el-option label="启用" value="1"></el-option>
            <el-option label="不启用" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="eventSure" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </content-bar>
</template>

<script>
export default {
  name: "dicConfig",
  data() {
    return {
      pathArr: ["系统管理", "数据字典", "字典配置"],
      loading: false,
      tableList: [],
      searchContent: {
        value: "",
        status: ""
      },
      curSearchContent: {
        dicId: this.$route.query.row.id,
        pageNo: 1, // （当前页）
        pageSize: 20 // 每页显示数量
      },
      total: 0, // 总条数
      dialogVisible: false,
      isAdd: true,
      form: {
        value: "",
        status: ""
      },
      rules: {
        value: [{ required: true, message: "请输入字典值", trigger: "blur" }],
        status: [
          { required: true, message: "请选择字典状态", trigger: "change" }
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
        value: "",
        status: ""
      };
      this.getList(1);
    },
    eventAdd() {
      (this.isAdd = true),
        (this.form = {
          id: this.$route.query.row.id,
          value: "",
          status: ""
        });
      this.dialogVisible = true;
    },
    eventEdit(row) {
      (this.isAdd = false),
        (this.form = {
          id: this.$route.query.row.id,
          dId: row.id,
          value: row.value,
          status: row.status
        });
      this.dialogVisible = true;
    },
    eventSure() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.isAdd) {
            this.$axios
              .post("/concur/gloConfig/dicDate/add", this.form)
              .then(res => {
                if (res && res.success) {
                  this.$messageAlert.success(res.message);
                  this.dialogVisible = false;
                  this.getList(1);
                }
              });
          } else {
            this.$axios
              .put("/concur/gloConfig/dicDate/edit", this.form)
              .then(res => {
                if (res && res.success) {
                  this.$messageAlert.success(res.message);
                  this.dialogVisible = false;
                  this.getList(1);
                }
              });
          }
        }
      });
    },
    eventDel(row) {
      this.$confirm("确定要删除该数据字典配置吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .delete(
              `/concur/gloConfig/dicDate/delete?${this.$qs.stringify({
                dId: row.id,
                id: this.$route.query.row.id
              })}`
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
          `/concur/gloConfig/dicDate/list?${this.$qs.stringify(
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
</style>