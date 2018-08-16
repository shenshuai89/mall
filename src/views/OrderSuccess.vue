<template>
    <div>
        <nav-header></nav-header>
        <div class="container">
            <div class="page-title-normal">
            <h2 class="page-title-h2"><span>结账</span></h2>
            </div>
            <!-- 进度条 -->
            <div class="check-step">
            <ul>
                <li class="cur"><span>确认</span>地址</li>
                <li class="cur"><span>查看</span>账单</li>
                <li class="cur"><span>账单</span>支付</li>
                <li class="cur"><span>账单确认</span> </li>
            </ul>
            </div>
        
            <div class="order-create">
            <div class="order-create-pic">
                <img v-if="orderStatus==1" src="../../static/success.png" alt="">
                <img v-if="orderStatus!=1" src="../../static/fail.png" alt=""></div>
            <div class="order-create-main">
                <h3><span v-if="orderStatus==1">恭喜您! <br>你的订单已经提交成功！</span>
                <span v-if="orderStatus!=1">很遗憾! <br>你的订单提交失败，请稍后重试。</span></h3>
                <p>
                <span>订单ID：{{orderId}}</span>
                <span>订单总金额：{{orderTotal | currency('￥')}}</span>
                </p>
                <div class="order-create-btn-wrap">
                <div class="btn-l-wrap">
                    <router-link to="/cart"class="btn btn--m">购物车页面</router-link>
                </div>
                <div class="btn-r-wrap">
                    <router-link to="/orderList"class="btn btn--m">订单列表页面</router-link>
                </div>
                </div>
            </div>
            </div>
        </div>
        <nav-footer></nav-footer>
    </div>
</template>
<script>
    import navHeader from "@/components/NavHeader";
    import navFooter from "@/components/NavFooter";
    import axios from 'axios';
    import {currency} from "../assets/util.js";
    export default{
        name:"orderSuccess",
        components:{
            navHeader, navFooter
        },
        data(){
            return{
                orderId:'',
                orderTotal:0,
                orderStatus:''
            }
        },
        mounted () {
            this.getOrderDetail()
        },
        methods: {
            getOrderDetail(){
                var orderId = this.$route.query.orderId;
                axios.get("/users/orderDetail",{
                    params:{
                        "orderId":orderId
                    }
                }).then(response => {
                    let res = response.data;
                    if(res.status == "0"){
                        this.orderId = res.result.orderId;
                        this.orderTotal = res.result.orderTotal;
                        this.orderStatus = res.result.orderStatus;
                    }
                })
            }
        }
    }
</script>