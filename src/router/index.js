import Vue from 'vue'
import Router from 'vue-router'
import Register from '@/views/Register'
import GoodList from '@/views/GoodList'
import Cart from '@/views/Cart'
import mallAddress from '@/views/Address'
import OrderConfirm from '@/views/OrderConfirm'
import OrderSuccess from '@/views/OrderSuccess'
import OrderList from '@/views/OrderList'
import Admin from '@/views/back/Admin'
import AdminGoodsList from '@/views/back/AdminGoodsList'
import AdminAddGoods from '@/views/back/AdminAddGoods'
import AdminEditGoods from '@/views/back/AdminEditGoods'
import AdminOrderList from '@/views/back/AdminOrderList'
import AdminOrderDel from '@/views/back/AdminOrderDel'
import AdminOrderChart from '@/views/back/AdminOrderChart'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'GoodList',
      component: GoodList
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path:"/cart",
      name:"Cart",
      component: Cart
    },
    {
      path:"/address",
      name:"mallAddress",
      component: mallAddress
    },
    {
      path:"/orderConfirm",
      name:"OrderConfirm",
      component: OrderConfirm
    },
    {
      path:'/orderSuccess',
      name:'OrderSuccess',
      component:OrderSuccess
    },
    {
      path:"/orderList",
      name:'orderList',
      component: OrderList
    },
    {
      path:'/admin',
      name:'AdminHome',
      component:Admin,
      children:[
        { path: '', redirect:'goodsList' },
        { path: 'goodsList', name:"AdminGoodsList",component: AdminGoodsList },
        { path: 'addGoods', name:"AdminAddGoods",component: AdminAddGoods },
        { path: 'editGoods/:productId', name:"AdminEditGoods",component: AdminEditGoods },
        { path: 'orderList', name:"AdminOrderList",component: AdminOrderList },
        { path: 'orderDel', name:"AdminOrderDel",component: AdminOrderDel },
        { path: 'orderChart', name:"AdminOrderChart",component: AdminOrderChart },
      ]
    }
  ]
})
