import Vue from 'vue';
import VueRouter from 'vue-router';
import signIn from '../views/Login/signIn'
import Home from '../views/Login/Home'
import Welcome from '../views/Login/Welcome'
import Users from '../views/Login/Users'
import Rights from '../views/power/Rights'
import Roles from '../views/power/Roles'
import Cate from '../views/goods/cate'
import Params from '../views/goods/Params'
import Goods from '../views/goods/Goods'
import Add from '../views/goods/Add'
import orders from '../views/order/orders'
import reports from '../views/report/reports'

Vue.use(VueRouter);

const routes = [
  {
    path: '/', redirect:'/signin'
  },
  {
    name: 'signin', path: '/signin', component: signIn,
  },
  {
    name: 'home', path: '/home',component:Home/* ,redirect: '/home/welcome'*/,children: [
      { name: 'welcome', path: '/welcome', component: Welcome },
      { name: 'users', path: '/users', component: Users },
      { name: 'rights', path: '/rights', component: Rights },
      { name: 'roles', path: '/roles', component: Roles },
      { name: 'cate', path: '/categories', component: Cate },
      { name: 'params', path: '/params', component: Params },
      { name: 'goods', path: '/goods', component: Goods },
      { name: 'add', path: '/goods/add', component: Add },
      { name: 'orders', path: '/orders', component: orders },
      {name:'reports',path:'/reports',component:reports}
    ]
  },
]

const router = new VueRouter({
  routes,
  mode : 'history',
})

//router.beforeEach((to, from, next) => {
  //to将要访问的路径
  //from代表从哪里来
  //next是一个函数，表示放行
  //if (to.path === '/signin') return next()
  //const tokenStr = window.sessionStorage.getItem('token')
  //if (!tokenStr) return next('/signin')
  //next()
//})

const originalPush = VueRouter.prototype.push
   VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}

export default router;