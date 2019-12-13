<template>
  <content-bar
    v-loading="loading"
    footer
    :pathArr="pathArr"
    confirmButtonText="提交"
    @confirm="submit"
    @cancel="$router.go(-1)"
  >
    <el-form :model="form" ref="form" :rules="rules" label-width="150px">
      <content-item title="基本信息" width="1100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="姓名" prop="memName">
              <el-input v-model="form.memName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="工号" prop="memJobno">
              <el-input v-model="form.memJobno"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性别" prop="memSex">
              <el-select v-model="form.memSex" clearable>
                <el-option label="男" :value="1"></el-option>
                <el-option label="女" :value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="身份证号码" prop="memIdcard">
              <el-input v-model="form.memIdcard"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号码" prop="memPhone">
              <el-input v-model="form.memPhone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮箱" prop="memEmail">
              <el-input v-model="form.memEmail"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="出生日期" prop="memBirthday">
              <el-date-picker
                v-model="form.memBirthday"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择出生日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="入职日期" prop="memJoinDate">
              <el-date-picker
                v-model="form.memJoinDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择入职日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="离职日期" prop="memLeaveDate">
              <el-date-picker
                v-model="form.memLeaveDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择离职日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="职级名称" prop="rankId">
              <rank v-model="form.rankId"></rank>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="部门" prop="depId">
              <depart v-model="form.depId"></depart>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="岗位描述" prop="postId">
              <position v-model="form.postId"></position>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="是否有上级" prop="islead">
              <el-select v-model="form.islead" clearable>
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </content-item>
    </el-form>
  </content-bar>
</template>

<script>
export default {
  name: "userAdd",
  data() {
    const checkdPhone = (rule, value, callback) => {
      const reg = /(^1[3|4|5|7|8|9]\d{9}$)|(^09\d{8}$)/;
      if (value) {
        if (reg.test(value)) {
          callback();
        } else {
          callback("手机号输入不正确");
        }
      } else {
        callback("请输入手机号");
      }
    };
    const checkdIdcard = (rule, value, callback) => {
      const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (value) {
        if (reg.test(value)) {
          callback();
        } else {
          callback("身份证号码输入不正确");
        }
      } else {
        callback("请输入身份证号码");
      }
    };
    const checkdEmail = (rule, value, callback) => {
      const reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      if (value) {
        if (reg.test(value)) {
          callback();
        } else {
          callback("邮箱输入不正确");
        }
      } else {
        callback("请输入邮箱");
      }
    };
    return {
      pathArr: ["人事资料", "人员信息", "编辑人员"],
      loading: false,
      form: {
        id: "",
        memName: "",
        memJobno: "",
        memSex: "",
        memIdcard: "",
        memPhone: "",
        memEmail: "",
        memBirthday: "",
        memJoinDate: "",
        memLeaveDate: "",
        islead: "",
        rankId: "",
        depId: "",
        postId: ""
      },
      rules: {
        memName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        memJobno: [{ required: true, message: "请输入工号", trigger: "blur" }],
        memSex: [{ required: true, message: "请选择性别", trigger: "change" }],
        memIdcard: [
          { required: true, validator: checkdIdcard, trigger: "blur" }
        ],
        memPhone: [{ required: true, validator: checkdPhone, trigger: "blur" }],
        memEmail: [{ required: true, validator: checkdEmail, trigger: "blur" }],
        memJoinDate: [
          { required: true, message: "请选择入职日期", trigger: "change" }
        ],
        rankId: [
          { required: true, message: "请选择职级名称", trigger: "change" }
        ],
        depId: [{ required: true, message: "请选择部门", trigger: "change" }],
        postId: [
          { required: true, message: "请选择岗位描述", trigger: "change" }
        ]
      }
    };
  },
  // computed: {
  //   form() {
  //     return {};
  //   }
  // },
  mounted() {
    this.$nextTick(function() {
      this.form = {
        id: this.$route.query.row.id,
        memName: this.$route.query.row.memName,
        memJobno: this.$route.query.row.memJobno,
        memSex: this.$route.query.row.memSex,
        memIdcard: this.$route.query.row.memIdcard,
        memPhone: this.$route.query.row.memPhone,
        memEmail: this.$route.query.row.memEmail,
        memBirthday: this.$route.query.row.memBirthday,
        memJoinDate: this.$route.query.row.memJoinDate,
        memLeaveDate: this.$route.query.row.memLeaveDate,
        islead: this.$route.query.row.islead,
        rankId: this.$route.query.row.rankId,
        depId: this.$route.query.row.depId,
        postId: this.$route.query.row.postId
      };
    });
  },
  methods: {
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$axios.put("concur/hrinfo/member/edit", this.form).then(res => {
            this.loading = false;
            if (res && res.success) {
              this.$router.replace("/userInfo");
              this.$message.success(res.message);
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>