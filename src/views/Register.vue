<template>
    <div class="register">
        <nav-header></nav-header>
        <nav-bread>
            <span>注册</span>
        </nav-bread>
        <div class="content">
            <h2 class="md-top">
                注册新用户
            </h2>
            <div class="md-content">
                <div class="confirm-tips">
                    <div class="error-wrap">
                        <span class="error error-show" v-show="regError">两次输入密码不一致</span>
                    </div>
                    <ul>
                            <li class="regi_form_input">
                                <span class="red_tip ml-10">*</span>
                                <i class="icon IconPeople"></i>
                                <input type="text" tabindex="1" v-model="vName" class="regi_login_input regi_login_input_left" placeholder="请输入用户名" data-type="loginname">
                            </li>
                            <li class="regi_form_input noMargin">
                                <span class="red_tip ml-10">*</span>
                                <i class="icon IconPwd"></i>
                                <input type="password" tabindex="2" v-model="vPwd" class="regi_login_input regi_login_input_left login-input-no input_text" placeholder="请输入密码">
                            </li>
                            <li class="regi_form_input noMargin">
                                <span class="red_tip ml-10">*</span>
                                <i class="icon IconPwd"></i>
                                <input type="password" tabindex="3" v-model="vRepPwd" class="regi_login_input regi_login_input_left login-input-no input_text" placeholder="请再次输入密码">
                            </li>
                    </ul>
                </div>
                <div class="login-wrap">
                    <span class="btn-login" :class="{'isClick':forbidBtn}" disabled='forbidBtn' @click="register">注 册</span>
                </div>
            </div>
        </div>
        <div class="md-overlay" v-if="registerModalFlag == true" @click="registerModalFlag = false;"></div>
        <div class="md-modal modal-msg md-modal-transition" :class="{'md-show':loginModalFlag}">
            <div class="md-modal-inner">
                <div class="md-top">
                <div class="md-title">登录账户</div>
                <button class="md-close" @click="loginModalFlag = false">关闭</button>
                </div>
                <div class="md-content">
                <div class="confirm-tips">
                    <div class="error-wrap">
                        <span class="error error-show" v-show="errorTip">用户名或密码输入有误</span>
                    </div>
                    <ul>
                        <li class="regi_form_input">
                            <span>*</span>
                            <i class="icon IconPeople"></i>
                            <input type="text" tabindex="1" name="loginname" v-model="userName" class="regi_login_input regi_login_input_left" placeholder="请输入用户名" data-type="loginname">
                        </li>
                        <li class="regi_form_input noMargin">
                            <span>*</span>
                            <i class="icon IconPwd"></i>
                            <input type="password" tabindex="2"  name="password" v-model="userPwd" class="regi_login_input regi_login_input_left login-input-no input_text" placeholder="请输入密码" @keyup.enter="login">
                        </li>
                    </ul>
                </div>
                <div class="login-wrap">
                    <span class="btn-login" @click="login">登 录</span>
                </div>
                </div>
            </div>
        </div>
        <div class="md-overlay" v-if="loginModalFlag == true" @click="loginModalFlag = false;"></div>
        <confirm v-model="showConfirm"
            confirm-text="登录"
            @on-cancel="onCancel"
            @on-confirm="onConfirm">
            <p style="text-align:center;">注册成功，点击去登录</p>
        </confirm>
        <loading :show="showLoading" text="注册失败，稍后重试"></loading>
        <nav-footer></nav-footer>
    </div>
</template>
<script>
    import NavHeader from '@/components/NavHeader.vue'
    import NavFooter from '@/components/NavFooter.vue'
    import NavBread from '@/components/NavBread.vue'
    import Modal from '@/components/Modal'
    import axios from 'axios'
    import { Loading, Confirm } from 'vux'
    export default{
        name:'register',
        data(){
            return{
                errorTip:false,
                userName:"",
                userPwd:"",
                loginModalFlag:false,
                vName:'',
                vPwd:'',
                vRepPwd:'',
                registerModalFlag:false,
                showLoading:false,
                showConfirm:false
            }
        },
        components:{
            NavHeader, NavFooter, NavBread, Loading, Confirm, Modal
        },
        computed: {
            regError(){
                if(this.vPwd=='' || this.vRepPwd=='') return;
                    return this.vPwd != this.vRepPwd;
                },
            forbidBtn(){
                if(this.vPwd=='' || this.vRepPwd=='' || this.vName ==''){
                    return true;
                }else{
                    return false;
                }
            }
        },
        watch: {
            userPwd(newVal,oldVal){
                if(newVal == '') {
                    this.errorTip = false;
                }
            }
        },
        mounted () {
            
        },
        methods: {
            register(){
                if(this.vPwd=='' || this.vRepPwd=='' || this.vName =='') {
                    return;
                }
                axios.post("/users/register",{
                    userName:this.vName,
                    userPwd:this.vPwd
                    }).then((response)=>{
                    let res = response.data;
                    if(res.status == "0"){
                        // 注册成功
                        this.registerModalFlag = false;
                        this.vName = '';
                        this.vPwd = '';
                        this.vRepPwd = '';
                        this.userName = res.result.userName;
                        this.userPwd = res.result.userPwd;
                        this.showConfirm = true;
                    }else{
                        // 注册失败
                        this.showLoading = true;
                        setTimeout(() => {
                            this.showLoading = false;
                        }, 2000)
                    }
                })
            },
            login(){
                if(!this.userName || !this.userPwd){
                    // this.errorTip = true;
                    return;
                }
                axios.post("/users/login", {
                    userName:this.userName,
                    userPwd:this.userPwd
                }).then((response) => {
                    let res= response.data;
                    if(res.status == "0"){
                        this.errorTip = false;
                        this.loginModalFlag = false;
                        this.$router.push("/")
                        this.$store.commit("updateUserInfo",this.userName);
                        // this.getCartCount();
                    }else{
                        this.errorTip = true
                    }
                })
            },
            onCancel(){
                console.log("点击了取消按钮");
            },
            onConfirm(){
                this.loginModalFlag = true;
                this.login();
            },
            onHide(){
                console.log("object 点击确定隐藏");
            }
        }
    }
</script>
<style>
    .register .content{
        max-width: 500px;
        min-width: 300px;
        width: 50%;
        margin: 30px auto;
    }
    .register .content .md-top{
        margin: 20px 0;
    }
    .red_tip{
        color:#d31723;
    }
    .ml-10{
        float: left;
        margin-left: -16px;
    }
    .regi_form_input{
        margin-left: 20px;
    }
</style>