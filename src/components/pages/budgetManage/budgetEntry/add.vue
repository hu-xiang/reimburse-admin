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
            <el-form-item label="部门名称" prop="deptId">
              <el-input v-model="deptName" @focus="eventFocus"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="预算类型" prop="budtypeId">
              <el-input v-model="budTypeName" @focus="eventFocus1"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="预算大类" prop="mainType">
              <el-select v-model="form.mainType" clearable>
                <el-option label="费用类" value="费用类"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="货币码" prop="curId">
              <el-input v-model="waers" @focus="eventFocus2"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="汇率" prop="exrate">
              <el-input v-model="form.exrate"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="管控方式" prop="contype">
              <el-select v-model="form.contype" clearable>
                <el-option label="月度" :value="1"></el-option>
                <el-option label="季度" :value="2"></el-option>
                <el-option label="年度" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="预算总金额" prop="amount">
              <el-input v-model="form.amount"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="本币总金额" prop="lamount">
              <el-input v-model="form.lamount"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分摊下级部门" prop="isshare">
              <el-select v-model="form.isshare" clearable>
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="预算开始时间" prop="startDate">
              <el-date-picker
                v-model="form.startDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择预算开始时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="预算结束时间" prop="endDate">
              <el-date-picker
                v-model="form.endDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择预算结束时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </content-item>
    </el-form>
    <!-- 部门树形弹框 -->
    <el-dialog title="部门组织结构" :visible.sync="dialogVisible" width="500px">
      <el-input
        v-model="deptname"
        clearable
        placeholder="请输入关键字进行过滤"
        style="width:300px;margin-right:10px;"
      ></el-input>
      <el-button type="primary" @click="eventSearchDep" size="mini">{{$t('message.searchBtn')}}</el-button>
      <el-button @click="eventResetDep" size="mini">{{$t('message.resetBtn')}}</el-button>
      <el-tree
        class="filter-tree"
        :data="list"
        show-checkbox
        :props="listProps"
        :filter-node-method="filterNode"
        :check-strictly="true"
        ref="depTree"
        node-key="id"
        @check="checkDept"
      ></el-tree>
      <el-pagination
        style="margin-top:10px;"
        small
        @size-change="handleSizeChange1"
        @current-change="handleCurrentChange1"
        :current-page="curSearchContent1.pageNo"
        :page-sizes="[10, 20, 50]"
        :page-size="curSearchContent1.pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total1"
      ></el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="selectSure" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 预算类型树形弹框 -->
    <el-dialog title="预算类型" :visible.sync="dialogVisible1" width="500px">
      <el-input
        v-model="budName"
        clearable
        placeholder="请输入关键字进行过滤"
        style="width:300px;margin-right:10px;"
      ></el-input>
      <el-button type="primary" @click="eventSearchType" size="mini">{{$t('message.searchBtn')}}</el-button>
      <el-button @click="eventResetType" size="mini">{{$t('message.resetBtn')}}</el-button>
      <el-tree
        class="filter-tree"
        :default-expand-all="true"
        :data="list1"
        show-checkbox
        :props="listProps1"
        :filter-node-method="filterNode1"
        :check-strictly="true"
        ref="budTypeTree"
        node-key="id"
        @check="checkType"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="selectSure1" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 货币码弹框 -->
    <el-dialog title="货币码" :visible.sync="dialogVisible2" width="800px">
      <top-bar>
        <section>
          <label>货币码</label>
          <el-input v-model="searchContent2.waers"></el-input>
        </section>
        <section>
          <el-button type="primary" @click="eventSearchCode" size="mini">{{$t('message.searchBtn')}}</el-button>
          <el-button @click="eventResetCode" size="mini">{{$t('message.resetBtn')}}</el-button>
        </section>
      </top-bar>
      <table-bar>
        <el-table ref="codeTable" slot="table" border stripe :data="curCurrencyTableList" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="40" align="center"></el-table-column>

          <el-table-column prop="waers" label="货币码" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ktext" label="货币名称" show-overflow-tooltip></el-table-column>
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
import { log } from 'util';
export default {
  name: "budAppAdd",
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
        callback("请输入汇率");
      }
    };
    const checkdAmount = (rule, value, callback) => {
      const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      if (value) {
        if (reg.test(value)) {
          callback();
        } else {
          callback("预算总金额输入不正确");
        }
      } else {
        callback("请输入预算总金额");
      }
    };
    const checkdLamount = (rule, value, callback) => {
      const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      if (value) {
        if (reg.test(value)) {
          callback();
        } else {
          callback("本币总金额输入不正确");
        }
      } else {
        callback("请输入本币总金额");
      }
    };
    return {
      pathArr: ["预算管理", "预算申请", "新增预算申请"],
      deptName: "",
      budTypeName: "",
      loading: false,
      form: {
        deptId: "",
        mainType: "",
        budtypeId: "",
        contype: "",
        startDate: "",
        endDate: "",
        curId: "",
        exrate: "",
        amount: "",
        lamount: "",
        isshare: ""
      },
      rules: {
        mainType: [
          { required: true, message: "请选择预算大类", trigger: "change" }
        ],
        budtypeId: [
          { required: true, message: "请选择预算类型", trigger: "change" }
        ],
        contype: [
          { required: true, message: "请选择管控方式", trigger: "change" }
        ],
        isshare: [
          {
            required: true,
            message: "请选择是否分摊下级部门",
            trigger: "change"
          }
        ],
        curId: [{ required: true, message: "请选择货币码", trigger: "change" }],
        exrate: [{ required: true, validator: checkdExrate, trigger: "blur" }],
        amount: [{ required: true, validator: checkdAmount, trigger: "blur" }],
        lamount: [
          { required: true, validator: checkdLamount, trigger: "blur" }
        ],
        startDate: [
          { required: true, message: "请选择预算开始时间", trigger: "change" }
        ],
        endDate: [
          { required: true, message: "请选择预算结束时间", trigger: "change" }
        ],
        deptId: [{ required: true, message: "请选择部门", trigger: "change" }],
      },
      dialogVisible: false,
      list: [],
      listProps: {
        children: "children",
        label: "deptname"
      },
      deptname: "",
      budName: "",
      dialogVisible1: false,
      list1: [],
      listProps1: {
        children: "children",
        label: "budName"
      },
      dialogVisible2: false,
      curCurrencyTableList: [],
      searchContent2: {
        waers: ""
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
    this.$nextTick(function() {});
  },
  methods: {
    handleSelectionChange(val) {
      this.selectedCode = val;
      if(val.length>1) {
        this.$refs.codeTable.toggleRowSelection(val[0]);
      }
      
    },
    selectSure2() {
      this.form.curId = this.selectedCode[0].id;
      this.waers = this.selectedCode[0].waers;
      this.dialogVisible2 = false;
    },
    eventSearchCode() {
      this.curSearchContent2.pageNo = 1;
      this.eventFocus2(1);
    },
    eventResetCode() {
      this.curSearchContent2.pageNo = 1;
      this.searchContent2 = {
        waers: ""
      };
      this.eventFocus2(1);
    },
    eventFocus2(bool) {
      this.dialogVisible2 = true;
      //if (bool) Object.assign(this.curSearchContent2, this.searchContent2);
      if (bool) {
        this.curSearchContent2.waers = this.searchContent2.waers
      }
      this.$axios
        .get(
          `concur/gloConfig/curCurrency/list?${this.$qs.stringify(
            this.curSearchContent2
          )}`
        )
        .then(res => {
          if (res && res.success) {
            this.curCurrencyTableList = res.result.records;
            this.total2 = res.result.total;
          }
        });
      Object.assign(this.searchContent2, this.curSearchContent2);
    },
    handleSizeChange2(val) {
      this.curSearchContent2.pageSize = val;
      this.eventFocus2(1);
    },
    handleCurrentChange2(val) {
      this.curSearchContent2.pageNo = val;
      this.eventFocus2(1);
    },
    handleSizeChange1(val) {
      this.curSearchContent1.pageSize = val;
      this.eventFocus();
    },
    handleCurrentChange1(val) {
      this.curSearchContent1.pageNo = val;
      this.eventFocus();
    },
    checkDept(value, data) {
      if (data.checkedNodes.length > 1) {
        this.$message.warning("只能选择一个部门");
        this.$refs.depTree.setChecked(value, false);
      }
    },
    checkType(value, data) {
      if (data.checkedNodes.length > 1) {
        this.$message.warning("只能选择一个预算类型");
        this.$refs.budTypeTree.setChecked(value, false);
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.deptname.indexOf(value) > -1;
    },
    filterNode1(value, data) {
      if (!value) return true;
      return data.budName.indexOf(value) > -1;
    },
    eventSearchDep() {
      this.$refs.depTree.filter(this.deptname);
    },
    eventResetDep() {
      this.deptname = "";
      this.$refs.depTree.filter(this.deptname);
    },
    eventSearchType() {
      this.$refs.budTypeTree.filter(this.budName);
    },
    eventResetType() {
      this.budName = "";
      this.$refs.budTypeTree.filter(this.budName);
    },
    eventFocus() {
      this.dialogVisible = true;
      this.$axios.get(`/concur/hrinfo/department/treelist?${this.$qs.stringify(
            this.curSearchContent1
          )}`).then(res => {
        if (res && res.success) {
          this.list = res.result;
          this.total1 = res.total;
        }
      });
    },
    selectSure() {
      const list = this.$refs.depTree.getCheckedNodes();
      if (list.length > 0) {
        this.form.deptId = list[0].id;
        this.deptName = list[0].deptname;
      }
      this.dialogVisible = false;
    },
    eventFocus1() {
      this.dialogVisible1 = true;
      this.$axios.get("/concur/budget/budgetType/treelist").then(res => {
        if (res && res.success) {
          this.list1 = res.result;
        }
      });
    },
    selectSure1() {
      const list = this.$refs.budTypeTree.getCheckedNodes();
      if (list.length > 0) {
        this.form.budtypeId = list[0].id;
        this.budTypeName = list[0].budName;
      }
      this.dialogVisible1 = false;
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$axios
            .post("/concur/budget/budgetApply/add", this.form)
            .then(res => {
              this.loading = false;
              if (res && res.success) {
                this.$router.replace("/budgetEntry");
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
.el-tree {
  margin-top: 20px;
}
</style>