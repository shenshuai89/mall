<template>
    <div style="position: relative; top: 60px; margin: 20px;width: 100%;">
        <table class="table is-striped is-hoverable is-bordered">
            <thead> 
                <tr>
                    <th>订单编号</th>
                    <th>创建时间</th>
                    <th>商品数量</th>
                    <th>收货地址</th>
                    <th>订单状态</th>
                </tr>
            </thead>
            <tr v-for="item in tableData" class="item_list">
                <td>{{item.orderId}}</td>
                <td>{{item.createDate}}</td>
                <td>{{item.goodsList.length}}</td>
                <td>{{item.addressInfo ? (item.addressInfo).split(",\n  ")[3].split(':')[1]:'地址有误'}}</td>
                <td v-if="item.orderStatus == 0" style="color: red">{{item.orderStatus == 0 ? "失败":"成功"}}</td>
                <td v-if="item.orderStatus == 1">{{item.orderStatus == 0 ? "失败":"成功"}}</td>
            </tr>
        </table>
        
    </div>
</template>
<script>
    import axios from 'axios';
    export default{
        name:"adminOrderList",
        data(){
            return{
                tableData: [],
            }
        },
        mounted(){
            this.init()
        },
        methods: {
            init(isAddData){
                axios.get("/users/allOrderList").then((response)=>{
                    var res = response.data;
                    var arr = res.result,allArr=[];
                    for(var i=0;i<arr.length;i++){
                        for(var j=0;j<arr[i].length;j++){
                            allArr.push(arr[i][j])
                        }
                    }
                    this.tableData = allArr;
                })
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