<template>
  <content-bar
    v-loading="loading"
    footer
    :pathArr="pathArr"
    confirmButtonText="提交"
    @confirm="submit"
    @cancel="$router.go(-1)"
  >
    <table-bar>
      <div slot="top">
        <el-button type="success" @click="eventSave" size="mini">保存</el-button>
        <el-button type="primary" @click="eventAdd" size="mini">新增</el-button>
      </div>
      <el-table
        ref="table"
        slot="table"
        :span-method="objectSpanMethod"
        v-loading="loading"
        border
        stripe
        :data="tableList"
        style="width: 100%"
      >
        <el-table-column align="center" fixed="left" :label="$t('message.operate')" width="60">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="eventDel(scope.$index,scope.row)"
            >{{$t('message.deleteBtn')}}</el-button>
          </template>
        </el-table-column>
        <el-table-column type="index" width="40" align="center" fixed="left"></el-table-column>
        <el-table-column prop="deptName" label="部门名称" show-overflow-tooltip min-width="120px">
          <template slot-scope="{row}">
            <el-select v-model="row.deptName" @focus="eventFocus1"></el-select>
          </template>
        </el-table-column>
        <el-table-column prop="mainName" label="预算大类" show-overflow-tooltip min-width="120px">
          <template slot-scope="{row}">
            <el-select v-model="row.mainType">
              <el-option
                v-for="item in listMainType"
                :key="item.value"
                :label="item.value"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="budName" label="预算类型" show-overflow-tooltip min-width="120px">
          <template slot-scope="scope">
            <el-select v-model="scope.row.budName" @focus="eventFocus2(scope.$index,scope.row)"></el-select>
          </template>
        </el-table-column>
        <el-table-column prop="contype" label="管控方式" show-overflow-tooltip width="150px">
          <template slot-scope="scope">
            <el-cascader
              v-model="scope.row.contype"
              :props="{ emitPath: false }"
              :options="options"
              style="width:142px"
            ></el-cascader>
          </template>
        </el-table-column>
        <el-table-column prop="startDate" label="预算开始时间" show-overflow-tooltip width="150px">
          <template slot-scope="{row}">
            <el-date-picker
              v-model="row.startDate"
              type="date"
              value-format="yyyy-MM-dd"
              style="width:142px"
            ></el-date-picker>
          </template>
        </el-table-column>
        <el-table-column prop="endDate" label="预算结束时间" show-overflow-tooltip width="150px">
          <template slot-scope="{row}">
            <el-date-picker
              v-model="row.endDate"
              type="date"
              value-format="yyyy-MM-dd"
              style="width:142px"
            ></el-date-picker>
          </template>
        </el-table-column>
        <el-table-column prop="waers" label="货币码" show-overflow-tooltip min-width="120px">
          <template slot-scope="scope">
            <el-select v-model="scope.row.waers" @focus="eventFocus3(scope.$index,scope.row)"></el-select>
          </template>
        </el-table-column>
        <el-table-column prop="exrate" label="汇率" show-overflow-tooltip min-width="120px">
          <template slot-scope="{row}">
            <el-input v-model="row.exrate" disabled></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="预算总金额" show-overflow-tooltip min-width="120px">
          <template slot-scope="scope">
            <el-input v-model="scope.row.amount" @change="eventChange(scope.$index,scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="lamount" label="本币总金额" show-overflow-tooltip min-width="120px">
          <template slot-scope="{row}">
            <el-input v-model="row.lamount" disabled></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="isshare" label="是否分摊下级部门" show-overflow-tooltip min-width="120px">
          <template slot-scope="{row}">
            <el-select v-model="row.isshare" clearable>
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="2"></el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </table-bar>

    <!-- 部门树形弹框 -->
    <el-dialog title="部门组织结构" :visible.sync="dialogVisible1" width="800px">
      <top-bar>
        <section>
          <label>部门名称</label>
          <el-input v-model="searchContent1.deptname" clearable placeholder="请输入部门名称"></el-input>
        </section>
        <section>
          <label>部门负责人</label>
          <el-input v-model="searchContent1.memName" clearable placeholder="请输入部门负责人"></el-input>
        </section>
        <section>
          <el-button type="primary" @click="eventSearch1" size="mini">{{$t('message.searchBtn')}}</el-button>
          <el-button @click="eventReset1" size="mini">{{$t('message.resetBtn')}}</el-button>
        </section>
      </top-bar>
      <el-table
        class="filter-tree"
        :data="list1"
        ref="table1"
        row-key="id"
        border
        stripe
        :tree-props="{children: 'children'}"
        @selection-change="handleSelectionChange1"
      >
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column prop="deptname" label="部门名称" min-width="200px" show-overflow-tooltip></el-table-column>
        <el-table-column prop="deptLv" label="部门层级" show-overflow-tooltip></el-table-column>
        <el-table-column prop="isend" label="是否末级部门" show-overflow-tooltip min-width="100px">
          <template slot-scope="{row}">
            <span v-if="row.isend==='1'">是</span>
            <span v-if="row.isend==='0'">否</span>
          </template>
        </el-table-column>
        <el-table-column prop="butxt" label="公司名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="bukrs" label="公司代码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="kostl" label="成本中心" show-overflow-tooltip></el-table-column>
        <el-table-column prop="memName" label="部门负责人" show-overflow-tooltip></el-table-column>
      </el-table>
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
        <el-button @click="dialogVisible1 = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="selectSure1" size="mini">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 预算类型弹框 -->
    <el-dialog title="预算类型" :visible.sync="dialogVisible2" width="800px">
      <top-bar>
        <section>
          <label>类型名称</label>
          <el-input v-model="searchContent2.budName" clearable placeholder="请输入"></el-input>
        </section>
        <section>
          <el-button type="primary" @click="eventSearch2" size="mini">{{$t('message.searchBtn')}}</el-button>
          <el-button @click="eventReset2" size="mini">{{$t('message.resetBtn')}}</el-button>
        </section>
      </top-bar>
      <el-table
        class="filter-tree"
        :data="list2"
        ref="table2"
        row-key="id"
        border
        stripe
        :tree-props="{children: 'children'}"
        @selection-change="handleSelectionChange2"
      >
        <el-table-column type="selection" width="40" align="center"></el-table-column>
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
        <el-table-column prop="txt50" label="总帐科目名称" show-overflow-tooltip min-width="100px"></el-table-column>
        <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
      </el-table>
      <el-pagination
        style="margin-top:10px;"
        small
        @size-change="handleSizeChange2"
        @current-change="handleCurrentChange2"
        :current-page="curSearchContent2.pageNo"
        :page-sizes="[10, 20, 50]"
        :page-size="curSearchContent2.pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total2"
      ></el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="selectSure2" size="mini">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 货币码弹框 -->
    <el-dialog title="货币码" :visible.sync="dialogVisible3" width="800px">
      <top-bar>
        <section>
          <label>货币码</label>
          <el-input v-model="searchContent3.waers"></el-input>
        </section>
        <section>
          <label>货币名称</label>
          <el-input v-model="searchContent3.ktext"></el-input>
        </section>
        <section>
          <el-button type="primary" @click="eventSearch3" size="mini">{{$t('message.searchBtn')}}</el-button>
          <el-button @click="eventReset3" size="mini">{{$t('message.resetBtn')}}</el-button>
        </section>
      </top-bar>
      <el-table
        ref="table3"
        border
        stripe
        :data="list3"
        style="width: 100%"
        @selection-change="handleSelectionChange3"
      >
        <el-table-column type="index" width="40" align="center"></el-table-column>
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column prop="waers" label="货币码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ktext" label="货币名称" show-overflow-tooltip></el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange3"
        @current-change="handleCurrentChange3"
        :current-page="curSearchContent3.pageNo"
        :page-sizes="[10, 20, 50]"
        :page-size="curSearchContent3.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total3"
      ></el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible3 = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="selectSure3" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </content-bar>
</template>

<script>
export default {
  name: "myBudgetAppAdd",
  data() {
    return {
      isLastOne: false,
      options: [
        {
          value: "1",
          label: "月度",
          children: [
            { value: "1-1", label: "01月" },
            { value: "1-2", label: "02月" },
            { value: "1-3", label: "03月" },
            { value: "1-4", label: "04月" },
            { value: "1-5", label: "05月" },
            { value: "1-6", label: "06月" },
            { value: "1-7", label: "07月" },
            { value: "1-8", label: "08月" },
            { value: "1-9", label: "09月" },
            { value: "1-10", label: "10月" },
            { value: "1-11", label: "11月" },
            { value: "1-12", label: "12月" }
          ]
        },
        {
          value: "2",
          label: "季度",
          children: [
            { value: "2-1", label: "第1季度" },
            { value: "2-2", label: "第2季度" },
            { value: "2-3", label: "第3季度" },
            { value: "2-4", label: "第4季度" }
          ]
        },
        {
          value: "3",
          label: "年度"
        }
      ],
      pathArr: ["预算管理", "预算申请", "新增预算申请"],
      loading: false,
      tableList: [{}],
      listMainType: [],
      index: 0,

      dialogVisible1: false,
      list1: [],
      searchContent1: {
        deptname: "",
        memName: ""
      },
      curSearchContent1: {
        pageNo: 1, // （当前页）
        pageSize: 10 // 每页显示数量
      },
      total1: 0, // 总条数
      selected1: [],

      dialogVisible2: false,
      list2: [],
      searchContent2: {
        budName: "",
        mainType: ""
      },
      curSearchContent2: {
        pageNo: 1, // （当前页）
        pageSize: 10 // 每页显示数量
      },
      total2: 0, // 总条数
      selected2: [],

      dialogVisible3: false,
      list3: [],
      searchContent3: {
        waers: "",
        ktext: ""
      },
      curSearchContent3: {
        pageNo: 1, // （当前页）
        pageSize: 10 // 每页显示数量
      },
      total3: 0, // 总条数
      selected3: []
    };
  },
  mounted() {
    this.$nextTick(function() {
      this.getMainType();
    });
  },
  methods: {
    eventChange(index, row) {
      this.index = index;
      if (!row.exrate) {
        this.$messageAlert.warning("请先选择货币码");
        row.amount = "";
        return;
      }
      const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      if (!reg.test(row.amount)) {
        this.$messageAlert.warning("预算总金额输入不正确");
        row.amount = "";
      } else {
        this.tableList.forEach((item, index) => {
          if (index == this.index) {
            this.$set(item, "lamount", row.amount * row.exrate);
          }
        });
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 2) {
        if (rowIndex === 0) {
          return {
            rowspan: this.tableList.length,
            colspan: 1
          };
        } else {
          return {
            rowspan: this.tableList.length,
            colspan: 0
          };
        }
      }
    },
    eventAdd() {
      if(this.tableList.length>0) {
        if (this.tableList[0].deptName) {
          this.tableList.unshift({deptName: this.tableList[0].deptName, deptId: this.tableList[0].deptId});
        } else {
          this.tableList.unshift({});
        }
      } else {
        this.tableList.unshift({});
      }
    },
    // 保存
    eventSave() {
      this.loading = true;
      // this.tableList.forEach(item =>{
      //   item.applyStatus = 0;
      // })
      this.$axios
        .post(
          "/concur/budget/budgetApply/add",
          this.tableList, { arrayFormat: "repeat" }
        )
        .then(res => {
          this.loading = false;
          if (res && res.success) {
            this.$messageAlert.success(res.message);
          }
        });
    },
    eventDel(index, row) {
      this.tableList.splice(index, 1);
    },

    handleSelectionChange1(val) {
      this.selected1 = val;
      if (val.length > 1) {
        this.$refs.table1.toggleRowSelection(val[0]);
      }
    },
    selectSure1() {
      this.dialogVisible1 = false;
      this.tableList.forEach(item => {
        this.$set(item, "deptName", this.selected1[0].deptname);
        this.$set(item, "deptId", this.selected1[0].id);
      });
    },
    eventSearch1() {
      this.curSearchContent1.pageNo = 1;
      this.eventFocus1();
    },
    eventReset1() {
      this.curSearchContent1.pageNo = 1;
      this.searchContent1 = {
        deptname: "",
        memName: ""
      };
      this.eventFocus1();
    },
    handleSizeChange1(val) {
      this.curSearchContent1.pageSize = val;
      this.eventFocus1();
    },
    handleCurrentChange1(val) {
      this.curSearchContent1.pageNo = val;
      this.eventFocus1();
    },
    eventFocus1() {
      this.dialogVisible1 = true;
      Object.assign(this.curSearchContent1, this.searchContent1);
      this.$axios
        .get(
          `/concur/hrinfo/department/treelist?${this.$qs.stringify(
            this.curSearchContent1
          )}`
        )
        .then(res => {
          if (res && res.success) {
            this.list1 = res.result;
            this.total1 = res.total;
          }
        });
    },

    handleSelectionChange2(val) {
      this.selected2 = val;
      if (val.length > 1) {
        this.$refs.table2.toggleRowSelection(val[0]);
      }
    },
    selectSure2() {
      this.dialogVisible2 = false;
      this.tableList.forEach((item, index) => {
        if (index === this.index) {
          this.$set(item, "budName", this.selected2[0].budName);
          this.$set(item, "budtypeId", this.selected2[0].id);
        }
      });
    },
    eventSearch2() {
      this.curSearchContent2.pageNo = 1;
      this.eventFocus2(this.index, this.searchContent2);
    },
    eventReset2() {
      this.curSearchContent2.pageNo = 1;
      this.searchContent2 = {
        budName: ""
      };
      this.eventFocus2(this.index, this.searchContent2);
    },
    handleSizeChange2(val) {
      this.curSearchContent2.pageSize = val;
      this.eventFocus2(this.index, this.searchContent2);
    },
    handleCurrentChange2(val) {
      this.curSearchContent2.pageNo = val;
      this.eventFocus2(this.index, this.searchContent2);
    },
    eventFocus2(index, row) {
      this.index = index;
      if (row.mainType) {
        this.dialogVisible2 = true;
        this.searchContent2.mainType = row.mainType;
        Object.assign(this.curSearchContent2, this.searchContent2);
        this.$axios
          .get(
            `/concur/budget/budgetType/treelist?${this.$qs.stringify(
              this.curSearchContent2
            )}`
          )
          .then(res => {
            if (res && res.success) {
              this.list2 = res.result;
              this.total2 = res.total;
            }
          });
      } else {
        this.$messageAlert.warning("请先选择预算大类");
      }
    },

    handleSelectionChange3(val) {
      this.selected3 = val;
      if (val.length > 1) {
        this.$refs.table3.toggleRowSelection(val[0]);
      }
    },
    selectSure3() {
      this.dialogVisible3 = false;
      console.log(this.index)
      this.$axios
        .get(
          `/concur/budget/budgetApply/exRate?${this.$qs.stringify({
            curId: this.selected3[0].id
          })}`
        )
        .then(res => {
          if (res && res.success) {
            this.tableList.forEach((item, index) => {
              console.log(index)
              if (index === this.index) {
                this.$set(item, "waers", this.selected3[0].waers);
                this.$set(item, "curId", this.selected3[0].id);
                this.$set(item, "exrate", res.result);
              }
            });
          }
        });
    },
    eventSearch3() {
      this.curSearchContent3.pageNo = 1;
      this.eventFocus3(this.index);
    },
    eventReset3() {
      this.curSearchContent3.pageNo = 1;
      this.searchContent3 = {
        waers: "",
        ktext: ""
      };
      this.eventFocus3(this.index);
    },
    handleSizeChange3(val) {
      this.curSearchContent3.pageSize = val;
      this.eventFocus3(this.index);
    },
    handleCurrentChange3(val) {
      this.curSearchContent3.pageNo = val;
      this.eventFocus3(this.index);
    },
    eventFocus3(index, row) {
      this.index = index;
      console.log(this.index)
      this.dialogVisible3 = true;
      Object.assign(this.curSearchContent3, this.searchContent3);
      this.$axios
        .get(
          `concur/gloConfig/curCurrency/list?${this.$qs.stringify(
            this.curSearchContent3
          )}`
        )
        .then(res => {
          if (res && res.success) {
            this.list3 = res.result.records;
            this.total3 = res.result.total;
          }
        });
    },
    getMainType() {
      this.$axios.get("/concur/budget/budgetType/getMainType").then(res => {
        if (res && res.success) {
          this.listMainType = res.result;
        }
      });
    },
    submit() {
      this.loading = true;
      for (let index = 0; index < this.tableList.length; index++) {
        if (
          this.tableList[index].deptId == undefined ||
          this.tableList[index].mainType == undefined ||
          this.tableList[index].budtypeId == undefined ||
          this.tableList[index].contype == undefined ||
          this.tableList[index].startDate == undefined ||
          this.tableList[index].endDate == undefined ||
          this.tableList[index].curId == undefined ||
          this.tableList[index].exrate == undefined ||
          this.tableList[index].amount == undefined ||
          this.tableList[index].lamount == undefined ||
          this.tableList[index].isshare == undefined
        ) {
          this.$messageAlert.warning("您还有选项没有填");
          this.loading = false;
          break;
        } else {
          // this.tableList[index].applyStatus = 1;
          if (index == this.tableList.length - 1) {
            this.$axios
              .put("/concur/budget/budgetApply/submit", this.tableList, {
                arrayFormat: "repeat"
              })
              .then(res => {
                this.loading = false;
                if (res && res.success) {
                  this.$router.replace("/myBudgetApp");
                  this.$messageAlert.success(res.message);
                }
              });
          }
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>