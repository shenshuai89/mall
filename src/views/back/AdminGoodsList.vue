<template>
    <div style="position: relative; top: 60px; margin: 20px;width: 100%;">
        <table class="table is-striped is-hoverable is-bordered">
            <thead> 
                <tr>
                    <th>图片</th>
                    <th>名称</th>
                    <th>价格</th>
                    <th>库存</th>
                    <th>编辑</th>
                </tr>
            </thead>
            <tr v-for="item in tableData" class="item_list">
                <td><img :src="'http://localhost:3000/static/images/'+item.productImage" alt=""  v-if="item.productImage">
                    <span v-if="!item.productImage">暂无图片</span>
                </td>
                <td>{{item.productName}}</td>
                <td>{{item.salePrice | currency("￥")}}</td>
                <td>{{item.stock}}</td>
                <!-- 通过params传参,在子页面通过{{$route.params.id}}接收 -->
                <td><router-link :to="{name:'AdminEditGoods', params:{productId:item.productId}}" tag="button" class="btn btn--s btn--red">编辑商品</router-link></td>
                <!-- 通过query传参,在子页面通过{{$route.query.id}}接收 -->
                <!-- <td><router-link :to="{path:'/admin/editGoods', query:{productId:item.productId}}">编辑商品</router-link></td> -->
            </tr>
            <div class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
                <img v-if="loading" src="../../assets/loading-spinning-bubbles.svg" title="加载中" />
            </div>
        </table>
        <modal :mdShow="mdShow" @close="closeModal">
            <p slot="message">{{modalMsg}}</p>
            <div slot="btnGroup">
                <a class="btn btn-m" @click="closeModal">关   闭</a>
            </div>
        </modal>
    </div>
</template>
<script>
    import axios from 'axios';
    import {currency} from "../../assets/util"
    import Modal from '@/components/Modal.vue'
    export default{
        name:"adminGoodsList",
        data(){
            return{
                tableData: [],
                page:1,
                pageSize:14,
                sortFlag:true,
                priceChecked:'all',
                busy:true,
                isFirstLoad:true,
                loading:false,
                isShowLoading:true,
                mdShow:false,
                modalMsg:"请先登录，否则无法使用此功能！"
            }
        },
        mounted(){
            this.init()
        },
        components:{
            Modal
        },
        methods: {
            init(isAddData){
                var params = {
                    page:this.page,
                    pageSize:this.pageSize,
                    sort:this.sortFlag ? 1 : -1,
                    priceRange:this.priceChecked,
                    routePath:this.$route.path
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
                        this.tableData = this.tableData.concat(res.result.list)
                        if(res.result.count == 0){
                            this.busy = true
                            this.isShowLoading = false;
                        }else{
                            this.busy = false
                        }
                        }else{
                            this.tableData = res.result.list;
                            this.busy = false;
                        }
                    }else{
                        this.tableData = []
                        this.modalMsg = res.msg
                        var _self = this;
                        this.$alert(res.msg, '返回主页', {
                            confirmButtonText: '确定',
                            callback: action => {
                                this.$router.push("/")
                            }
                        });
                    }
                })
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
                    this.init(true)
                    this.busy = true;
                }, 200);
            },
            closeModal(){
                this.mdShow = false;
            }
        }
    }
</script>
<style>
    .table{
        width: 100%;
        text-align: left;
        margin-bottom: 100px;
        background: #f1f4f7;
    }
    .table tr{
        height: 56px;
    }
    .table tr th, .table tr td{
        border: 1px solid #ccc;
        padding-left: 20px;
    }
    .item_list td img{
        width: 30px!important;
    }
    .item_list:hover{
        background: #f9f9f9;
    }
</style>