<template>
    <div style="position: relative; top: 60px; margin: 20px;width: 100%;">
        <table class="table is-striped is-hoverable is-bordered">
            <thead> 
                <tr>
                    <th>订单编号</th>
                    <th>订单状态</th>
                    <th>订单金额</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tr v-for="item in tableData" class="item_list">
                <td>{{item.orderId}}</td>
                <td v-if="item.orderStatus == 0" style="color: red">{{item.orderStatus == 0 ? "失败":"成功"}}</td>
                <td v-if="item.orderStatus == 1">{{item.orderStatus == 0 ? "失败":"成功"}}</td>
                <td>{{item.orderTotal | currency("￥")}}</td>
                <td><el-button class="btn btn--s btn--red" @click="open2">删除</el-button></td>
            </tr>
        </table>
    </div>
</template>
<script>
    import axios from 'axios';
    import {currency} from "../../assets/util.js"
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
            open2() {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
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