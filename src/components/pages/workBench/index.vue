<template>
  <div class="workbench">
    <div class="workbench-top">
      <el-row type="flex" class="row-bg">
        <el-col :span="16">
          <div class="grid-content bg-purple">
            <div class="personInfo">
              <img src="../../../assets/img/man.png" class="personImg" v-if="isSex == '1'" />
              <img src="../../../assets/img/women.png" class="personImg" v-else />
              <span>
                {{time}}，
                <span class="userName">{{userName}}</span>
                ，{{blessing}}
              </span>
            </div>
          </div>
        </el-col>
        <el-col class="right" :span="8">
          <div class="grid-content bg-purple-light">
            <span class="myApplication">
              {{$t('message.myApplication')}}：
              <span class="account">0</span>
            </span>
            <span>
              {{$t('message.myApproval')}}：
              <span class="account">0</span>
            </span>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="workbench-content">
      <div class="workbench-content-item first">
        <!-- {{$t('message.myApplication')}} -->
        <el-tabs v-model="activeName1">
          <el-tab-pane label="出差申请" name="first">出差申请</el-tab-pane>
          <el-tab-pane label="预算申请" name="second">
            <budget-apply></budget-apply>
          </el-tab-pane>
          <el-tab-pane label="报销申请" name="third">报销申请</el-tab-pane>
        </el-tabs>
      </div>
      <div class="workbench-content-item">
        <!-- {{$t('message.myApproval')}} -->
        <el-tabs v-model="activeName2">
          <el-tab-pane label="出差审批" name="first">出差审批</el-tab-pane>
          <el-tab-pane label="预算审批" name="second">
            <budget-approval></budget-approval>
          </el-tab-pane>
          <el-tab-pane label="报销审批" name="third">报销审批</el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="workbench-content">
      <div class="workbench-content-item first">
        <el-tabs v-model="activeName3">
          <el-tab-pane :label="$t('message.approvalQuery')" name="first">
            <query></query>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="workbench-content-item">
        <el-tabs v-model="activeName4">
          <el-tab-pane :label="$t('message.newsAnnouncement')" name="first">
            <news></news>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import budgetApply from "./budgetApply.vue";
import budgetApproval from "./budgetApproval.vue";
import news from "./news.vue";
import query from "./query.vue"

export default {
  name: "workbench",
  components: {
    budgetApply,
    budgetApproval,
    news,
    query
  },
  data() {
    return {
      time: "",
      blessing: "",
      isSex: "",
      userName: "",
      activeName1: "second",
      activeName2: "second",
      activeName3: "first",
      activeName4: "first"
    };
  },
  mounted() {
    this.$nextTick(function() {
      this.time = this.$api.timeFix();
      this.blessing = this.$api.welcome();
      this.isSex = JSON.parse(sessionStorage.getItem("userInfo")).sex;
      this.userName =
        this.$i18n.locale == "cn"
          ? JSON.parse(sessionStorage.getItem("userInfo")).realname
          : JSON.parse(sessionStorage.getItem("userInfo")).username;
    });
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.workbench {
  .workbench-top {
    background-color: #ffffff;
    border-radius: 10px;
    padding: 12px 12px 5px;
    height: 80px;

    .personInfo {
      display: flex;
      align-items: center;

      .personImg {
        width: 60px;
        height: 60px;
      }

      .userName {
        color: #f45d2f;
      }
    }

    .right {
      display: flex;
      align-items: center;

      .myApplication {
        padding-right: 30px;
      }

      .account {
        color: #f45d2f;
      }
    }
  }

  .workbench-content {
    display: flex;
    margin-top: 5px;
    justify-content: space-between;
    .workbench-content-item {
      background-color: #ffffff;
      padding: 12px 12px 5px;
      border-radius: 10px;
      min-height: 500px;
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .first {
      margin-right: 5px;
    }
  }
}
</style>