<template>
    <div class="m-l-50 m-t-30 w-900">
        <el-form ref="form" :model="form" :rules="rules" label-width="130px">
            <el-form-item label="用户组名称" prop="title">
                <el-input v-model.trim="form.title" class="h-40 w-200"></el-input>
            </el-form-item>
            <el-form-item label="父级用户组" prop="pid">
                <el-select v-model="form.pid" placeholder="父级用户组" class="w-200">
                    <el-option
                        v-for="(item,index) in options"
                        :key="index"
                        :label="item.title"
                        :value="item.id"
                        :name="item.title"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="备注">
                <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="备注"
                    v-model="form.remark"
                    class="w-200"
                ></el-input>
            </el-form-item>
             <el-form-item label="是否启用" prop="status">
                <el-radio-group v-model="form.status">
                    <el-radio label="0">禁用</el-radio>
                    <el-radio label="1">启用</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="权限分配">
                <div class="bor-gray h-400 ovf-y-auto bor-ra-5 bg-wh">
                    <div v-for="(item,index1) in nodes" :key="index1">
                        <div class="bor-b-ccc bg-gra p-l-10 p-r-10">
                            <el-checkbox
                                v-model="item.check"
                                @change="selectProjectRule(item)"
                            >{{item.else}}</el-checkbox>
                        </div>
                        <div v-for="(childItem,index2) in item.child" :key="index2">
                            <div class="p-l-20 bor-b-ccc">
                                <el-checkbox
                                    v-model="childItem.check"
                                    @change="selectModuleRule(childItem, item, childItem.child)"
                                >{{childItem.else}}</el-checkbox>
                            </div>
                            <div class="p-l-40 bor-b-ccc bg-gra">
                                <el-checkbox
                                    v-for="(grandChildItem,index3) in childItem.child"
                                    :key="index3"
                                    v-model="grandChildItem.check"
                                    @change="selectActionRule(grandChildItem, childItem, item)"
                                >{{grandChildItem.else}}</el-checkbox>
                            </div>
                        </div>
                    </div>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button @click="goback()">取消</el-button>
                <el-button type="primary" @click="save('form')">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { AdminGroup, AdminRule } from '@/services';
export default {
    name: 'homeGroupsAdd',
    data() {
        return {
            isLoading: false,
            form: {
                title: '',
                pid: '',
                remark: '',
                rules: '',
                status: '',
            },
            options: [{ pid: 0, title: '无' }],
            nodes: [],
            selectedNodes: [],
            rules: {
                title: [{ required: true, message: '请输入用户组名称', trigger: 'blur' }],
                status: [{ required: true, message: '请选择是否启用', trigger: 'blur' }]
            }
        };
    },
    methods: {
        // 添加
        save() {
            this.form.rules = this.selectedNodes.toString();
            this.$refs.form.validate(valid => {
                if (valid) {
                    AdminGroup.addGroup({
                        title: this.form.title,
                        remark: this.form.remark,
                        status: this.form.status,
                        pid: this.form.pid,
                        rules: this.form.rules
                    }).then(res => {
                        if (res.code == 1) {
                            this.$message.success(`添加成功`);
                            setTimeout(() => {
                                this.$store.dispatch('delVisitedViews', this.$route);
                                this.goback();
                            }, 1500);
                        }
                    });
                }
            });
        },
        getRules() {
            AdminRule.getRuleList({
                type: 'tree'
            }).then(res => {
                if (res.code == 1) {
                    this.nodes = this.nodes.concat(res.data);
                }
            });
        },
        getGroups() {
            AdminGroup.getGroupList({}).then(res => {
                if (res.code == 1) {
                    this.options = this.options.concat(res.data);
                }
            });
        },
        selectProjectRule(item) {
            if (!item.check) {
                _(item.child).forEach(res => {
                    res.check = false;
                    let index = _(this.selectedNodes).indexOf(res.id);
                    this.selectedNodes.splice(index, 1);
                    _(res.child).forEach(res1 => {
                        res1.check = false;
                        let index = _(this.selectedNodes).indexOf(res1.id);
                        this.selectedNodes.splice(index, 1);
                    });
                });
            }
            this.selectRule(item);
        },
        selectModuleRule(item, faItem, children) {
            if (!faItem.check) {
                faItem.check = true;
                this.selectedNodes.push(faItem.id);
            }
            if (item.check) {
                this.selectedNodes.push(item.id);
                _(children).forEach(res => {
                    res.check = true;
                    this.selectedNodes.push(res.id);
                });
            } else {
                let index = _(this.selectedNodes).indexOf(item.id);
                this.selectedNodes.splice(index, 1);
                _(children).forEach(res1 => {
                    let temp = _(this.selectedNodes).indexOf(res1.id);
                    if (temp >= 0) {
                        res1.check = false;
                        this.selectedNodes.splice(temp, 1);
                    }
                });
            }
        },
        selectActionRule(item, faItem, grandFaItem) {
            if (!faItem.check) {
                faItem.check = true;
                this.selectedNodes.push(faItem.id);
            }
            if (!grandFaItem.check) {
                grandFaItem.check = true;
                this.selectedNodes.push(grandFaItem.id);
            }
            this.selectRule(item);
        },
        selectRule(item) {
            if (item.check) {
                this.selectedNodes.push(item.id);
            } else {
                const index = _(this.selectedNodes).indexOf(item.id);
                this.selectedNodes.splice(index, 1);
            }
        }
    },
    created() {
        this.getRules();
        this.getGroups();
    }
};
</script>

<style>
.bor-gray {
    border: 1px solid #e5e5e5;
}
.bor-b-ccc {
    border-bottom: 1px solid #ccc;
}

.bor-ra-5 {
    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    -o-border-radius: 5px;
    -ms-border-radius: 5px;
}

.h-400 {
    height: 400px !important;
}
.ovf-y-auto {
    overflow-y: auto;
}

.bg-wh {
    background: #fff;
}

.bg-gra {
    background: #f9f9f9;
}

.p-l-10 {
    padding-left: 10px !important;
}

.p-l-20 {
    padding-left: 20px !important;
}

.p-l-40 {
    padding-left: 40px !important;
}

.p-r-10 {
    padding-right: 10px !important;
}
</style>