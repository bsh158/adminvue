<template>
    <div class="m-l-50 m-t-30 w-500">
        <el-form ref="form" :model="form" :rules="rules" label-width="110px">
            <el-form-item label="显示名" prop="title">
                <el-input v-model.trim="form.title" class="h-40 w-200"></el-input>
            </el-form-item>
            <el-form-item label="名称" prop="name">
                <el-input v-model.trim="form.name" class="h-40 w-200"></el-input>
            </el-form-item>
            <el-form-item label="节点类型" prop="level">
                <el-radio-group v-model="form.level">
                    <el-radio label="1">项目</el-radio>
                    <el-radio label="2">模块</el-radio>
                    <el-radio label="3">操作</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="父节点" prop="pid">
                <el-select v-model="form.pid" placeholder="父节点" class="w-200">
                    <el-option
                        v-for="(item,index) in options"
                        :key="index"
                        :label="item.title"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="goback()">取消</el-button>
                <el-button type="primary" @click="add('form')">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { AdminRule } from '@/services';
export default {
    name: 'homeRuleAdd',
    data() {
        return {
            form: {
                title: '',
                name: '',
                pid: null,
                level: '1'
            },
            options: [{ id: 0, title: '根节点' }],
            rules: {
                title: [{ required: true, message: '请输入节点名称' }],
                name: [{ required: true, message: '请输入节点显示名' }],
                level: [{ required: true, message: '请选择节点类型' }],
                pid: [{ type: 'number', required: true, message: '请选择父级节点' }]
            }
        };
    },
    methods: {
        add(form) {
            this.$refs[form].validate(valid => {
                if (valid) {
                    AdminRule.addRule({
                        level: this.form.level,
                        name: this.form.name,
                        pid: this.form.pid,
                        title: this.form.title
                    }).then(res => {
                        if (res.code == 1) {
                            this.$message.success('添加成功');
                            setTimeout(() => {
                                this.$store.dispatch('delVisitedViews', this.$route);
                                this.$router.go(-1);
                            }, 1500);
                        }
                    });
                }
            });
        },
        getRules() {
            AdminRule.getRuleList({}).then(res => {
                if (res.code == 1) {
                    _(res.data).forEach(ret => {
                        if (ret.level != 3) {
                            this.options.push(ret);
                        }
                    });
                }
            });
        }
    },
    created() {
        this.getRules();
    }
};
</script>