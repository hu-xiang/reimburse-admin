<template>
  <div class="zone">
    <!--搜索栏位-->

    <top-bar>
      <section>
        <label>地区名称</label>
        <el-input v-model="searchContent.rname"></el-input>
      </section>
      <section>
        <label>地区类型</label>
        <el-select v-model="searchContent.rtype" clearable>
          <el-option label="海外一类区域" value="1"></el-option>
          <el-option label="海外二类区域" value="2"></el-option>
          <el-option label="海外三类区域" value="3"></el-option>
          <el-option label="一线城市" value="4"></el-option>
          <el-option label="二线城市" value="5"></el-option>
          <el-option label="省会城市" value="6"></el-option>
          <el-option label="其他城市" value="7"></el-option>
        </el-select>
      </section>
      <section>
        <el-button type="primary" @click="handleSearch" size="mini">{{$t('message.searchBtn')}}</el-button>
        <el-button @click="handleReset" size="mini">{{$t('message.resetBtn')}}</el-button>
      </section>
    </top-bar>

    <!---------------------------------------------------血淋淋的切割线-------------------------------------------------->

    <!--表格数据区域-->

    <table-bar>
      <div slot="top">
        <el-button
          type="primary"
          @click="$router.push('/zoneAdd')"
          size="mini"
        >{{$t('message.addBtn')}}国家</el-button>
      </div>
      <el-table
        slot="table"
        v-loading="loading"
        class="filter-tree"
        :data="zoneTableList"
        row-key="id"
        border
        stripe
        default-expand-all
        :tree-props="{children: 'children'}"
      >
        <el-table-column type="index" width="40" align="center"></el-table-column>
        <el-table-column prop="rname" label="地区名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="rnumber" label="地区编号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="rtype" label="地区类型" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span v-if="row.rtype==='1'">海外一类区域</span>
            <span v-if="row.rtype==='2'">海外二类区域</span>
            <span v-if="row.rtype==='3'">海外三类区域</span>
            <span v-if="row.rtype==='4'">一线城市</span>
            <span v-if="row.rtype==='5'">二线城市</span>
            <span v-if="row.rtype==='6'">省会城市</span>
            <span v-if="row.rtype==='7'">其他城市</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="parentId" label="上层编号" show-overflow-tooltip></el-table-column> -->
        <el-table-column prop="createName" label="创建人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createDate" label="创建时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="updateName" label="操作人" show-overflow-tooltip></el-table-column>
        <el-table-column prop="updateDate" label="操作时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="isOut" label="是否海外" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span v-if="row.isOut==='1'">海外</span>
            <span v-if="row.isOut==='0'">国内</span>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('message.operate')" width="150">
          <template slot-scope="{row}">
            <el-button
              type="text"
              @click="$router.push({path:'/zoneAdd',query:{row:row}})"
              size="mini"
            >新增城市</el-button>
            <el-button
              type="text"
              @click="$router.push({path:'/zoneEdit',query:{row:row}})"
              size="mini"
            >{{$t('message.editBtn')}}</el-button>
            <el-button
              type="text"
              size="mini"
              @click="handleDelete(row)"
            >{{$t('message.deleteBtn')}}</el-button>
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
  </div>
</template>

<script>
export default {
  name: "zone",
  data() {
    return {
      loading: false,
      zoneTableList: [{}],
      searchContent: {
        rname: "",
        rtype: ""
      },
      curSearchContent: {
        pageNo: 1, // 当前页
        pageSize: 20 // 每页显示数量
      },
      total: 0 // 总条数
    };
  },
  mounted() {
    this.$nextTick(function() {
      this.getZoneList(1);
    });
  },

  methods: {
    handleSearch() {
      this.getZoneList(1);
    },
    handleReset() {
      this.searchContent = {
        rname: "",
        rtype: ""
      };
      this.getZoneList(1);
    },
    handleDelete(row) {
      this.$confirm("确定要删除该地区吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .delete(
              `/concur/gloConfig/region/delete?${this.$qs.stringify({
                id: row.id
              })}`
            )
            .then(res => {
              if (res && res.success) {
                this.$messageAlert.success(res.message);
                this.getZoneList(1);
              }
            });
        })
        .catch(() => {});
    },
    getZoneList(bool) {
      if (bool) Object.assign(this.curSearchContent, this.searchContent);
      this.loading = true;
      this.$axios
        .get(
          `/concur/gloConfig/region/treelist?${this.$qs.stringify(
            this.curSearchContent
          )}`
        )
        .then(res => {
          this.loading = false;
          if (res && res.success) {
            this.zoneTableList = res.result;
            this.total = res.total;
          }
        });
      Object.assign(this.searchContent, this.curSearchContent);
    },
    handleSizeChange(val) {
      this.curSearchContent.pageSize = val;
      this.getZoneList();
    },
    handleCurrentChange(val) {
      this.curSearchContent.pageNo = val;
      this.getZoneList();
    }
  }
};
</script>

<style lang="scss" scoped>
.zone {
}
</style>
