<template>
    <div style="position: relative; top: 60px; margin: 20px;width: 100%;">
        <table class="table is-striped is-hoverable is-bordered">
            <thead> 
                <tr>
                    <th>图片</th>
                    <th>名称</th>
                    <th>价格</th>
                </tr>
            </thead>
            <tr v-for="item in tableData" class="item_list">
                <td><img :src="'http://localhost:3000/static/images/'+item.productImage" alt=""  v-if="item.productImage">
                    <span v-if="!item.productImage">暂无图片</span>
                </td>
                <td>{{item.productName}}</td>
                <td>{{item.salePrice}}</td>
            </tr>
            <div class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
                <img v-if="loading" src="../../assets/loading-spinning-bubbles.svg" title="加载中" />
            </div>
        </table>
        
    </div>
</template>
<script>
    import axios from 'axios';
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
                isShowLoading:true
            }
        },
        mounted(){
            this.init()
        },
        methods: {
            init(isAddData){
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