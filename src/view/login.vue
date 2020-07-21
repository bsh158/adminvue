<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="username">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="password"
                        v-model="param.password"
                        @keyup.enter.native="submitForm()"
                    >
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
                <!-- <p class="login-tips">Tips : 用户名和密码随便填。</p> -->
            </el-form>
        </div>
    </div>
</template>

<script>
import { AdminUser } from '@/services';

export default {
    name: 'login',
    data: function() {
        return {
            param: {
                username: '',
                password: ''
            },
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
            }
        };
    },
    methods: {
        submitForm() {
            this.$refs.login.validate(valid => {
                if (valid) {
                    AdminUser.userLogin({
                        username: this.param.username,
                        password: this.param.password
                    }).then(res => {
                        if (res.code == 1) {
                            Lockr.set('menus', res.data.menusList); // 菜单数据
                            Lockr.set('authKey', res.data.authKey); // 权限认证
                            Lockr.set('rememberKey', res.data.rememberKey); // 记住密码的加密字符串
                            Lockr.set('authList', res.data.authList); // 权限节点列表
                            Lockr.set('userInfo', res.data.userInfo); // 用户信息
                            Lockr.set('menuauthList', res.data.menuauthList); // 菜单数组
                            Lockr.set('sessionId', res.data.sessionId); // 用户sessionid
                            // window.axios.defaults.headers.authKey = localStorage.getItem('authKey');
                            let routerUrl = '';

                            if (res.data.menusList[0].index != '' && res.data.menusList[0].menu_type == 2) {
                                routerUrl = res.data.menusList[0].index;
                            } else {
                                // console.log(res.data.menusList[0].subs[0]);return;
                                routerUrl = res.data.menusList[0].subs[0].index;
                            }
                            
                            setTimeout(() => {
                                let path = this.$route.path;
                                if (routerUrl != path) {
                                    this.$message.success('登录成功');
                                    this.$router.replace(routerUrl);
                                } else {
                                    this.$message.error('没有权限');
                                }
                            }, 1000);
                        } else {
                            this.$message.error('连接超时');
                        }
                    });
                    // this.$message.success('登录成功');
                    // localStorage.setItem('ms_username', this.param.username);
                    // this.$router.push('/');
                } else {
                    this.$message.error('请输入账号和密码');
                    // console.log('error submit!!');
                    return false;
                }
            });
        }
    }
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(~@/assets/img/login-bg.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>