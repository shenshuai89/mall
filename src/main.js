// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import infiniteScroll from 'vue-infinite-scroll'
import VCharts from 'v-charts'
import VueLazyLoad from 'vue-lazyload'
import {currency} from "./assets/util"

Vue.config.productionTip = false
Vue.use(ElementUI);

Vue.use(VCharts)

Vue.use(VueLazyLoad, {
  loading:"/static/loading-svg/loading-bubbles.svg"
})
Vue.use(infiniteScroll);
// 定义全局过滤器
Vue.filter("currency", currency)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
