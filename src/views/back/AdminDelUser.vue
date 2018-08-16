<template>
    <div style="position: relative; top: 60px; margin: 20px;width: 100%;">
        将level=2的员工改给level=3，可以删员工
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
            init(isAddData){
                axios.get("/users/allOrderList").then((response)=>{
                    var res = response.data;
                    if(res.status == 0){
                        var arr = res.result,allArr=[];
                        for(var i=0;i<arr.length;i++){
                            for(var j=0;j<arr[i].length;j++){
                                allArr.push(arr[i][j])
                            }
                        }
                        this.tableData = allArr;
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