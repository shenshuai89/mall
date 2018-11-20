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
                    <th>设为员工</th>
                </tr>
            </thead>
            <tr v-for="item in tableData" class="item_list">
                <td>{{item.userName}}</td>
                <td>{{item.phone}}</td>
                <td>{{item.position}}</td>
                <td>{{item.department}}</td>
                <td>{{item.positionstatus}}</td>
                <td>{{item.gender == "F" ? "男":"女"}}</td>
                <td><router-link :to="{name:'AdminEditUser', params:{userId:item.userId}}" tag="button" class="btn btn--s btn--red">增设员工</router-link></td>
            </tr>
        </table>
        <modal :mdShow="mdShow" @close="closeModal">
            <p slot="message">当前用户没有权限</p>
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
            init(isAddData){
                axios.post("/users/addUser").then((response)=>{
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