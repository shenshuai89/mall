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
                <td><button class="btn btn--s btn--red" @click="delUser(item.userId)">删除员工</button></td>
            </tr>
        </table>
        <modal :mdShow="mdShow" @close="closeModal">
            <p slot="message">当前用户没有权限！</p>
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
                axios.get("/users/workerList").then((response)=>{
                    var res = response.data;
                    if(res.status == 0){
                        this.tableData = res.result
                    }else{
                        this.mdShow = true;
                    }
                })
            },
            delUser(userId){
                this.$alert('确定删除该员工，删除后无法恢复，请慎重操作！', '删除员工', {
                confirmButtonText: '确定',
                callback: action => {
                    this.$message({
                        type: 'info',
                        message: `删除成功`
                    });
                    axios.post("/users/delUser", {
                        "userId":userId
                    }).then((response)=>{
                        let res = response.data;
                        if(res.status == 0){
                            this.init();
                        }
                    })
                }
                });
                
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