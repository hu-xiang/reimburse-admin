<template>
    <content-bar v-loading="loading"
    footer
    :pathArr="pathArr"
    confirmButtonText="提交"
    @confirm="submit"
    @cancel="$router.go(-1)">
    <el-form :model="form"
      ref="form"
      :rules="rules"
      label-width="150px">
      <content-item title="基本信息"
        width="1100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="角色名称"
              prop="roleName">
              <el-input v-model="form.roleName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="角色编码"
              prop="roleCode">
              <el-input v-model="form.roleCode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="描述"
              prop="remark">
              <el-input placeholder="请输入描述"
                type="textarea"
                v-model="form.description">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </content-item>
      <content-item title="分配权限"
        width="1100px">
        <el-row>
          <el-col :span="16">
            <el-form-item label="功能菜单"
              prop="resourceCodes">
              <el-tree ref="resTree" class="treeClass"
                :data="treeList"
                show-checkbox
                :default-expand-all="false"
                :default-checked-keys="defaultCheckedKeys"
                :props="defaultProps"
                :filter-node-method="filterNode"
                @check-change="handleCheckChange"
                node-key="path">
                <div slot-scope="{ node, data }"
                  placement="right"
                  trigger="hover"
                  effect="light">
                    <span class="node-name">{{ data.name}}</span>
                </div>
              </el-tree>
            </el-form-item>
          </el-col>
        </el-row>
      </content-item>
    </el-form>
  </content-bar>
</template>

<script>
    export default {
        name: 'roleAdd',
        data (){
            return {
                pathArr: ['人事资料', '角色管理', '新增角色'],
                loading: false,
                form: {
                    roleName: '',
                    roleCode: '',
                    description: '',
                    resourceCodes: [],
                },
                defaultProps: {
                    children: 'children',
                    label: 'path',
                },
                treeList: [
                    {
                        path: "/workBench",
                        name: "工作台",
                        children:[
                            {path: "/myApplication", name: "我的申请"},
                            {path: "/myApproval", name: "我的审批"},
                            {path: "/approvalQuery", name: "审批查询"},
                            {path: "/news", name: "消息公告"},
                        ]
                    },
                    {
                        path: "/travelApply",
                        name: "出差申请",
                        children:[
                            {path: "/travelEntry", name: "出差申请录入"},
                            {path: "/travelQuery", name: "出差申请查询"},
                        ]
                    },
                    {
                        path: "/reimbursement",
                        name: "费用报销",
                        children:[
                            {path: "/feeEntry", name: "费用报销录入"},
                            {path: "/feeQuery", name: "费用报销查询"},
                        ]
                    },
                    {
                        path: "/budgetManage",
                        name: "预算管理",
                        children:[
                            {path: "/budgetEntry", name: "预算录入"},
                            {path: "/budgetChange", name: "预算调整"},
                            {path: "/budgetApproval", name: "预算审批"},
                            {path: "/rightSetting", name: "审批签权设定"},
                            {path: "/transSetting", name: "出差交通费设定"},
                            {path: "/subsidySetting", name: "出差补助设定"},
                            {path: "/liveSetting", name: "出差住宿费设定"},
                            {path: "/classMaintenance", name: "预算类别维护"},
                        ]
                    },
                    {
                        path: "/reportAnalysis",
                        name: "报表分析",
                        children:[
                            {path: "/budget", name: "预算执行状况"},
                            {path: "/fee", name: "费用报销明细"},
                            {path: "/travel", name: "出差申请明细"},
                        ]
                    },
                    {
                        path: "/personInfo",
                        name: "人事资料",
                        children:[
                            {path: "/userInfo", name: "人员信息"},
                            {path: "/depart", name: "部门组织结构"},
                            {path: "/rank", name: "职级维护"},
                            {path: "/position", name: "岗位维护"},
                            {
                                path: "/role",
                                name: "角色管理",
                                children:[
                                    {path: "/role", name: "角色列表"},
                                    {path: "/roleAdd", name: "新增角色"},
                                    {path: "/roleEdit", name: "编辑角色"},
                                ]
                            },
                        ]
                    },
                    {
                        path: "/sysManage",
                        name: "系统管理",
                        children:[
                            {path: "/globalData", name: "系统全局参数设定"},
                            {path: "/comCode", name: "公司代码维护"},
                            {path: "/accountSubject", name: "会计科目维护"},
                            {path: "/costCenter", name: "成本中心维护"},
                            {path: "/zone", name: "地区区域维护"},
                        ]
                    },
                ],
                filterText: '',
                defaultCheckedKeys: [],
                rules: {
                    roleName: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' },
                    ],
                    roleCode: [
                    { required: true, message: '请输入角色编码', trigger: 'blur' },
                    ],
                    resourceCodes: [
                    { required: true, message: '请选择功能菜单', trigger: 'change' },
                    ],
                },
            }
        },
        mounted() {
            console.log(this.$router)
			this.$nextTick(function() {
                
            });
        },
        methods: {
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            handleCheckChange() {
                const list = this.$refs.resTree.getCheckedKeys();
                const listHal = this.$refs.resTree.getHalfCheckedKeys();
                this.form.resourceCodes = list.concat(listHal);
                console.log(this.form.resourceCodes);
            },
            submit() {

            },
        }
    }
</script>

<style lang="scss" scoped>
    .treeClass {
        line-height: 40px;
    }
    /deep/ .el-tree-node__content {
        margin-top: 7px;
    }
</style>