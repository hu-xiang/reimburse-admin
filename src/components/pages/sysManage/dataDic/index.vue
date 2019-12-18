<template>
  <div class="dataDic">
    <top-bar>
      <section>
        <label>字典编码</label>
        <el-input v-model="searchContent.code"></el-input>
      </section>
      <section>
        <label>字典状态</label>
        <el-select v-model="searchContent.status" clearable>
          <el-option label="启用" value="1"></el-option>
          <el-option label="未启用" value="0"></el-option>
        </el-select>
      </section>
      <section>
        <label>字典描述</label>
        <el-input v-model="searchContent.remark"></el-input>
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
            <el-button
              type="text"
              @click="$router.push({path:'/dicConfig',query:{row:row}})"
              size="mini"
            >字典配置</el-button>
            <el-button type="text" size="mini" @click="eventDel(row)">{{$t('message.deleteBtn')}}</el-button>
          </template>
        </el-table-column>
        <el-table-column type="index" width="40" align="center"></el-table-column>
        <el-table-column prop="code" label="字典编码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="字典状态" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span v-if="row.status==='0'">未启用</span>
            <span v-if="row.status==='1'">启用</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="字典描述" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createId" label="创建人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createDate" label="创建日期" show-overflow-tooltip></el-table-column>
        <el-table-column prop="updateId" label="修改人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="updateDate" label="修改日期" show-overflow-tooltip></el-table-column>
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
        <el-form-item label="字典编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入字典编码" style="width: 300px"></el-input>
        </el-form-item>

        <el-form-item label="字典状态" prop="status">
          <el-select v-model="form.status" clearable style="width:300px;" placeholder="请选择字典状态">
            <el-option label="启用" value="1"></el-option>
            <el-option label="不启用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="字典描述" prop="remark">
          <el-input type="textarea" v-model="form.remark" placeholder="请输入字典描述" style="width: 300px"></el-input>
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
  name: "dataDic",
  data() {
    return {
      loading: false,
      tableList: [],
      searchContent: {
        code: "",
        status: "",
        remark: ""
      },
      curSearchContent: {
        pageNo: 1, // （当前页）
        pageSize: 20 // 每页显示数量
      },
      total: 0, // 总条数
      dialogVisible: false,
      isAdd: true,
      form: {
        code: "",
        status: "",
        remark: ""
      },
      rules: {
        code: [{ required: true, message: "请输入字典编码", trigger: "blur" }],
        status: [
          { required: true, message: "请选择字典状态", trigger: "change" }
        ],
        remark: [{ required: true, message: "请输入字典描述", trigger: "blur" }]
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
        code: "",
        status: "",
        remark: ""
      };
      this.getList(1);
    },
    eventAdd() {
      (this.isAdd = true),
        (this.form = {
          code: "",
          status: "",
          remark: ""
        });
      this.dialogVisible = true;
    },
    eventEdit(row) {
      (this.isAdd = false),
        (this.form = {
          id: row.id,
          code: row.code,
          status: row.status,
          remark: row.remark
        });
      this.dialogVisible = true;
    },
    eventSure() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.isAdd) {
            this.$axios
              .post("/concur/gloConfig/dictionary/add", this.form)
              .then(res => {
                if (res && res.success) {
                  this.$message.success(res.message);
                  this.dialogVisible = false;
                  this.getList(1);
                }
              });
          } else {
            this.$axios
              .put("/concur/gloConfig/dictionary/edit", this.form)
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
      this.$confirm("确定要删除该数据字典吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .delete(
              `/concur/gloConfig/dictionary/delete?${this.$qs.stringify({
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
          `/concur/gloConfig/dictionary/list?${this.$qs.stringify(
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
.dataDic {
}
</style>