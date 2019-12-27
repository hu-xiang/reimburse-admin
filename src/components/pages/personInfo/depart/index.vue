<template>
  <div class="depart">
    <top-bar>
      <section>
        <label>部门名称</label>
        <el-input v-model="searchContent.deptname" clearable placeholder="请输入关键字进行过滤"></el-input>
      </section>
      <section>
        <el-button type="primary" @click="eventSearch" size="mini">{{$t('message.searchBtn')}}</el-button>
        <el-button @click="eventReset" size="mini">{{$t('message.resetBtn')}}</el-button>
      </section>
    </top-bar>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>部门组织架构</span>
        <!-- <el-button style="float: right; padding: 3px 0" type="text" @click="add">新增一级部门</el-button> -->
      </div>
      <div class="text item">
        <el-tree
          class="filter-tree"
          :default-expand-all="true"
          :data="list"
          :props="listProps"
          :filter-node-method="filterNode"
          ref="menuTree"
          node-key="id"
        >
          <el-tooltip slot-scope="{ node, data }" placement="right" trigger="hover" effect="light">
            <span>
              <span class="node-name" @click.stop="curRow(data, node)">{{ data.deptname}}</span>
            </span>
            <div class="api" slot="content">
              <!-- <el-button type="primary" size="mini" @click="add(data, node)">新增</el-button> -->
              <el-button type="success" size="mini" @click="edit(data, node)">编辑</el-button>
              <!-- <el-button type="error" size="mini" @click="del(data)">删除</el-button> -->
            </div>
          </el-tooltip>
        </el-tree>
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

    <el-dialog :title="type==='add'?'部门新增':'部门编辑'" :visible.sync="isShow" width="500px">
      <el-form :model="form" :rules="rules" ref="form" label-width="80px">
        <el-form-item label="部门名称" prop="deptname">
          <el-input v-model="form.deptname" placeholder="请输入部门名称" style="width: 300px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShow = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="eventSure" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "depart",
  data() {
    return {
      list: [],
      filterText: "",
      listProps: {
        children: "children",
        label: "deptname"
      },
      type: "",
      isShow: false,
      form: {
        deptname: ""
      },
      searchContent: {
        deptname: ""
      },
      rules: {
        deptname: [{ required: true, message: "请输入部门名称", trigger: "blur" }],
      },
      curSearchContent: {
        pageNo: 1, // （当前页）
        pageSize: 10 // 每页显示数量
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
    filterNode(value, data) {
      if (!value) return true;
      return data.deptname.indexOf(value) > -1;
    },
    eventSearch() {
      this.$refs.menuTree.filter(this.searchContent.deptname);
    },
    eventReset() {
      this.searchContent = {
        deptname: ""
      };
      this.$refs.menuTree.filter(this.searchContent.deptname);
    },
    add(data) {
      this.type = "add";
      this.isShow = true;
      if (data) {
        this.form = {
          parentId: data.id,
          deptname: ""
        };
      } else {
        this.form = {
          deptname: "",
          parentId: "0"
        };
      }
    },
    edit(data) {
      this.type = "edit";
      this.isShow = true;
      this.form = {
        id: data.id,
        deptname: data.deptname
      };
    },
    del(data) {
      this.$confirm(`你确定要删除[ ${data.deptname} ]部门吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$axios
          .delete(
            `/concur/hrinfo/department/delete?${this.$qs.stringify({
              id: data.id
            })}`
          )
          .then(res => {
            if (res && res.success) {
              this.$messageAlert.success(res.message);
              this.getList();
            }
          });
      });
    },
    eventSure() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.type === "add") {
            this.$axios
              .post("/concur/hrinfo/department/add", this.form)
              .then(res => {
                if (res && res.success) {
                  this.$messageAlert.success(res.message);
                  this.isShow = false;
                  this.getList();
                }
              });
          } else if (this.type === "edit") {
            this.$axios
              .put("/concur/hrinfo/department/edit", this.form)
              .then(res => {
                if (res && res.success) {
                  this.$messageAlert.success(res.message);
                  this.isShow = false;
                  this.getList();
                }
              });
          }
        }
      });
    },
    getList() {
      this.loading = true;
      this.$axios.get(
        `/concur/hrinfo/department/treelist?${this.$qs.stringify(
            this.curSearchContent
          )}`).then(res => {
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
</style>