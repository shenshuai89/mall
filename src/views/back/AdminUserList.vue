<template>
    <div style="position: relative; top: 60px; margin: 20px;width: 100%;">
        <table class="table is-striped is-hoverable is-bordered">
            <thead> 
                <tr>
                    <th>用户名</th>
                    <th>电话</th>
                    <th>职位</th>
                    <th>部门</th>
                    <th>状态</th>
                    <th>性别</th>
                    <th>入职时间</th>
                </tr>
            </thead>
            <tr v-for="item in tableData" class="item_list">
                <td>{{item.userName}}</td>
                <td>{{item.phone}}</td>
                <td>{{item.position}}</td>
                <td>{{item.department}}</td>
                <td>{{item.positionstatus}}</td>
                <td >{{item.gender == "F" ? "男":"女"}}</td>
                <td >{{item.hiredate}}</td>
            </tr>
        </table>
        <modal :mdShow="mdShow" @close="closeModal">
            <p slot="message">请先登录，否则无法使用此功能！</p>
            <div slot="btnGroup">
                <a class="btn btn-m" @click="closeModal">关   闭</a>
            </div>
        </modal>
    </div>
</template>
<script>
    import axios from 'axios';
    import Modal from '@/components/Modal.vue'
    export default{
        name:"adminOrderList",
        data(){
            return{
                tableData: [],
                mdShow:false
            }
        },
        mounted(){
            this.init()
        },
        components:{
            Modal
        },
        methods: {
            init(){
                axios.get("/users/userList").then((response)=>{
                    var res = response.data;
                    if(res.status == 0){
                        this.tableData = res.result;
                    }else{
                        this.mdShow = true;
                    }
                })
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