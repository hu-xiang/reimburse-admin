import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login';
import Index from '@/components/Index';
import ErrorApp from '@/components/common/error';  // 错误页面

/** 业务代码 */
// 工作台页面
import workBench from '@/components/pages/workBench/index.vue';
// 出差申请页面
import travelEntry from '@/components/pages/travelApply/travelEntry/index.vue';
import travelQuery from '@/components/pages/travelApply/travelQuery/index.vue';
// 费用报销页面
import feeEntry from '@/components/pages/reimbursement/feeEntry/index.vue';
import feeQuery from '@/components/pages/reimbursement/feeQuery/index.vue';
import rightSetting from '@/components/pages/reimbursement/rightSetting/index.vue';
// 预算管理页面
import budgetEntry from '@/components/pages/budgetManage/budgetEntry/index.vue';
import budAppAdd from '@/components/pages/budgetManage/budgetEntry/add.vue';
import budAppEdit from '@/components/pages/budgetManage/budgetEntry/edit.vue';
import classMaintenance from '@/components/pages/budgetManage/classMaintenance/index.vue';
import liveSetting from '@/components/pages/budgetManage/liveSetting/index.vue';
import subsidySetting from '@/components/pages/budgetManage/subsidySetting/index.vue';
import transSetting from '@/components/pages/budgetManage/transSetting/index.vue';
import budgetTime from '@/components/pages/budgetManage/budgetTime/index.vue';
import budgetControl from '@/components/pages/budgetManage/budgetControl/index.vue';
// 报表分析页面
import budget from '@/components/pages/reportAnalysis/budget/index.vue';
import fee from '@/components/pages/reportAnalysis/fee/index.vue';
import travel from '@/components/pages/reportAnalysis/travel/index.vue';
// 人事资料页面
import userInfo from '@/components/pages/personInfo/userInfo/index.vue';
import userAdd from '@/components/pages/personInfo/userInfo/add.vue';
import userEdit from '@/components/pages/personInfo/userInfo/edit.vue';
import depart from '@/components/pages/personInfo/depart/index.vue';
import rank from '@/components/pages/personInfo/rank/index.vue';
import position from '@/components/pages/personInfo/position/index.vue';
import role from '@/components/pages/personInfo/roleManage/index.vue';
import roleAdd from '@/components/pages/personInfo/roleManage/add.vue';
import roleEdit from '@/components/pages/personInfo/roleManage/edit.vue';

// 系统管理页面
import globalData from '@/components/pages/sysManage/globalData/index.vue';
import globalDataAdd from '@/components/pages/sysManage/globalData/add.vue';
import globalDataEdit from '@/components/pages/sysManage/globalData/edit.vue';

// 公司代码页面
import comCode from '@/components/pages/sysManage/comCode/index.vue';
import comCodeAdd from '@/components/pages/sysManage/comCode/add.vue';
import comCodeEdit from '@/components/pages/sysManage/comCode/edit.vue';

// 会计科目页面
import accountSubject from '@/components/pages/sysManage/accountSubject/index.vue';
import accountSubjectAdd from '@/components/pages/sysManage/accountSubject/add.vue';
import accountSubjectEdit from '@/components/pages/sysManage/accountSubject/edit.vue';

// 成本中心维护
import costCenter from '@/components/pages/sysManage/costCenter/index.vue';
import costCenterAdd from '@/components/pages/sysManage/costCenter/add.vue';
import costCenterEdit from '@/components/pages/sysManage/costCenter/edit.vue';

// 地区区域维护
import zone from '@/components/pages/sysManage/zone/index.vue';
import zoneAdd from '@/components/pages/sysManage/zone/add.vue';
import zoneEdit from '@/components/pages/sysManage/zone/edit.vue';

// WBS维护
import wbs from '@/components/pages/sysManage/wbs/index.vue';
import wbsAdd from '@/components/pages/sysManage/wbs/add.vue';
import wbsEdit from '@/components/pages/sysManage/wbs/edit.vue';

// 银行账号信息维护
import bankAccount from '@/components/pages/sysManage/bankAccount/index.vue';
import bankAccountAdd from '@/components/pages/sysManage/bankAccount/add.vue';
import bankAccountEdit from '@/components/pages/sysManage/bankAccount/edit.vue';

// 币别信息维护
import curCurrency from '@/components/pages/sysManage/curCurrency/index.vue';
import curCurrencyAdd from '@/components/pages/sysManage/curCurrency/add.vue';
import curCurrencyEdit from '@/components/pages/sysManage/curCurrency/edit.vue';

// 汇率转换维护
import exchangeRate from '@/components/pages/sysManage/exchangeRate/index.vue';
import exchangeRateAdd from '@/components/pages/sysManage/exchangeRate/add.vue';
import exchangeRateEdit from '@/components/pages/sysManage/exchangeRate/edit.vue';

Vue.use(Router)

export default new Router({
  routes: [
    { // 错误页面
      path: "*",
      redirect: "/error"
    },{ // 登录页面
      path: '/',
      name: 'Login',
      component: Login
    },{ // 主页面
      path: '/index',
      name: 'Index',
      component: Index,
      children: [
        // 工作台页面路由
        {
          path: '/workBench',
          name: '工作台',
          component: workBench,
        },
        // 出差申请页面路由
        {
          path: '/travelEntry',
          name: '出差申请录入',
          component: travelEntry,
        },
        {
          path: '/travelQuery',
          name: '出差申请查询',
          component: travelQuery,
        },
        // 费用报销页面路由
        {
          path: '/feeEntry',
          name: '费用报销录入',
          component: feeEntry,
        },
        {
          path: '/feeQuery',
          name: '费用报销查询',
          component: feeQuery,
        },
        {
          path: '/rightSetting',
          name: '审批签权',
          component: rightSetting,
        },
        // 预算管理页面路由
        {
          path: '/budgetEntry',
          name: '预算申请',
          component: budgetEntry,
        },
        {
          path: '/budAppAdd',
          name: '预算申请新增',
          component: budAppAdd,
        },
        {
          path: '/budAppEdit',
          name: '预算申请编辑',
          component: budAppEdit,
        },
        {
          path: '/transSetting',
          name: '出差交通费',
          component: transSetting,
        },
        {
          path: '/subsidySetting',
          name: '出差补助',
          component: subsidySetting,
        },
        {
          path: '/liveSetting',
          name: '出差住宿费',
          component: liveSetting,
        },
        {
          path: '/classMaintenance',
          name: '预算类型',
          component: classMaintenance,
        },
        {
          path: '/budgetTime',
          name: '预算时间',
          component: budgetTime,
        },
        {
          path: '/budgetControl',
          name: '预算管控',
          component: budgetControl,
        },
        // 报表分析页面路由
        {
          path: '/budget',
          name: '预算执行状况',
          component: budget,
        },
        {
          path: '/fee',
          name: '费用报销明细',
          component: fee,
        },
        {
          path: '/travel',
          name: '出差申请明细',
          component: travel,
        },
        // 人事资料页面路由
        {
          path: '/userInfo',
          name: '人员信息',
          component: userInfo,
        },
        {
          path: '/userAdd',
          name: '新增人员',
          component: userAdd,
        },
        {
          path: '/userEdit',
          name: '编辑人员',
          component: userEdit,
        },
        {
          path: '/depart',
          name: '部门组织结构',
          component: depart,
        },
        {
          path: '/rank',
          name: '职级维护',
          component: rank,
        },
        {
          path: '/position',
          name: '岗位维护',
          component: position,
        },
        {
          path: '/role',
          name: '角色管理',
          component: role,
        },
        {
          path: '/roleAdd',
          name: '新增角色',
          component: roleAdd,
        },
        {
          path: '/roleEdit',
          name: '编辑角色',
          component: roleEdit,
        },

        // 系统管理页面路由 /////////////////////////////

        {
          path: '/globalData',
          name: '系统全局参数',
          component: globalData,
        },
        {
          path: '/globalDataAdd',
          name: '新增系统全局参数',
          component: globalDataAdd,
        },
        {
          path: '/globalDataEdit',
          name: '编辑系统全局参数',
          component: globalDataEdit,
        },

        // 公司代码维护路由 //////////////////////////

        {
          path: '/comCode',
          name: '公司代码维护',
          component: comCode,
        },
        {
          path: '/comCodeEdit',
          name: '编辑公司代码',
          component: comCodeEdit,
        },
        {
          path: '/comCodeAdd',
          name: '增加公司代码',
          component: comCodeAdd,
        },

        // 会计科目维护路由///////////////////////////////

        {
          path: '/accountSubject',
          name: '会计科目维护',
          component: accountSubject,
        },
        {
          path: '/accountSubjectAdd',
          name: '编辑会计科目',
          component: accountSubjectAdd,
        },
        {
          path: '/accountSubjectEdit',
          name: '增加会计科目',
          component: accountSubjectEdit,
        },

        // 成本中心维护路由///////////////////////////////////

        {
          path: '/costCenter',
          name: '成本中心维护',
          component: costCenter,
        },
        {
          path: '/costCenterAdd',
          name: '新增成本中心',
          component: costCenterAdd,
        },
        {
          path: '/costCenterEdit',
          name: '编辑成本中心',
          component: costCenterEdit,
        },

        // 地区区域维护///////////////////////////////////////

        {
          path: '/zone',
          name: '地区区域维护',
          component: zone,
        },
        {
          path: '/zoneAdd',
          name: '新增地区区域',
          component: zoneAdd,
        },
        {
          path: '/zoneEdit',
          name: '编辑地区区域',
          component: zoneEdit,
        },

        // WBS维护///////////////////////////////////////

        {
          path: '/wbs',
          name: 'wbs维护',
          component: wbs,
        },
        {
          path: '/wbsAdd',
          name: '新增wbs',
          component: wbsAdd,
        },
        {
          path: '/wbsEdit',
          name: '编辑wbs',
          component: wbsEdit,
        },

        // 银行账号信息维护///////////////////////////////////////

        {
          path: '/bankAccount',
          name: '银行账号信息维护',
          component: bankAccount,
        },
        {
          path: '/bankAccountAdd',
          name: '新增银行账号信息',
          component: bankAccountAdd,
        },
        {
          path: '/bankAccountEdit',
          name: '编辑银行账号信息',
          component: bankAccountEdit,
        },

        // 汇率转换信息维护///////////////////////////////////////

        {
          path: '/exchangeRate',
          name: '汇率转换维护',
          component: exchangeRate,
        },
        {
          path: '/exchangeRateAdd',
          name: '新增汇率转换',
          component: exchangeRateAdd,
        },
        {
          path: '/exchangeRateEdit',
          name: '编辑汇率转换',
          component: exchangeRateEdit,
        },

        // 币别信息维护///////////////////////////////////////

        {
          path: '/curCurrency',
          name: '币别信息维护',
          component: curCurrency,
        },
        {
          path: '/curCurrencyAdd',
          name: '新增币别信息',
          component: curCurrencyAdd,
        },
        {
          path: '/curCurrencyEdit',
          name: '编辑币别信息',
          component: curCurrencyEdit,
        },


        // 错误页面路由
        {
          path: '/error',
          name: '错误页面',
          component: ErrorApp,
        }
      ]
    }
  ]
})
