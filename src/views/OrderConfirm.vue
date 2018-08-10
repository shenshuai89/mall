<template>
    <div>
        <nav-header></nav-header>
        <nav-bread>
            <span>查看账单</span>
        </nav-bread>
        <div class="container">
          <div class="checkout-order">
            <div class="page-title-normal">
              <h2 class="page-title-h2"><span>结账</span></h2>
            </div>
            <!-- process step -->
            <div class="check-step">
              <ul>
                <li class="cur"><span>确认</span>地址</li>
                <li class="cur"><span>查看</span>账单</li>
                <li><span>账单</span>支付</li>
                <li><span>账单</span>确认</li>
              </ul>
            </div>
      
            <!-- order list -->
            <div class="page-title-normal checkout-title">
              <h2><span>账单详情</span></h2>
            </div>
            <div class="item-list-wrap confirm-item-list-wrap">
              <div class="cart-item order-item">
                <div class="cart-item-head">
                  <ul>
                    <li>账单商品</li>
                    <li>价格</li>
                    <li>数量</li>
                    <li>总价</li>
                  </ul>
                </div>
                <ul class="cart-item-list">
                  <li v-for="(item,index) in cartList">
                    <div class="cart-tab-1">
                      <div class="cart-item-pic">
                        <img :src="'http://localhost:3000/static/images/'+item.productImage" alt="item.productName">
                      </div>
                      <div class="cart-item-title">
                        <div class="item-name">{{item.productName}}</div>
      
                      </div>
                    </div>
                    <div class="cart-tab-2">
                      <div class="item-price">{{item.salePrice | currency("￥")}}</div>
                    </div>
                    <div class="cart-tab-3">
                      <div class="item-quantity">
                        <div class="select-self">
                          <div class="select-self-area">
                            <span class="select-ipt">×{{item.productNum}}</span>
                          </div>
                        </div>
                        <div class="item-stock item-stock-no">现货</div>
                      </div>
                    </div>
                    <div class="cart-tab-4">
                      <div class="item-price-total">{{item.salePrice*item.productNum | currency("￥")}}</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
      
            <!-- Price count -->
            <div class="price-count-wrap">
              <div class="price-count">
                <ul>
                  <li>
                    <span>货物总价:</span>
                    <span>{{sumTotal | currency("￥")}}</span>
                  </li>
                  <li>
                    <span>运费:</span>
                    <span>{{shipping | currency("￥")}}</span>
                  </li>
                  <li>
                    <span>折扣:</span>
                    <span>{{discount | currency("￥")}}</span>
                  </li>
                  <li>
                    <span>赋税:</span>
                    <span>{{tax | currency("￥")}}</span>
                  </li>
                  <li class="order-total-price">
                    <span>账单总价:</span>
                    <span>{{orderTotal | currency("￥")}}</span>
                  </li>
                </ul>
              </div>
            </div>
      
            <div class="order-foot-wrap">
              <div class="prev-btn-wrap">
                <router-link to="/address" class="btn btn--m">上一项</router-link>
              </div>
              <div class="next-btn-wrap">
                <button class="btn btn--m btn--red" @click="payment">确认并支付</button>
              </div>
            </div>
          </div>
        </div>
        <nav-footer></nav-footer>
      </div>
</template>
<script>
    import NavHeader from '@/components/NavHeader.vue'
    import NavFooter from '@/components/NavFooter.vue'
    import NavBread from '@/components/NavBread.vue'
    import Modal from '@/components/Modal.vue'
    import axios from 'axios'
    import {currency, getCookie} from "../assets/util.js"
    export default{
        name:"confirm",
        data(){
            return{
                cartList:[],
                shipping:0,
                discount:200,
                tax:166,
                sumNumber:0,
                sumTotal:0,
                orderTotal:0,
                allGoods:[]
            }
        },
        components:{
            NavHeader,NavFooter,NavBread,Modal
        },
        mounted(){
            this.getCartItem();
            this.getAllGoods();
        },
        methods: {
            getCartItem(){
                if(!getCookie("userId")) return;
                axios.get("/users/cartList").then((response) => {
                    let res = response.data;
                    this.cartList = res.result.filter(item => {
                        return item.checked == '1'
                    })
                    this.cartList.forEach(item =>{
                        this.sumTotal += item.salePrice*item.productNum;
                        this.sumNumber += item.productNum;
                    })
                    this.orderTotal = this.sumTotal +this.shipping+this.tax -this.discount;
                })
            },
            getAllGoods(){
              axios.get("/goods",{params:{}}).then(response => {
                let res = response.data;
                this.allGoods = res.result.list;
              })
            },
            payment(){
                var addressId = this.$route.query.addressId;
                axios.post("/users/payment",{
                    "addressId":addressId,
                    "orderTotal":this.orderTotal,
                    "stock":this.sumNumber
                }).then(response => {
                    let res = response.data;
                    if(res.status == "0"){
                        this.$router.push("/orderSuccess?orderId="+res.result.orderId)
                    }
                })

                for(var i=0;i<this.cartList.length;i++){
                  for(var j=0;j<this.allGoods.length;j++){
                    if(this.cartList[i].productId == this.allGoods[j].productId){
                      axios.post("/goods/reduceStock",{
                        "productNum":this.cartList[i].productNum,
                        "productId":this.cartList[i].productId
                      }).then(response => {
                        let res = response.data;
                        console.log(res);
                      })
                    }
                  }
                }
                
            }
        }
    }
</script>
<style>
    .price-count-wrap{
        display: table;
        width: 96%;
        max-width: 1200px;
        margin: 20px auto;
    }
    .order-foot-wrap{
        display: table;
        width: 96%;
        max-width: 1200px;
        margin: 0 auto;
    }
</style>