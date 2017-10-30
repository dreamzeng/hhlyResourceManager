import Vue from 'vue';
import Router from 'vue-router';
const _import = require('./_import_' + process.env.NODE_ENV);
// 在发展环境不使用延迟加载，因为懒加载大页面会造成WebPACK热更新太慢，所以只有在生产使用延迟加载

/* layout */
import Layout from '../views/layout/Layout';

/* login */
const Login = _import('login/index');
const authRedirect = _import('login/authredirect');

const home = _import('home/index');


/* error page */
const Err404 = _import('error/404');


/* 资源管理 */
const resourceManager_index = _import('resourceManager/index');
const resourceManager_myRes = _import('resourceManager/myRes');
const resourceManager_myRes_edit = _import('resourceManager/myRes_edit')

const resourceManager_accountNumber = _import('resourceManager/accountNumber');
const resourceManager_accountNumber_edit = _import('resourceManager/accountNumber_edit');
const resourceManager_role = _import('resourceManager/role');
const resourceManager_role_edit = _import('resourceManager/role_edit');
const resourceManager_role_dispense = _import('resourceManager/role_dispense');
const resourceManager_sysRes = _import('resourceManager/sysRes');

Vue.use(Router);


export const constantRouterMap = [
    { path: '/login', name:'login', component: Login, hidden: true },
    { path: '/authredirect', name:'authredirect', component: authRedirect, hidden: true },
    { path: '/404', name:'n404', component: Err404, hidden: true },
    {
      path: '/',
      name:'home',
      component: Layout,
      redirect: '/home/index',
      hidden: true
    },
    {
      path: '/home',
      name:'mhome',
      component: Layout,
      redirect: '/home/index',
      noDropdown: true,
      icon: 'xinrenzhinan',
      children: [{ path: 'index', name:'home_index',component: home,meta: {  title: '首页'} }]
    }
]

export const asyncRouterMap = [
  {
    path: '/resourceManager',
    component: Layout,
    redirect: 'noredirect',
    meta: {  title: '资源管理'},
    icon: 'wujiaoxing',
    children: [
        { path: 'index', name:'resourceManager_index', component: resourceManager_index, meta: {  title: '个人中心'}},
        { path: 'myRes', hidden: true,name:'resourceManager_myRes',component:resourceManager_myRes,meta:{title:'我的资源',tabsHidden: true}},
        {
          path:'myRes/add',hidden:true,component:resourceManager_myRes_edit,name:'resourceManager_myRes_add',
          meta:{
            title:'新增资源',tabsHidden:true
          }
        },
        {
          path:'myRes/edit/:id',hidden:true,component:resourceManager_myRes_edit,name:'resourceManager_myRes_edit',
          meta:{
            title:'修改资源',tabsHidden:true,isEdit: true
          }
        },
        {
          path:'accountNumber',
          name:'resourceManager_accountNumber',
          component:resourceManager_accountNumber,meta: {  title: '账号管理'}
        },
        {path:'accountNumber/add',hidden: true,component:resourceManager_accountNumber_edit,name:'resourceManager_accountNumberManager_add',meta: {  title: '新增账号',tabsHidden: true}},
        {path:'accountNumber/edit/:id',hidden: true,component:resourceManager_accountNumber_edit,name:'resourceManager_accountNumberManager_edit',meta: { isEdit: true,  title: '修改账号',tabsHidden: true}},
        {
          path:'role',
          name:'resourceManager_role',
          component:resourceManager_role,meta: {  title: '角色管理'}
        },
        {path:'role/add',hidden: true,component:resourceManager_role_edit,name:'resourceManager_role_add',meta: {  title: '新增角色',tabsHidden: true}},
        {path:'role/edit/:id',hidden: true,component:resourceManager_role_edit,name:'resourceManager_role_edit',meta: { isEdit: true, title: '修改角色',tabsHidden: true}},
        {path:'role/dispense/:id',hidden: true,component:resourceManager_role_dispense,name:'resourceManager_role_dispense',meta: { isEdit: true, title: '分配权限',tabsHidden: true}},
        { path: 'sysRes', name:'resourceManager_sysRes', component: resourceManager_sysRes, meta: {  title: '菜单管理'}}
    ]
  }
];

export const otherRoterMap = [
  { path: '*', redirect: '/404', hidden: true }
];

export default new Router({
  //mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap.concat(asyncRouterMap,otherRoterMap)
});