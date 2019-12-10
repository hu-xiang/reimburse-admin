<template>
    <content-bar v-loading="loading" footer :pathArr="pathArr" confirmButtonText="提交" @confirm="submit"
        @cancel="$router.go(-1)">
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
                            <el-input v-model="form.memSex"></el-input>
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
                            <el-input v-model="form.memBirthday"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="入职日期" prop="memJoinDate">
                            <el-input v-model="form.memJoinDate"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="是否有上级" prop="isleader">
                            <el-input v-model="form.isleader"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="职级名称" prop="rankname">
                                <el-input v-model="form.rankname"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="部门" prop="deptname">
                                <el-input v-model="form.deptname"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="16">
                            <el-form-item label="岗位描述" prop="postdesc">
                                <el-input placeholder="请输入岗位描述" type="textarea" v-model="form.postdesc">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
            </content-item>
        </el-form>
    </content-bar>
</template>

<script>
    export default {
        name: 'userAdd',
        data() {
            return {
                pathArr: ['人事资料', '人员信息', '新增人员'],
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
            this.$nextTick(function () {

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
</style>