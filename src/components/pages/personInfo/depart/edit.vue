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
            <el-form-item label="公司代码" prop="comId">
              <el-select v-model="butxt" placeholder="请选择公司代码" @focus="eventFocus1" :title="butxt"></el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="成本中心" prop="cskId">
              <el-select v-model="kostl" placeholder="请选择成本中心" @focus="eventFocus2" :title="kostl"></el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </content-item>
    </el-form>
    <!-- 公司代码弹框 -->
    <el-dialog title="公司代码" :visible.sync="dialogVisible1" width="800px">
      <top-bar>
        <section>
          <label>公司名称</label>
          <el-input v-model="searchContent1.butxt"></el-input>
        </section>
        <section>
          <label>城市</label>
          <el-input v-model="searchContent1.ort01"></el-input>
        </section>
        <section>
          <el-button type="primary" @click="eventSearch1" size="mini">{{$t('message.searchBtn')}}</el-button>
          <el-button @click="eventReset1" size="mini">{{$t('message.resetBtn')}}</el-button>
        </section>
      </top-bar>
      <table-bar>
        <el-table
          ref="table1"
          slot="table"
          border
          stripe
          :data="list1"
          style="width: 100%"
          @selection-change="handleSelectionChange1"
        >
          <el-table-column type="index" width="40" align="center"></el-table-column>
          <el-table-column type="selection" width="40" align="center"></el-table-column>
          <el-table-column prop="butxt" label="公司名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ktopl" label="账目表" show-overflow-tooltip></el-table-column>
          <el-table-column prop="curId" label="货币" show-overflow-tooltip></el-table-column>
          <el-table-column prop="land1" label="国家" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ort01" label="城市" show-overflow-tooltip></el-table-column>
          <el-table-column prop="bukrs" label="公司代码" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ktext" label="货币名称" show-overflow-tooltip></el-table-column>
        </el-table>
        <el-pagination
          slot="page"
          @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1"
          :current-page="curSearchContent1.pageNo"
          :page-sizes="[10, 20, 50]"
          :page-size="curSearchContent1.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total1"
        ></el-pagination>
      </table-bar>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="selectSure1" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 成本中心弹框 -->
    <el-dialog title="成本中心" :visible.sync="dialogVisible2" width="800px">
      <top-bar>
        <section>
          <label>成本中心</label>
          <el-input v-model="searchContent2.kostl"></el-input>
        </section>
        <section>
          <label>名称</label>
          <el-input v-model="searchContent2.ktext"></el-input>
        </section>
        <section>
          <el-button type="primary" @click="eventSearch2" size="mini">{{$t('message.searchBtn')}}</el-button>
          <el-button @click="eventReset2" size="mini">{{$t('message.resetBtn')}}</el-button>
        </section>
      </top-bar>
      <table-bar>
        <el-table
          ref="table2"
          slot="table"
          border
          stripe
          :data="list2"
          style="width: 100%"
          @selection-change="handleSelectionChange2"
        >
          <el-table-column type="index" width="40" align="center"></el-table-column>
          <el-table-column type="selection" width="40" align="center"></el-table-column>
          <el-table-column prop="kokrs" label="控制范围" show-overflow-tooltip></el-table-column>
          <el-table-column prop="kostl" label="成本中心" show-overflow-tooltip></el-table-column>
          <el-table-column prop="datab" label="开始日期" show-overflow-tooltip></el-table-column>
          <el-table-column prop="datbi" label="截止日期" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ktext" label="名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ltext" label="描述" show-overflow-tooltip></el-table-column>
          <el-table-column prop="comId" label="公司代码" show-overflow-tooltip></el-table-column>
          <el-table-column prop="kosar" label="成本中心类型" show-overflow-tooltip min-width="100px"></el-table-column>
          <el-table-column prop="gsber" label="业务范围" show-overflow-tooltip></el-table-column>
          <el-table-column prop="funcArea" label="功能范围" show-overflow-tooltip></el-table-column>
          <el-table-column prop="khinr" label="层次结构范围" show-overflow-tooltip min-width="100px"></el-table-column>
          <el-table-column prop="waers" label="货币码" show-overflow-tooltip></el-table-column>
          <el-table-column prop="prctr" label="利润中心" show-overflow-tooltip></el-table-column>
          <el-table-column prop="butxt" label="公司名称" show-overflow-tooltip></el-table-column>
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
  name: "departEdit",
  data() {
    return {
      pathArr: ["人事资料", "部门组织结构", "编辑部门"],
      loading: false,
      butxt: this.$route.query.row.butxt,
      kostl: this.$route.query.row.kostl,
      form: {
        id: this.$route.query.row.id,
        comId: this.$route.query.row.comId,
        cskId: this.$route.query.row.cskId
      },
      rules: {
        comId: [{ required: true, message: "请选择公司代码", trigger: "blur" }],
        cskId: [{ required: true, message: "请选择成本中心", trigger: "blur" }]
      },
      dialogVisible1: false,
      list1: [],
      searchContent1: {
        butxt: "",
        ort01: ""
      },
      curSearchContent1: {
        pageNo: 1, // （当前页）
        pageSize: 10 // 每页显示数量
      },
      total1: 0,
      selected1: [],
      dialogVisible2: false,
      list2: [],
      searchContent2: {
        kostl: "",
        ktext: ""
      },
      curSearchContent2: {
        pageNo: 1, // （当前页）
        pageSize: 10 // 每页显示数量
      },
      total2: 0,
      selected2: []
    };
  },
  mounted() {
    this.$nextTick(function() {});
  },
  methods: {
    handleSelectionChange1(val) {
      this.selected1 = val;
      if (val.length > 1) {
        this.$refs.table1.toggleRowSelection(val[0]);
      }
    },
    selectSure1() {
      this.form.comId = this.selected1[0].id;
      this.butxt = this.selected1[0].butxt;
      this.dialogVisible1 = false;
    },
    eventSearch1() {
      this.curSearchContent1.pageNo = 1;
      this.eventFocus1(1);
    },
    eventReset1() {
      this.curSearchContent1.pageNo = 1;
      this.searchContent1 = {
        butxt: "",
        ort01: ""
      };
      this.eventFocus1(1);
    },
    eventFocus1(bool) {
      this.dialogVisible1 = true;
      if (bool) Object.assign(this.curSearchContent1, this.searchContent1);
      this.$axios
        .get(
          `concur/gloConfig/curCompany/list?${this.$qs.stringify(
            this.curSearchContent1
          )}`
        )
        .then(res => {
          if (res && res.success) {
            this.list1 = res.result.records;
            this.total1 = res.result.total;
          }
        });
      Object.assign(this.searchContent1, this.curSearchContent1);
    },
    handleSizeChange1(val) {
      this.curSearchContent1.pageSize = val;
      this.eventFocus1();
    },
    handleCurrentChange1(val) {
      this.curSearchContent1.pageNo = val;
      this.eventFocus1();
    },

    handleSelectionChange2(val) {
      this.selected2 = val;
      if (val.length > 1) {
        this.$refs.table2.toggleRowSelection(val[0]);
      }
    },
    selectSure2() {
      this.form.cskId = this.selected2[0].id;
      this.kostl = this.selected2[0].kostl;
      this.dialogVisible2 = false;
    },
    eventSearch2() {
      this.curSearchContent2.pageNo = 1;
      this.eventFocus2(1);
    },
    eventReset2() {
      this.curSearchContent2.pageNo = 1;
      this.searchContent2 = {
        kostl: "",
        ktext: ""
      };
      this.eventFocus2(1);
    },
    eventFocus2(bool) {
      this.dialogVisible2 = true;
      if (bool) Object.assign(this.curSearchContent2, this.searchContent2);
      this.$axios
        .get(
          `concur/gloConfig/costSenter/list?${this.$qs.stringify(
            this.curSearchContent2
          )}`
        )
        .then(res => {
          if (res && res.success) {
            this.list2 = res.result.records;
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
            .put("/concur/hrinfo/department/edit", this.form)
            .then(res => {
              this.loading = false;
              if (res && res.success) {
                this.$router.replace("/depart");
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