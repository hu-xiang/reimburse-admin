<template>
  <div class="login-container pull-height" @keyup.enter.native="submitForm('ruleForm')">
    <div class="video_wrapper">
      <video autoplay muted loop>
        <source src="../assets/img/login/login-bg.mp4" type="video/mp4" />
      </video>
    </div>
    <div class="login-info text-whit fadeInLeft">
      <h2 class="login-info-title">闻泰科技 - 报账系统</h2>
      <ul class="login-info-list">
        <li class="login-info-item">
          <i class="el-icon-check"></i>&nbsp;智能财务协同
        </li>
        <li class="login-info-item">
          <i class="el-icon-check"></i>&nbsp;内外系统互连互通
        </li>
      </ul>
    </div>
    <div class="login-border fadeInRight">
      <div class="login-main">
        <h2 class="login-title">闻泰科技报账系统</h2>
        <el-form
          class="login-form"
          status-icon
          :rules="rules"
          ref="ruleForm"
          :model="ruleForm"
          label-width="0"
        >
          <el-form-item prop="username">
            <el-input
              size="small"
              @keyup.enter.native="submitForm('ruleForm')"
              v-model="ruleForm.username"
              auto-complete="off"
              placeholder="请输入用户名"
            >
              <i slot="prefix" class="el-icon-user"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              size="small"
              @keyup.enter.native="submitForm('ruleForm')"
              :type="passwordType"
              v-model="ruleForm.password"
              auto-complete="off"
              placeholder="请输入密码"
            >
              <i class="el-icon-view el-input__icon" slot="suffix" @click="showPassword"></i>
              <i slot="prefix" class="el-icon-unlock"></i>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="small"
              @click.native.prevent="submitForm('ruleForm')"
              class="login-submit"
            >登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
  <!-- <div class="login-app">
		<div class="login-outbox">
			<div class="login-box">
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="top" class="login-ruleForm">
					<el-form-item label="用户名" prop="username">
						<el-input v-model="ruleForm.username"></el-input>
					</el-form-item>
					<el-form-item label="密码" prop="password">
						<el-input type="password" v-model="ruleForm.password"></el-input>
					</el-form-item>
				</el-form>
				<el-button type="primary" @click="submitForm('ruleForm')" class="login-btn">登录</el-button>
			</div>
		</div>
  </div>-->
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      ruleForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ]
	  },
	  passwordType: 'password',
    };
  },
  created() {},
  mounted() {
    this.$nextTick(function() {});
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.login();
        } else {
          return false;
        }
      });
    },
    login() {
      // 登录
      this.$axios.post("/sys/login", this.ruleForm).then(res => {
        console.log(res);
        if (res && res.success) {
          sessionStorage.setItem('token', res.result.token);
          this.$router.push("/myApplication");
        }
      });
	},
	showPassword() {
      if (this.passwordType === 'password') {
        this.passwordType = '';
      } else {
        this.passwordType = 'password';
      }
    },
  },
  watch: {},
  computed: {}
};
</script>

<style lang="scss" scoped>
// .login-app{
// 	width: 100%;
// 	height: 100%;
// 	background-image: url('../../src/assets/img/login/login_bg.png');
// 	background-repeat: no-repeat;
// 	background-color: #b8e5f8;
// 	background-size: cover;
// 	overflow: auto;
// 	.login-outbox{
// 		flex: 1 1;
// 		display: flex;
// 		flex-direction: column;
// 		align-items: center;
// 		justify-content: center;
// 		min-height: 688px;
// 		height: calc(100% - 42px);
// 		.login-box {
// 			width: 432px;
// 			margin: 0 auto;
// 		    background: #FFFFFF;
// 			overflow: hidden;
// 			border-radius: 2px;
// 			padding: 30px;
// 			box-shadow: 0 1px 3px rgba(26, 26, 26, 0.1);
// 			.login-ruleForm{
// 			}
// 			.login-btn{
// 				display: block;
// 				margin: 0 auto;
// 			}
// 		}
// 	}
// }

.login-container {
  min-width: 1000px;
  min-height: 450px;
  height: 100%;
  overflow-x: hidden;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: rgba(0, 0, 0, 0.3);
  position: relative;
  > footer {
    position: absolute;
    bottom: 40px;
    left: 0;
    height: 60px;
    width: 100%;
    text-align: center;
    text-shadow: 2px 2px 2px #999;
    color: #fff;
    > p {
      font-size: 12px;
    }
  }
}

.video_wrapper {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  > video {
    object-fit: cover;
    background-size: cover;
  }
}
.login-container::before {
  z-index: -999;
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-image: url('../assets/img/login/login.jpg');
  background-size: cover;
}

.login-info {
  z-index: 1;
  padding-left: 60px;
}

.login-info-title {
  line-height: 90px;
  display: flex;
  justify-content: flex-start;
  color: #fff;
}

.login-info-item {
  font-size: 14px;
  margin-bottom: 10px;
  display: flex;
  justify-content: flex-start;
  color: #fff;
}

.login-border {
  z-index: 1;
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 30px 40px 25px 40px;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 1px 1px 2px #eee;
}

.login-main {
  border-radius: 3px;
  box-sizing: border-box;
  background-color: #fff;
}

.login-main > h3 {
  margin-bottom: 20px;
}

.login-main > p {
  color: #76838f;
}

.login-title {
  margin: 0 0 20px;
  text-align: center;
  color: #f45d2f;
  letter-spacing: 3px;
}

.login-submit {
  margin-top: 20px;
  width: 100%;
  border-radius: 28px;
}

.login-form {
  margin: 10px 0;
  .el-form-item {
    margin-bottom: 22px;
    & /deep/ .el-form-item__content {
      width: 270px;
    }
  }
  .el-input {
    input {
      text-indent: 5px;
      border-color: #dcdcdc;
      border-radius: 3px;
    }
    .el-input__prefix {
      i {
        padding: 0 5px;
        font-size: 16px !important;
      }
    }
  }
}
</style>