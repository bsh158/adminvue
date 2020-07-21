<template>
    <div class="m-l-50 m-t-30 w-500">
        <el-form ref="form" :model="form" :rules="rules" label-width="130px">
            <el-form-item label="用户名" prop="username">
                <el-input v-model.trim="form.username" class="h-40 w-200" :maxlength="12"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model.trim="form.password" class="h-40 w-200"></el-input>
            </el-form-item>
            <el-form-item label="真实姓名" prop="realname">
                <el-input v-model.trim="form.realname" class="h-40 w-200"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
                <el-input v-model.trim="form.mobile" class="h-40 w-200"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input v-model.trim="form.remark" class="h-40 w-200"></el-input>
            </el-form-item>
            <el-form-item label="是否启用" prop="status">
                <el-radio-group v-model="form.status">
                    <el-radio label="0">禁用</el-radio>
                    <el-radio label="1">启用</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="用户组">
                <el-checkbox-group v-model="selectedGroups">
                    <el-checkbox
                        v-for="(item,index) in groupOptions"
                        :key="index"
                        :label="item.title"
                        class="form-checkbox"
                    ></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item>
                <el-button @click="goback()">返回</el-button>
                <el-button type="primary" @click="add('form')">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<style type="text/css">
.form-checkbox:first-child {
    margin-left: 15px;
}
</style>
<script>
import { AdminUser, AdminGroup } from '@/services';
export default {
    name: 'homeControllerAdd',
    data() {
        return {
            form: {
                username: '',
                password: '',
                realname: '',
                mobile: '',
                remark: '',
                groups: [],
                status: '1'
            },
            orgsOptions: [],
            groupOptions: [],
            selectedGroups: [],
            selectedIds: [],
            rules: {
                username: [{ required: true, message: '请输入用户名' }],
                password: [{ required: true, message: '请输入用户密码' }],
                realname: [{ required: true, message: '请输入真实姓名' }],
                remark: [{ required: true, message: '请输入备注' }],
                status: [{ required: true, message: '请选择启用状态' }]
            }
        };
    },
    methods: {
        selectCheckbox() {
            let temp = false;
            _(this.groupOptions).forEach(res => {
                if (this.selectedGroups.toString().indexOf(res.title) > -1) {
                    this.selectedIds.push(res.id);
                }
            });
            if (this.selectedIds.length) {
                this.form.group_id = _.cloneDeep(this.selectedIds);
                temp = true;
            }
            this.selectedIds = [];
            return temp;
        },
        add(form) {
            if (!this.selectCheckbox()) {
                this.$message.error('请选择用户组');
                return;
            }
            // console.log('res = ', _g.j2s(this.form))
            this.$refs.form.validate(pass => {
                if (pass) {
                    this.isLoading = !this.isLoading;

                    AdminUser.addUser({
                        username: this.form.username,
                        password: this.form.password,
                        realaname: this.form.realaname,
                        mobile: this.form.mobile,
                        remark: this.form.remark,
                        status: this.form.status,
                        group_id: this.form.group_id
                    }).then(res => {
                        if (res.code == 1) {
                            this.$message.success(`添加成功`);
                            setTimeout(() => {
                                this.$store.dispatch('delVisitedViews', this.$route);
                                this.$router.go(-1);
                            }, 1500);
                        }
                    });
                }
            });
        },
        getAllGroups() {
            AdminGroup.getGroupList({}).then(res => {
                if (res.code == 1) {
                    this.groupOptions = res.data;
                }
            });
        }
    },
    created() {
        this.getAllGroups();
    }
};
</script>
