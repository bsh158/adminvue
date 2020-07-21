<template>
    <div class="m-l-50 m-t-30 w-500">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px" style="width:500px">
            <el-form-item label="标题" prop="title">
                <el-input v-model.trim="form.title" class="h-40 w-200"></el-input>
            </el-form-item>
            <el-form-item label="绑定权限标识" prop="rule_id">
                <el-select v-model="form.rule_id" filterable placeholder="请选择">
                    <el-option
                        v-for="item in ruleData"
                        :key="item.id"
                        :label="item.title"
                        :value="item.id"
                    ></el-option>
                </el-select>
                <!-- <el-input v-model.trim="form.rule_name" class="h-40 fl w-200" :disabled="true"></el-input> -->
            </el-form-item>
            <el-form-item label="菜单类型" prop="menu_type">
                <el-radio-group v-model="form.menu_type">
                    <el-radio label="1">普通三级菜单</el-radio>
                    <el-radio label="2">单页菜单</el-radio>
                    <el-radio label="3">外链</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="上级菜单" prop="pid">
                <el-select  v-model="form.pid" placeholder="请选择父级菜单" class="w-200">
                    <el-option
                        v-for="(item,index) in options"
                        :label="item.title"
                        :value="item.id"
                        :key="index"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="路径">
                <el-input v-model.trim="form.index" class="h-40 w-200"></el-input>
            </el-form-item>
            <el-form-item label="icon">
                <el-input v-model.trim="form.icon" class="h-40 w-200"></el-input>
            </el-form-item>
            <!-- <el-form-item label="模块" prop="module">
                    <el-input v-model.trim="form.module" class="h-40 w-200"></el-input>
            </el-form-item>-->
            <el-form-item label="所属菜单">
                <el-input v-model.trim="form.menu" class="h-40 w-200"></el-input>
            </el-form-item>
            <el-form-item label="排序">
                <el-input v-model="form.sort" class="h-40 w-200"></el-input>
            </el-form-item>
            <el-form-item label="是否启用" prop="status">
                <el-radio-group v-model="form.status">
                    <el-radio label="0">禁用</el-radio>
                    <el-radio label="1">启用</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <el-button @click="goback()">取消</el-button>
                <el-button type="primary" @click="save('form')">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<style>
.search-btn {
    position: absolute;
    top: 0px;
    right: 0px;
}
</style>
<script>
import { AdminMenu, AdminRule } from '@/services';

export default {
    name: 'homeMenuAdd',
    data() {
        return {
            keyword: '',
            tableData: [],
            dialogTableVisible: false,
            form: {
                title: '',
                rule_name: '',
                rule_id: null,
                pid: '',
                menu_type: '',
                url: '',
                module: '',
                menu: '',
                sort: ''
            },
            options: [{ id: 0, title: '无' }],
            ruleData:{},
            rules: {
                title: [{ required: true, message: '请输入菜单标题' }],
                rule_id: [{ required: true, message: '请绑定权限标识' }],
                menu_type: [{ required: true, message: '请选择菜单类型' }],
                pid: [{ type: 'number', required: true, message: '请选择上级菜单' }],
                menu_type: [{ required: true, message: '请选择启用状态' }],
                status: [{ required: true, message: '请选择菜单状态' }]
            },
        };
    },
    methods: {
        init() {
            AdminMenu.getMenuList({}).then(res => {
                if (res.code == 1) {
                    let array = [];
                    _(res.data).forEach(ret => {
                        if (ret.level != 3 && ret.menu_type == 1) {
                            array.push(ret);
                        }
                    });
                    this.options = this.options.concat(array);
                }
            });
            AdminRule.getRuleList({}).then(res => {
                if (res.code == 1) {
                    this.ruleData = res.data;
                }
            });
        },
        selectRule(rule_title, rule_id) {
            setTimeout(() => {
                this.form.rule_name = rule_title;
                this.form.rule_id = rule_id;
            }, 0);
            this.closeDialog();
        },
        // 添加
        save() {
            this.editVisible = false;
            this.$refs.form.validate(valid => {
                if (valid) {
                    AdminMenu.addMenu({
                        title: this.form.title,
                        rule_id: this.form.rule_id,
                        menu_type: this.form.menu_type,
                        pid: this.form.pid,
                        index: this.form.index,
                        icon: this.form.icon,
                        module: 'Main',
                        menu: this.form.menu,
                        sort: this.form.sort,
                        status: this.form.status
                    }).then(res => {
                        if (res.code == 1) {
                            // this.$message.success(`修改第 ${this.idx + 1} 行成功`);
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
    },
    created() {
        this.init();
    }
};
</script>