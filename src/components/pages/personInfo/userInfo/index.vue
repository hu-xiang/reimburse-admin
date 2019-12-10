<template>
  <div class="userInfo">
    <top-bar>
      <section>
        <label>工号</label>
        <el-input v-model="searchContent.memJobno"></el-input>
      </section>
      <section>
        <label>姓名</label>
        <el-input v-model="searchContent.memName"></el-input>
      </section>
      <section>
        <el-button type="primary" @click="eventSearch" size="mini">{{$t('message.searchBtn')}}</el-button>
        <el-button @click="eventReset" size="mini">{{$t('message.resetBtn')}}</el-button>
      </section>
    </top-bar>
    <table-bar>
      <div slot="top">
        <el-button type="primary" @click="$router.push('/userAdd')" size="mini" v-if="$auths('/userAdd')">
          {{$t('message.addBtn')}}</el-button>
      </div>
      <el-table slot="table" v-loading="loading" border stripe :data="tableList" style="width: 100%">
        <el-table-column align="center" fixed="left" :label="$t('message.operate')" width="120"
          v-if="$auths('/userEdit') || $auths('/userDelete')">
          <template slot-scope="{row}">
            <el-button type="text" @click="$router.push({path:'/userEdit',query:{row:row}})" size="mini"
              v-if="$auths('/userEdit')">
              {{$t('message.editBtn')}}
            </el-button>
            <el-button type="text" size="mini" @click="eventDel(row)" v-if="$auths('/userDelete')">
              {{$t('message.deleteBtn')}}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="memName" label="姓名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="memJobno" label="工号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="memSex" label="性别" show-overflow-tooltip></el-table-column>
        <el-table-column prop="memIdcard" label="身份证号码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="memBirthday" label="出生日期" show-overflow-tooltip></el-table-column>
        <el-table-column prop="memJoinDate" label="入职日期" show-overflow-tooltip></el-table-column>
        <el-table-column prop="memLeaveDate" label="离职日期" show-overflow-tooltip></el-table-column>
        <el-table-column prop="memEmail" label="邮箱" show-overflow-tooltip></el-table-column>
        <el-table-column prop="memPhone" label="手机号码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="deptname" label="部门名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="rankname" label="职级名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="postdesc" label="岗位描述" show-overflow-tooltip></el-table-column>
      </el-table>
      <el-pagination slot="page" @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="curSearchContent.pageNo" :page-sizes="[20, 30, 50, 100]" :page-size="curSearchContent.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </table-bar>
  </div>
</template>

<script>
  export default {
    name: "userInfo",
    data() {
      return {
        loading: false,
        tableList: [],
        searchContent: {
          memJobno: "",
          memName: ""
        },
        curSearchContent: {
          pageNo: 1, // （当前页）
          pageSize: 20 // 每页显示数量
        },
        total: 0 // 总条数
      };
    },
    mounted() {
      this.$nextTick(function () {
        this.getList(1);
      });
    },
    methods: {
      eventSearch() { this.getList(1); },
      eventReset() {
        this.searchContent = {
          memJobno: '',
          memName: '',
        };
        this.getList(1);
      },
      getList(bool) {
        if (bool) Object.assign(this.curSearchContent, this.searchContent);
        this.loading = true;
        this.$axios.get(`/concur/hrinfo/member/list?${this.$qs.stringify(this.curSearchContent)}`).then(res => {
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
  .userInfo {}
</style>