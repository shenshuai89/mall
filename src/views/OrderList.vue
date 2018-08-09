<template>
    <div>
        <nav-header></nav-header>
        <nav-bread>
            <span>订单列表</span>
        </nav-bread>
        <div class="container">
            <h3>支付成功的订单</h3>
            <ul class="order-lists">
                <li v-for="(item,index) in successsOrder" class="order-list">
                    <p>
                        <span>第{{index+1}}个订单</span>   订单编号：{{item.orderId}}
                        <span style="float: right;margin-right: 20px; font-weight: bold;">订单总金额：{{item.orderTotal | currency('￥')}}</span>
                    </p>
                    <table width='100%' border="0" class="goodsList">
                        <tr><th></th><th>商品名称</th><th>商品数量</th><th>商品金额</th></tr>
                        <tr v-for="goods in item.goodsList">
                            <td>    <img :src="'http://localhost:3000/static/images/'+goods.productImage" alt=""></td>
                            <td class="name"> 
                                {{goods.productName}}</td>
                            <td>
                                {{goods.productNum}}
                            </td>
                            <td>
                                {{goods.productNum * goods.salePrice | currency('￥')}}
                            </td>
                        </tr>
                    </table>
                    <hr>
                </li>
            </ul>
            <h3>支付失败的订单</h3>
            <ul class="order-lists">
                    <li v-for="(item,index) in failOrder" class="order-list">
                        <p>
                            <span>第{{index+1}}个订单</span>   订单编号：{{item.orderId}}
                            <span style="float: right;margin-right: 20px; font-weight: bold;">
                                <button class="btn btn--red" style="padding: 0 20px;" @click="repayment(item.orderId)">重新支付</button>
                                订单总金额：{{item.orderTotal | currency('￥')}}
                            </span>
                        </p>
                        <table width='100%' border="0" class="goodsList">
                            <tr><th></th><th>商品名称</th><th>商品数量</th><th>商品金额</th></tr>
                            <tr v-for="goods in item.goodsList">
                                <td>    <img :src="'http://localhost:3000/static/images/'+goods.productImage" alt=""></td>
                                <td class="name"> 
                                    {{goods.productName}}</td>
                                <td>
                                    {{goods.productNum}}
                                </td>
                                <td>
                                    {{goods.productNum * goods.salePrice | currency('￥')}}
                                </td>
                            </tr>
                        </table>
                        <hr>
                    </li>
                </ul>
        </div>
        <nav-footer></nav-footer>
    </div>
</template>
<script>
    import NavHeader from "@/components/NavHeader";
    import NavFooter from "@/components/NavFooter";
    import NavBread from '@/components/NavBread.vue'
    import Modal from '@/components/Modal.vue'
    import axios from 'axios';
    import {currency} from "../assets/util.js";
    export default{
        name:"orderList",
        data(){
            return {
                orderList:[]
            }
        },
        components:{
            NavHeader,NavFooter,NavBread,Modal
        },
        mounted () {
            this.getOrderList()
        },
        computed: {
            successsOrder(){
                return this.orderList.filter((item) =>{
                    return item.orderStatus == '1';
                })
            },
            failOrder(){
                return this.orderList.filter((item) =>{
                    return item.orderStatus == '0'
                })
            }
        },
        methods: {
            getOrderList(){
                axios.get("/users/orderList").then(response => {
                    let res = response.data;
                    if(res.status == '0'){
                        console.log("object", res.result);
                        this.orderList = res.result;
                    }
                })
            },
            repayment(orderId){
                axios.post("/users/repayment",
                {
                    "orderId":orderId
                }
                ).then(response => {
                    let res = response.data;
                    if(res.status =="0"){
                        this.getOrderList();
                    }
                })
            }
        }
    }
</script>
<style scoped>
    h3{
        font-size: 24px;
        margin: 20px 0;
    }
    .order-lists{
        text-align: left;
    }
    .container .order-lists{
        font-size: 16px;
    }
    .order-list p{
        line-height: 64px;
    }
    .name{
        line-height: 100px;
    }
    tr{
        margin-top: 20px;
    }
    tr th{
        color:#999;
    }
    tr td img{
        width: 100px;
    }
    tr th, tr td{
        width: 25%;
    }
</style>