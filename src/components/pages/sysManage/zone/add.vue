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
            <el-form-item label="地区编号" prop="rnumber">
              <el-input v-model="form.rnumber"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="地区名称" prop="rname">
              <el-input v-model="form.rname"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item label="上层编码" prop="parentId">
              <el-input v-model="form.parentId"></el-input>
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="地区类型" prop="rtype">
              <el-select v-model="form.rtype" clearable>
                <el-option label="海外一类区域" value="1"></el-option>
                <el-option label="海外二类区域" value="2"></el-option>
                <el-option label="海外三类区域" value="3"></el-option>
                <el-option label="一线城市" value="4"></el-option>
                <el-option label="二线城市" value="5"></el-option>
                <el-option label="省会城市" value="6"></el-option>
                <el-option label="其他城市" value="7"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否海外" prop="isOut">
              <el-select v-model="form.isOut" clearable>
                <el-option label="海外" value="1"></el-option>
                <el-option label="国内" value="0"></el-option>
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
  name: "zoneAdd",
  data() {
    return {
      pathArr: ["系统管理", "地区区域", "新增地区"],
      loading: false,
      form: {
        rnumber: "",
        rname: "",
        parentId: "",
        rtype: "",
        isOut: "",
      },
      rules: {
        rnumber: [{ required: true, message: "请输入地区编码", trigger: "blur" }],
        rname: [{ required: true, message: "请输入地区名称", trigger: "blur" }],
        rtype: [{ required: true, message: "请选择地区类型", trigger: "change" }],
        isOut: [{ required: true, message: "请选择是否海外", trigger: "change" }],
      }
    };
  },
  mounted() {
    this.$nextTick(function() {
      if (this.$route.query.row) {
        this.form.parentId = this.$route.query.row.id;
      } else {
        this.form.parentId = 0;
      }
    });
  },
  methods: {
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$axios.post("/concur/gloConfig/region/add", this.form).then(res => {
            this.loading = false;
            if (res && res.success) {
              this.$router.replace("/zone");
              this.$messageAlert.success(res.message);
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