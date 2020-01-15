<template>
  <div class="depart">
    <top-bar>
      <section>
        <label>类型名称</label>
        <el-input v-model="searchContent.budName" clearable placeholder="请输入"></el-input>
      </section>
      <section>
        <el-button type="primary" @click="eventSearch" size="mini">{{$t('message.searchBtn')}}</el-button>
        <el-button @click="eventReset" size="mini">{{$t('message.resetBtn')}}</el-button>
      </section>
    </top-bar>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-select v-model="searchContent.mainType" placeholder="请选择" @change="changeMainType">
          <el-option
            v-for="item in listMainType"
            :key="item.value"
            :label="item.value"
            :value="item.id"
          ></el-option>
        </el-select>

        <el-button style="float: right;" size="mini" type="primary" @click="$router.push({path:'/classMaintenanceAdd',query:{mainType: searchContent.mainType}})">新增一级分类</el-button>
      </div>
      <div class="text item">
        <el-table
          class="filter-tree"
          :data="list"
          row-key="id"
          border
          stripe
          default-expand-all
          :tree-props="{children: 'children'}"
        >
          <el-table-column prop="budName" label="预算类型名称" min-width="200px" show-overflow-tooltip></el-table-column>
          <el-table-column prop="mainName" label="预算大类" show-overflow-tooltip></el-table-column>
          <el-table-column prop="istran" label="是否为交通费" show-overflow-tooltip min-width="100px">
            <template slot-scope="{row}">
              <span v-if="row.istran==='1'">是</span>
              <span v-if="row.istran==='0'">否</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="是否有效" show-overflow-tooltip>
            <template slot-scope="{row}">
              <span v-if="row.status==='1'">有效</span>
              <span v-if="row.status==='0'">无效</span>
            </template>
          </el-table-column>
          <el-table-column prop="issubsidy" label="是否为补贴" show-overflow-tooltip>
            <template slot-scope="{row}">
              <span v-if="row.issubsidy==='1'">是</span>
              <span v-if="row.issubsidy==='0'">否</span>
            </template>
          </el-table-column>
          <el-table-column prop="taxrate" label="默认税率" show-overflow-tooltip></el-table-column>
          <el-table-column prop="txt50" label="会计科目" show-overflow-tooltip></el-table-column>
          <el-table-column prop="cridetTxt50" label="贷方科目" show-overflow-tooltip></el-table-column>
          <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" :label="$t('message.operate')" width="120">
            <template slot-scope="{row}">
              <el-button type="text" @click="$router.push({path:'/classMaintenanceAdd',query:{row:row, mainType: searchContent.mainType}})" size="mini">{{$t('message.addBtn')}}</el-button>
              <el-button type="text" @click="$router.push({path:'/classMaintenanceEdit',query:{row:row}})" size="mini">{{$t('message.editBtn')}}</el-button>
              <el-button type="text" size="mini" @click="del(row)">{{$t('message.deleteBtn')}}</el-button>
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
      listMainType: [],
      list: [],
      searchContent: {
        budName: "",
        mainType: ""
      },
      curSearchContent: {
        pageNo: 1, // （当前页）
        pageSize: 10 // 每页显示数量
      },
      total: 0, // 总条数
    };
  },
  created() {
    this.getMainType();
  },
  mounted() {
    this.$nextTick(function() {});
  },
  methods: {
    eventSearch() {
      this.getList();
    },
    eventReset() {
      this.searchContent.budName = "";
      this.getList();
    },
    del(data) {
      this.$confirm(`你确定要删除[ ${data.budName} ]分类吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$axios
          .delete(
            `/concur/budget/budgetType/delete?${this.$qs.stringify({
              id: data.id,
              mainType: data.mainType
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
    getList() {
      this.loading = true;
      Object.assign(this.curSearchContent, this.searchContent);
      this.$axios
        .get(
          `/concur/budget/budgetType/treelist?${this.$qs.stringify(
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
    changeMainType() {
      this.getList();
    },
    getMainType() {
      this.$axios.get("/concur/budget/budgetType/getMainType").then(res => {
        if (res && res.success) {
          this.listMainType = res.result;
          if (res.result) {
            this.searchContent.mainType = res.result[0].id;
            // if (this.$route.query.mainType||this.$route.query.mainType!=undefined) {
            //   this.searchContent.mainType = this.$route.query.mainType;
            // } else {
            //   this.searchContent.mainType = res.result[0].id;
            // }
            this.getList();
          }
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