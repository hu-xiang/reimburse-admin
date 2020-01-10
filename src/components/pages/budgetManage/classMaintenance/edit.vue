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
      <content-item title="基本信息" min-width="1100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="预算类型名称" prop="budName">
              <el-input v-model="form.budName" placeholder="请输入预算类型名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="默认税率" prop="taxrate">
              <el-input v-model="form.taxrate" placeholder="请输入默认税率"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总帐科目名称" prop="accId">
              <el-select v-model="txt50" @focus="eventFocus2" placeholder="请选择总帐科目">
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="是否为交通费" prop="istran">
              <el-select v-model="form.istran" clearable>
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否有效" prop="status">
              <el-select v-model="form.status" clearable>
                <el-option label="有效" value="1"></el-option>
                <el-option label="失效" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否为补贴" prop="issubsidy">
              <el-select v-model="form.issubsidy" clearable>
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="16">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入备注" type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </content-item>
    </el-form>
    <!-- 货币码弹框 -->
    <el-dialog title="货币码" :visible.sync="dialogVisible2" width="800px">
      <top-bar>
        <section>
        <label>科目编码</label>
        <el-input v-model="searchContent2.saknr"></el-input>
      </section>
      <section>
        <label>总帐科目名称</label>
        <el-input v-model="searchContent2.txt50"></el-input>
      </section>
        <section>
          <el-button type="primary" @click="eventSearchCode" size="mini">{{$t('message.searchBtn')}}</el-button>
          <el-button @click="eventResetCode" size="mini">{{$t('message.resetBtn')}}</el-button>
        </section>
      </top-bar>
      <table-bar>
        <el-table ref="codeTable" slot="table" border stripe :data="accountSubjectTableList" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="index" width="40" align="center"></el-table-column>
          <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column prop="ktopl" label="帐目表" show-overflow-tooltip></el-table-column>
        <el-table-column prop="saknr" label="科目编码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="txt50" label="总帐科目名称" show-overflow-tooltip min-width="100px"></el-table-column>
        <el-table-column prop="xbilk" label="资产负债表科目" show-overflow-tooltip min-width="100px"></el-table-column>
        <el-table-column prop="bilkt" label="组科目号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="gvtyp" label="损益表科目" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ktoks" label="组科目号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="xloev" label="删除标记" show-overflow-tooltip></el-table-column>
        <el-table-column prop="xspeb" label="冻结标记" show-overflow-tooltip></el-table-column>
        </el-table>
        <el-pagination
          slot="page"
          @size-change="handleSizeChange2"
          @current-change="handleCurrentChange2"
          :current-page="curSearchContent2.pageNo"
          :page-sizes="[10, 20, 50]"
          :page-size="curSearchContent2.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total2"
        ></el-pagination>
      </table-bar>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="selectSure2" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </content-bar>
</template>

<script>
export default {
  name: "classMaintenanceEdit",
  data() {
    const checkdExrate = (rule, value, callback) => {
      const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      if (value) {
        if (reg.test(value)) {
          callback();
        } else {
          callback("汇率输入不正确");
        }
      } else {
        callback();
      }
    };
    return {
      pathArr: ["预算管理", "预算类型", "新增预算类型"],
      loading: false,
      txt50: this.$route.query.row.txt50,
      form: {
        id: this.$route.query.row.id,
        mainType: this.$route.query.row.mainType,
        budName: this.$route.query.row.budName,
        istran: this.$route.query.row.istran,
        status: this.$route.query.row.status,
        issubsidy: this.$route.query.row.issubsidy,
        taxrate: this.$route.query.row.taxrate,
        accId: this.$route.query.row.accId,
        remark: this.$route.query.row.remark,
      },
      rules: {
        budName: [
          { required: true, message: "请输入预算类型名称", trigger: "blur" }
        ],
        taxrate: [{ required: false, validator: checkdExrate, trigger: "blur" }],
      },
      dialogVisible2: false,
      accountSubjectTableList: [],
      searchContent2: {
        saknr: "",
        txt50: ""
      },
      curSearchContent2: {
        pageNo: 1, // 当前页
        pageSize: 10 // 每页显示数量
      },
      total2: 0,// 总条数
      selectedCode: [],
      curSearchContent1: {
        pageNo: 1, // （当前页）
        pageSize: 10 // 每页显示数量
      },
      total1: 0, // 总条数
      waers: '',
    };
  },
  mounted() {
    this.$nextTick(function() {
    });
  },
  methods: {
    handleSelectionChange(val) {
      this.selectedCode = val;
      if(val.length>1) {
        this.$refs.codeTable.toggleRowSelection(val[0]);
      }
      
    },
    selectSure2() {
      this.form.accId = this.selectedCode[0].id;
      this.txt50 = this.selectedCode[0].txt50;
      this.dialogVisible2 = false;
    },
    eventSearchCode() {
      this.curSearchContent2.pageNo = 1;
      this.eventFocus2(1);
    },
    eventResetCode() {
      this.curSearchContent2.pageNo = 1;
      this.searchContent2 = {
        saknr: "",
        txt50: ""
      };
      this.eventFocus2(1);
    },
    eventFocus2(bool) {
      this.dialogVisible2 = true;
      if (bool) Object.assign(this.curSearchContent2, this.searchContent2);
      this.$axios
        .get(
          `concur/gloConfig/accountSubject/list?${this.$qs.stringify(
            this.curSearchContent2
          )}`
        )
        .then(res => {
          if (res && res.success) {
            this.accountSubjectTableList = res.result.records;
            this.total2 = res.result.total;
          }
        });
      Object.assign(this.searchContent2, this.curSearchContent2);
    },
    handleSizeChange2(val) {
      this.curSearchContent2.pageSize = val;
      this.eventFocus2();
    },
    handleCurrentChange2(val) {
      this.curSearchContent2.pageNo = val;
      this.eventFocus2();
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$axios
            .put("/concur/budget/budgetType/edit", this.form)
            .then(res => {
              this.loading = false;
              if (res && res.success) {
                this.$router.replace("/classMaintenance");
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