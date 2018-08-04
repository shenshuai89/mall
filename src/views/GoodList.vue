<template>
  <div class="good-list">
    <nav-header></nav-header>
    <nav-bread>
      <span>商品页</span>
    </nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">排序:</span>
          <a href="javascript:void(0)" class="default cur" @click="setDefault">默认</a>
          <span @click="sortGoods" class="price">价格
            <span class="arrow">
              <span v-if="!sortFlag" class="icon-arrow-down"></span>
              <span v-if="sortFlag" class="icon-arrow-up"></span>
            </span>
          </span>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilter">筛选</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" :class="{'filterby-show':filterShow}" id="filter">
            <dl class="filter-price">
              <dt>价格:</dt>
              <dd><a @click="setPriceFilter('all')" href="javascript:void(0)" :class="{'cur':priceChecked=='all'}">全部</a></dd>
              <dd v-for="(item,index) in priceList">
                <a @click="setPriceFilter(index)" href="javascript:void(0)" :class="{'cur':priceChecked==index}">{{item.startPrice}} - {{item.endPrice}}</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="(item,index) in goodsList">
                  <div class="pic">
                    <img :src="'http://localhost:3000/static/images/'+item.productImage" alt="" v-if="item.productImage">
                    <img src="../../static/none.jpg" alt="" v-if="!item.productImage">
                  </div>
                  <div class="main">
                    <div class="name"><span class="small_info_head">产品名称:</span>{{item.productName}}</div>
                    <div class="price"><span class="small_info_head">单价:</span>{{item.salePrice | currency("￥")}}</div>
                    <div class="btn-area">
                      <span @click="addCart(item.productId)" class="btn btn--m">加入购物车</span>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="load-more" v-if="isShowLoading" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
                <img v-if="loading" src="../assets/loading-spinning-bubbles.svg" title="加载中" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overlayShow" @click.stop="closePop"></div>
    <modal :mdShow="mdShow" @close="closeModal">
      <p slot="message">请先登录，否则无法使用添加购物车功能！</p>
      <div slot="btnGroup">
        <a class="btn btn-m" @click="closeModal">关   闭</a>
      </div>
    </modal>
    <modal :mdShow="addSuccess" @close="closeModal">
      <p slot="message">添加购物车成功</p>
      <div slot="btnGroup">
        <a class="btn btn-m" @click="addSuccess = false">继 续 购 物</a>
        <router-link class="btn btn-m" @click="addSuccess = false" to="/cart">查看购物车</router-link>
      </div>
    </modal>
    <nav-footer></nav-footer>
  </div>
</template>

<script>
  import "../assets/css/product.css"
  import "../assets/css/login.css"
  import '../../static/font.css'
  import NavHeader from '@/components/NavHeader.vue'
  import NavFooter from '@/components/NavFooter.vue'
  import NavBread from '@/components/NavBread.vue'
  import Modal from '@/components/Modal.vue'
  import {currency} from "../assets/util.js"
  import axios from 'axios'
  export default {
    name: 'GoodList',
    data () {
      return {
        goodsList:[],
        sortFlag:true,
        mdShow:false,
        addSuccess:false,
        page:1,
        pageSize:8,
        priceList:[{
          startPrice:'0.00',
          endPrice:'100.00'
        },
        {
          startPrice:'100.00',
          endPrice:'500.00'
        },
        {
          startPrice:'500.00',
          endPrice:'1000.00'
        },
        {
          startPrice:'1000.00',
          endPrice:'5000.00'
        }],
        priceChecked:'all',
        filterShow:false,
        overlayShow:false,
        busy:true,
        isFirstLoad:true,
        loading:false,
        isShowLoading:true
      }
    },
    components:{
      NavHeader, NavFooter, NavBread, Modal
    },
    mounted(){
      this.getGoodsList(false);
    },
    methods:{
      getGoodsList(isAddData){
        var params = {
          page:this.page,
          pageSize:this.pageSize,
          sort:this.sortFlag ? 1 : -1,
          priceRange:this.priceChecked
        }
        this.loading = true;
        axios.get("/goods",{
          params:params
        }).then((response)=>{
          var res = response.data;
          this.loading = false;
          if(res.status == "0"){
            if(isAddData){
              // concat连接数组  push给数组加元素
              this.goodsList = this.goodsList.concat(res.result.list)
              if(res.result.count == 0){
                this.busy = true
                this.isShowLoading = false;
              }else{
                this.busy = false
              }
            }else{
              this.goodsList = res.result.list;
              this.busy = false;
            }
          }else{
            this.goodsList = []
          }
        })
      },
      sortGoods(){
        this.sortFlag =!this.sortFlag;
        this.page = 1;
        this.getGoodsList(false);
      },
      setPriceFilter(index){
        this.page = 1;
        this.priceChecked = index;
        this.filterShow = false;
        this.overlayShow = false;
        this.getGoodsList(false);
      },
      setDefault(){
        this.page = 1;
        this.priceChecked='all'
        this.filterShow = false;
        this.overlayShow = false;
        this.sortFlag = true;
        this.getGoodsList(false);
      },
      addCart(productId){
        // console.log("object",productId);
        axios.post("/goods/addCart",{
          productId:productId
        }).then( (response)=>{
          var res = response.data
          if(res.status=="0"){
            // alert("添加购物车成功")
            this.addSuccess = true
          }else{
            // alert("msg"+res.msg)
            this.mdShow = true
          }
        })
      },
      showFilter(){
        this.filterShow = true;
        this.overlayShow = true;
      },
      closePop(){
        this.filterShow = false;
        this.overlayShow = false;
      },
      loadMore(){
        if(this.isFirstLoad){
          this.isFirstLoad = false
          return ;
        }
        // console.log("满足加载更多条件，触发loadmore函数");
        this.busy = true;
        setTimeout(() => {
          this.page++;
          this.getGoodsList(true)
          this.busy = true;
        }, 200);
      },
      closeModal(){
        this.mdShow = false;
        this.addSuccess = false;
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.arrow img{
  width:15px;
}
.small_info_head{
  font-size: 12px;
  color: #666;
}
</style>
