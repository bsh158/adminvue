import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import {
  messages
} from './components/common/i18n';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';
import MyPlugin from '@/tools/myPlugin' //自定义全局方法
import store from '@/store/index'
import VueCookies from 'vue-cookies'
import Lockr from 'lockr' //缓存Api
import _ from 'lodash' //lodash


//配置文件
Vue.prototype.$config = require('@/config/index');
Vue.config.productionTip = false;
Vue.use(MyPlugin);
Vue.use(VueI18n);
Vue.use(ElementUI, {
  size: 'small'
});
const i18n = new VueI18n({
  locale: 'zh',
  messages
});
Vue.use(VueCookies)

//全局
window.Lockr = Lockr; //缓存Api
window._ = _//lodash
window.router = router; //全局路由
window.store = store; //缓存Api

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
  const role = localStorage.getItem('authKey');

  if (!role && to.path !== '/login') {
    next('/login');
  } else {
    next();
  }
});

// router.beforeEach((to, from, next) => {
//   document.title = `${to.meta.title} | vue-manage-system`;
//   const role = localStorage.getItem('authKey');
//   if (!role && to.path !== '/login') {
//     next('/login');
//   } else if (to.meta.permission) {
//     // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
//     role === 'admin' ? next() : next('/403');
//   } else {
//     next();
//   }
// });

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');