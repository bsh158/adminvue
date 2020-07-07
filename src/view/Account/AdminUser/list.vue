<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <router-link to="add">
                    <el-button
                        type="success"
                        v-if="getHasRule('admin-users-save')"
                        icon="el-icon-plus"
                        class="handle-del mr10"
                    >添加管理员</el-button>
                </router-link>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column prop="username" label="用户名"></el-table-column>
                <el-table-column prop="mobile" label="手机号"></el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
                <el-table-column prop="title" label="所属用户组"></el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.status === 0">
                            <el-tag type="danger">禁用</el-tag>
                        </div>
                        <div v-else-if="scope.row.status === 1">
                            <el-tag type="success">启用</el-tag>
                        </div>
                        <div v-else>
                            <el-tag type="warning">未知状态</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            v-if="getHasRule('admin-users-update')"
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            v-if="getHasRule('admin-users-delete')"
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" :rules="rules" label-width="130px">
                <el-form-item label="用户名" prop="username">
                    <el-input
                        v-model.trim="form.username"
                        class="h-40 w-200"
                        :maxlength="12"
                        :disabled="true"
                    ></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model.trim="password" class="h-40 w-200"></el-input>
                </el-form-item>
                <el-form-item label="真实姓名">
                    <el-input v-model.trim="form.realname" class="h-40 w-200"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model.trim="form.mobile" class="h-40 w-200"></el-input>
                </el-form-item>
                <el-form-item label="备注">
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
                            v-for="(item,key) in groupOptions"
                            :label="item.else"
                            :key="key"
                            :name="item.else"
                            class="form-checkbox"
                        ></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { AdminUser, AdminGroup } from '@/services';
export default {
    name: 'homeControllerList',
    data() {
        return {
            query: {
                pageIndex: 1,
                pageSize: 10
            },
            tableData: [],
            form: {
                id: '',
                username: '',
                realname: '',
                mobile: '',
                remark: '',
                group_id: '',
                groups: [],
                status: 1
            },
            password: '',
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 4,
            form: {},
            idx: -1,
            id: -1,
            rules: {
                username: [{ required: true, message: '请输入用户名' }],
                // realname: [{ required: true, message: '请输入真实姓名' }],
                // remark: [{ required: true, message: '请输入备注' }],
                status: [{ required: true, message: '请选择启用状态' }]
            },
            groupOptions: [],
            selectedGroups: [],
            selectedIds: []
        };
    },
    created() {
        this.init();
    },
    methods: {
        //初始化
        init() {
            AdminUser.getUserList({
                page: this.query.pageIndex
            }).then(res => {
                if (res.code == 1) {
                    this.tableData = res.data.data;
                    this.pageTotal = res.data.total;
                }
            });
        },
        async getCompleteData() {
            this.groupOptions = await this.getAllGroups();

            AdminUser.readUser({
                id: this.id
            }).then(res => {
                if (res.code == 1) {
                    this.form.id = res.data.id;
                    this.form.username = res.data.username;
                    this.form.realname = res.data.realname;
                    this.form.mobile = res.data.mobile;
                    this.form.remark = res.data.remark;
                    this.form.status = res.data.status.toString();
                    _(res.data.groups).forEach(res1 => {
                        _(this.groupOptions).forEach(res2 => {
                            if (res1.title == res2.else) {
                                this.selectedGroups.push(res1.title);
                            }
                        });
                    });
                    this.editVisible = true;
                }
            });
        },
        getAllGroups() {
            return new Promise((resolve, reject) => {
                AdminGroup.getGroupList({}).then(res => {
                    if (res.code == 1) {
                        resolve(res.data);
                    }
                });
            });
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
        },
        // 删除操作
        handleDelete(index, row) {
            AdminUser.delUser({
                id: row.id
            }).then(res => {
                if (res.code == 1) {
                    this.$message.success('删除成功');
                    this.init();
                }
            });
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },
        // 编辑操作
        handleEdit(index, row) {
            this.id = row.id;
            this.getCompleteData();

            // AdminUser.readUser({
            //     id: row.id
            // }).then(res => {
            //     if (res.code == 1) {
            //         res.data.status = res.data.status.toString();
            //         this.form = res.data;
            //     }
            // });
        },
        // 保存编辑
        saveEdit() {
            if (!this.selectCheckbox()) {
                this.$message.error('请选择用户组');
                return;
            }
            this.$refs.form.validate(valid => {
                if (valid) {
                    if (this.password) {
                        this.form.password = this.password;
                    }
                    AdminUser.editUser({
                        id: this.id,
                        username: this.form.username,
                        realaname: this.form.realaname,
                        mobile: this.form.mobile,
                        remark: this.form.remark,
                        password: this.form.password,
                        status: this.form.status,
                        group_id: this.form.group_id
                    }).then(res => {
                        if (res.code == 1) {
                            // this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                            this.$message.success(`修改成功`);
                            this.editVisible = false;
                            this.init();
                        }
                    });
                }
            });
        },
        selectCheckbox() {
            let temp = false;
            _(this.groupOptions).forEach(res => {
                if (this.selectedGroups.toString().indexOf(res.else) > -1) {
                    this.selectedIds.push(res.id);
                }
            });
            // console.log(this.selectedIds.length);return;
            if (this.selectedIds.length) {
                this.form.group_id = _.cloneDeep(this.selectedIds);
                temp = true;
            }
            this.selectedIds = [];
            return temp;
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.init();
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
