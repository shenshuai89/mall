<template>
    <div class="edit_user">
        <el-row>
            <el-col :span="6"><div class="grid-content">员工Id：</div></el-col>
            <el-col :span="18"><div class="grid-content">{{userId}} </div></el-col>
        </el-row>
        <el-row>
            <el-col :span="6"><div class="grid-content">员工姓名：</div></el-col>
            <el-col :span="18">
                <div v-if="!isEdit" class="grid-content">{{userName}}</div>
                <div v-if="isEdit" class="grid-content"><input type="text" v-model="userName"></div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="6"><div class="grid-content">员工电话：</div></el-col>
            <el-col :span="18">
                <div v-if="!isEdit" class="grid-content">{{phone}}</div>
                <div v-if="isEdit" class="grid-content"><input type="text" v-model="phone"></div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="6"><div class="grid-content">员工性别：</div></el-col>
            <el-col :span="18">
                <div v-if="!isEdit" class="grid-content">{{gender}}</div>
                <el-form v-if="isEdit" class="grid-content">
                    <el-form-item>
                        <el-select v-model="gender">
                            <el-option label="男" value="F"></el-option>
                            <el-option label="女" value="M"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="6"><div class="grid-content">部门：</div></el-col>
            <el-col :span="18">
                <div v-if="!isEdit" class="grid-content">{{department}}</div>
                <el-form v-if="isEdit" class="grid-content">
                    <el-form-item>
                        <el-select v-model="department">
                            <el-option label="总经理" value="总经理"></el-option>
                            <el-option label="人事部" value="人事部"></el-option>
                            <el-option label="仓库管理" value="仓库管理"></el-option>
                            <el-option label="客服部" value="客服部"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="6"><div class="grid-content">职级：</div></el-col>
            <el-col :span="18">
                <div v-if="!isEdit" class="grid-content">{{position}}</div>
                <el-form v-if="isEdit" class="grid-content">
                    <el-form-item>
                        <el-select v-model="position">
                            <el-option label="经理" value="经理"></el-option>
                            <el-option label="主管" value="主管"></el-option>
                            <el-option label="专员" value="专员"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="6"><div class="grid-content">在职状态：</div></el-col>
            <el-col :span="18">
                <div v-if="!isEdit" class="grid-content">{{positionstatus}}</div>
                <el-form v-if="isEdit" class="grid-content">
                    <el-form-item>
                        <el-select v-model="positionstatus">
                            <el-option label="在职" value="在职"></el-option>
                            <el-option label="请假" value="请假"></el-option>
                            <el-option label="离职" value="离职"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="6"><div class="grid-content">入职时间：</div></el-col>
            <el-col :span="18">
                <div v-if="!isEdit" class="grid-content">{{hiredate}}</div>
                <el-date-picker v-if="isEdit" 
                    v-model="hiredate"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy-MM-dd HH:mm:ss"
                    :editable = false
                    :picker-options="pickerOptions">
                </el-date-picker>
            </el-col>
        </el-row>

        <div class="btn-wrap">
            <a class="btn btn--m" v-if="!isReset" @click="isEdit = !isEdit;isReset=true">编辑员工信息</a>
            <a class="btn btn--m" v-if="isReset" @click="reset">重置员工信息</a>
            <a class="btn btn--m btn--red" @click="save">保存员工信息</a>
        </div>
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
    import {getFormatTime,getCookie} from "../../assets/util.js"
    export default{
        name:"adminOrderList",
        data(){
            return{
                tableData: [],
                mdShow:false,
                isEdit:false,
                isReset:false,
                resetObj:{},
                userId:'',
                userName:"",
                phone:'',
                gender:'',
                department:'',
                position:'',
                hiredate:'',
                positionstatus:'',
                pickerOptions:{
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                }
            }
        },
        mounted(){
            this.userId = this.$route.params.userId || getCookie('userId')
            this.init();
        },
        components:{
            Modal
        },
        methods: {
            init(){
                axios.post("/users/queryUser",{
                    "userId":this.userId
                }).then((response)=>{
                    let res = response.data;
                    if(res.status == 0){
                        this.resetObj = res.result;
                        this.userName = res.result.userName;
                        this.phone = res.result.phone;
                        this.hiredate = res.result.hiredate;
                        this.department = res.result.department;
                        this.position = res.result.position;
                        this.positionstatus = res.result.positionstatus;
                        this.gender = res.result.gender=="M"?"女":"男";
                    }else{
                        console.log("object 无权操作");
                    }
                })
            },
            save(){
                axios.post("/users/editUser",{
                    "userId":this.userId,
                    "userName":this.userName,
                    "phone":this.phone,
                    "gender":this.gender=="男"?"F":"M",
                    "hiredate":getFormatTime(this.hiredate) || this.hiredate,
                    "department":this.department,
                    "position":this.position,
                    "positionstatus":this.positionstatus
                }).then((response)=>{
                    let res = response.data;
                    if(res.status ==0){
                        this.isEdit = false;
                        this.$message({
                            message: '员工添加成功！',
                            type: 'success'
                        });
                        this.$router.push("/admin/userList");
                    }
                })

            },
            reset(){
                this.isEdit = !this.isEdit;
                this.userName = this.resetObj.userName;
                this.phone = this.resetObj.phone;
                this.department = this.resetObj.department;
                this.position = this.resetObj.position;
                this.hiredate = this.resetObj.hiredate;
                this.positionstatus = this.resetObj.positionstatus;
                this.gender = this.resetObj.gender=="M"?"女":"男";
                this.isReset=false;
            },
            closeModal(){
                this.mdShow = false;
            }
        }
    }
</script>
<style>
.edit_user{
    margin-top:70px; 
    text-align: left;
    margin-left: 20px;
    width: 100%;
}
.grid-content{
    font-size: 16px;
    margin: 10px 0;
    height: 36px;
    line-height: 36px;
}
.grid-content input{
    border: none;
    padding: 6px 12px;
    border-radius: 0.5rem;
}
.btn-wrap{
    margin-top: 30px;
}
.el-row{
    border-bottom: 1px solid #cccccc;
}
.el-date-editor.el-input{
    margin-top: 8px;
}
</style>