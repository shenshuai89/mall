<template>
    <div class="header">
        <div class="navbar">
            <div class="navbar-left-container">
            <a @click="$router.push('/')">
                <img class="navbar-brand-logo" src="static/logo.png"></a>
            </div>
            <div class="navbar-right-container" style="display: flex;">
            <div class="navbar-menu-container">
                <span class="navbar-link" v-if="!!nickName">{{nickName}}</span>
                <!-- <span class="navbar-link" v-if="!!nick">{{nick}}</span> -->
                <!-- <router-link to="/register" v-if="this.$route.path == '/register' && !nickName" class="navbar-link">注册</router-link> -->
                <router-link to="/register" v-if="this.$route.path != '/register' && !nickName" class="navbar-link">注册</router-link>
                <!-- <a href="javascript:void(0)" @click="registerModalFlag = true" v-if="!nickName"  class="navbar-link">注册</a> -->
                <a href="javascript:void(0)" @click="loginModalFlag = true" v-if="!nickName" class="navbar-link">登录</a>
                <a href="javascript:void(0)" @click="logout" v-if="this.$route.path != '/register' && !!nickName" class="navbar-link">退出</a>
                <div class="navbar-cart-container" v-if="this.$route.path != '/cart'">
                    <span class="navbar-cart-count" v-if="cartCount >0">{{cartCount}}</span>
                    <a class="navbar-link navbar-cart-link" href="/#/cart">
                      <span class="icon-cart">
                      </span>
                    </a>
                </div>
            </div>
            </div>
        </div>
        <modal :mdShow="registerModalFlag" @close="closeRegisterModal">
          <div slot="message">
              <div class="md-top">
                <div class="md-title">注册账户</div>
              </div>
              <div class="confirm-tips">
                <div class="error-wrap">
                  <span class="error error-show" v-show="regError">两次输入密码不一致</span>
                </div>
                <ul>
                  <li class="regi_form_input">
                    <i class="icon IconPeople"></i>
                    <input type="text" tabindex="1" v-model="vName" class="regi_login_input regi_login_input_left" placeholder="请输入用户名" data-type="loginname">
                  </li>
                  <li class="regi_form_input noMargin">
                    <i class="icon IconPwd"></i>
                    <input type="password" tabindex="2" v-model="vPwd" class="regi_login_input regi_login_input_left login-input-no input_text" placeholder="请输入密码">
                  </li>
                  <li class="regi_form_input noMargin">
                      <i class="icon IconPwd"></i>
                      <input type="password" tabindex="3" v-model="vRepPwd" class="regi_login_input regi_login_input_left login-input-no input_text" placeholder="请再次输入密码">
                    </li>
                </ul>
              </div>
          </div>
          <div slot="btnGroup">
              <div class="login-wrap">
                  <span class="btn-login" :class="{'isClick':forbidBtn}" disabled='forbidBtn'>注 册</span>
              </div>
          </div>
        </modal>
        <div class="md-modal modal-msg md-modal-transition" :class="{'md-show':loginModalFlag}">
          <div class="md-modal-inner">
            <div class="md-top">
              <div class="md-title">登录账户</div>
              <button class="md-close" @click="closeLoginModal">关闭</button>
            </div>
            <div class="md-content">
              <div class="confirm-tips">
                <div class="error-wrap">
                  <span class="error error-show" v-show="errorTip">{{errorText}}</span>
                </div>
                <ul>
                  <li class="regi_form_input">
                    <i class="icon IconPeople"></i>
                    <input type="text" tabindex="1" name="loginname" v-model="userName" class="regi_login_input regi_login_input_left" placeholder="请输入用户名" data-type="loginname">
                  </li>
                  <li class="regi_form_input noMargin">
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
    </div>
</template>

<script>
import './../assets/css/login.css'
import '../../static/font.css'
import Modal from './Modal'
import axios from "axios"
export default{
    name:"navHeader",
    // props:['nick'],
    data(){
        return {
            errorTip:false,
            userName:"",
            userPwd:"",
            loginModalFlag:false,
            vName:'',
            vPwd:'',
            vRepPwd:'',
            registerModalFlag:false,
            errorText:''
        }
    },
    components:{ Modal },
    computed: {
      cartCount(){
        return this.$store.state.cartCount;
      },
      nickName(){
        return this.$store.state.nickName;
      },
      regError(){
        if(this.vPwd=='' || this.vRepPwd=='') {
          return;
        }else{
          return this.vPwd != this.vRepPwd;
        }
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
        if(!newVal) {
          this.errorTip = false;
        }
      }
    },
    mounted(){
      this.checkLogin();
    },
    methods:{
        // register(){
        //   if(this.vPwd=='' || this.vRepPwd=='' || this.vName =='') {
        //     return;
        //   }
        //   axios.post("/users/register",{
        //     userName:this.vName,
        //     userPwd:this.vPwd
        //   }).then((response)=>{
        //     let res = response.data;
        //     if(res.status == "0"){
        //       this.registerModalFlag = false;
        //       this.vName = '';
        //       this.vPwd = '';
        //       this.vRepPwd = '';
        //       this.userName = res.result.userName;
        //       this.userPwd = res.result.userPwd;
        //       this.login();
        //     }
        //   })
        // },
        login(){
            if(!this.userName || !this.userPwd){
                this.errorTip = true;
                this.errorText = "用户名或密码不可为空"
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
                    res.result.level == 1 ? this.$router.push("/admin") : this.$router.push("/")
                    // this.$router.push("/")
                    this.$store.commit("updateUserInfo",this.userName);
                    this.getCartCount();
                }else{
                    this.errorTip = true
                }
            })
        },
        logout(){
          axios.post("/users/logout").then((response) =>{
            let res = response.data;
            if(res.status =="0"){
              this.userName = '';
              this.userPwd = '';
              this.$store.commit("updateUserInfo","");
              this.$store.commit("initCartCount",0)
              this.$router.push("/")
            }
          })
        },
        checkLogin(){
          axios.get("/users/checkLogin").then((response)=>{
            let res = response.data;
            if(res.status == "0"){
              // this.nickName = res.result;
              this.$store.commit("updateUserInfo",res.result);
              this.getCartCount();
            }
          })
        },
        getCartCount(){
          axios.get("/users/cartCount").then((response) => {
            let res = response.data;
            if(res.status == "0"){
              this.$store.commit("initCartCount",res.result)
            }
          })
        },
        closeRegisterModal(){
          this.registerModalFlag = false;
        },
        closeLoginModal(){
          this.loginModalFlag = false;
          this.errorTip =false;
        }
    }
}

</script>

<style scoped>
.header {
    width: 100%;
    background-color: white;
    font-family: "moderat",sans-serif;
    font-size: 16px;
  }
  .navbar {
    display: flex;
    justify-content: space-between;
    align-content: center;
    width: 100%;
    height: 70px;
    max-width: 1280px;
    margin: 0 auto;
    padding: 5px 20px 10px 20px;
  }
  .navbar-left-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-left: -20px;
  }
  .header a, .footer a {
    color: #666;
    text-decoration: none;
  }
  a {
    -webkit-transition: color .3s ease-out;
    transition: color .3s ease-out;
  }
  .navbar-right-container {
    display: none;
    justify-content: flex-start;
    align-items: center;
  }
  .navbar-menu-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-top: 10px;
  }
  .navbar-link {
    padding-left: 15px;
  }
  .navbar-cart-container {
    position: relative;
  }
  .navbar-cart-count {
    justify-content: center;
    align-items: center;
    position: absolute;
    top: -9px;
    right: -11px;
    width: 20px;
    border-radius: 10px;
    color: white;
    background-color: #eb767d;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
  }
  .icon-cart{
    font-size: 28px;
    color: #333;
  }
  .isClick{
    background-color: #999;
    border: #ccc;
  }
</style>