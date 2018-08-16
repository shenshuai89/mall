<template>
    <div class="cart">
        <nav-header></nav-header>
        <nav-bread>
            <span>购物车</span>
        </nav-bread>
        <div class="page-title-normal">
            <h2 class="page-title-h2"><span>我的购物车</span></h2>
        </div>
        <div class="item-list-wrap">
        <div class="cart-item">
            <div class="cart-item-head">
                <ul>
                    <li>产品</li>
                    <li>价格</li>
                    <li>数量</li>
                    <li>总价</li>
                    <li>编辑</li>
                </ul>
            </div>
            <ul class="cart-item-list">
            <li v-for="item in cartList">
                <div class="cart-tab-1">
                <div class="cart-item-check">
                    <a href="javascipt:;" class="checkbox-btn item-check-btn" 
                    :class="{'check':item.checked=='1'}" 
                    @click="editCart('checked',item)">
                        <span class="icon-checked-ok"></span>
                    </a>
                </div>
                <div class="cart-item-pic">
                    <img :src="'http://localhost:3000/static/images/'+item.productImage" :alt="item.productName">
                </div>
                <div class="cart-item-title">
                    <div class="item-name">{{item.productName}}</div>
                </div>
                </div>
                <div class="cart-tab-2">
                <div class="item-price">{{item.salePrice | currency("￥")}}</div>
                </div>
                <div class="cart-tab-3">
                <div class="item-quantity">
                    <div class="select-self select-self-open">
                    <div class="select-self-area">
                        <a class="input-sub" @click="editCart('reduce', item)">-</a>
                        <span class="select-ipt">{{item.productNum}}</span>
                        <a class="input-add" @click="editCart('add', item)">+</a>
                    </div>
                    </div>
                </div>
                </div>
                <div class="cart-tab-4">
                <div class="item-price-total">{{item.salePrice*item.productNum | currency("￥")}}</div>
                </div>
                <div class="cart-tab-5">
                    <span class="icon-delete" @click="delProduct(item)"></span>
                </div>
            </li>
            </ul>
        </div>
        </div>
        <div class="cart-foot-wrap">
        <div class="cart-foot-inner">
            <div class="cart-foot-l">
                <div class="item-all-check" @click="toggleCheckAll">
                    <a href="javascipt:;" >
                        <div class="checkbox-btn item-check-btn" :class="{'check':checkAll}">
                            <span class="icon-checked-ok"></span>
                        </div>
                        <span>全选</span>
                    </a>
                </div>
            </div>
            <div class="cart-foot-r">
                <div class="item-total">
                    总价: <span class="total-price">{{totalPrice | currency("￥")}}</span>
                </div>
                <div class="btn-wrap">
                    <a class="btn btn--red" :class="{'btn--dis':totalPrice==0}" @click="checkOut">提交订单</a>
                </div>
            </div>
        </div>
        </div>
        <nav-footer></nav-footer>
        <modal :mdShow="isShowLoginMd" @close="closeModal">
            <p slot="message">{{tipText}}</p>
            <div slot="btnGroup">
                <a class="btn btn-m" @click="isShowLoginMd = false">关闭</a>
                <a class="btn btn-m" @click="loginModalFlag = true;isShowLoginMd = false">点击登录</a>
            </div>
        </modal>
        <div class="md-overlay" v-if="loginModalFlag == true" @click="loginModalFlag = false;"></div>
        <modal :mdShow="isShowdelItem"  @close="closeModal">
            <p slot="message">是否确定要删除该商品？</p>
            <div slot="btnGroup">
                <a class="btn btn-m" @click="delConfirm">确定删除</a>
                <a class="btn btn-m" @click="isShowdelItem = false">取消</a>
            </div>
        </modal>
        <modal :mdShow="isShowReduceMd" @close="closeModal">
            <p slot="message">不能再减了，亲是要删除该商品吗？</p>
            <div slot="btnGroup">
                <a class="btn btn-m" @click="isShowReduceMd = false">关闭</a>
            </div>
        </modal>
        <modal :mdShow="isShowAddMd" @close="closeModal">
            <p slot="message">亲，已达到最大库存，不能再加！</p>
            <div slot="btnGroup">
                <a class="btn btn-m" @click="isShowAddMd = false">关闭</a>
            </div>
        </modal>
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
                      <i class="icon IconPeople"></i>
                      <input type="text" tabindex="1" name="loginname" v-model="userName" class="regi_login_input regi_login_input_left" placeholder="请输入用户名" data-type="loginname">
                    </li>
                    <li class="regi_form_input noMargin">
                      <i class="icon IconPwd"></i>
                      <input type="password" tabindex="2"  name="password" v-model="userPwd" class="regi_login_input regi_login_input_left login-input-no input_text" placeholder="请输入密码">
                    </li>
                  </ul>
                </div>
                <div class="login-wrap">
                  <span class="btn-login" @click="login">登 录</span>
                </div>
              </div>
            </div>
          </div>
    </div>
</template>
<script>
    import "../assets/css/checkout.css";
    import '../../static/font.css'
    import NavHeader from '@/components/NavHeader.vue'
    import NavFooter from '@/components/NavFooter.vue'
    import NavBread from '@/components/NavBread.vue'
    import Modal from '@/components/Modal.vue'
    import axios from 'axios'
    import {currency} from "../assets/util.js"
    export default{
        name:"cart",
        components:{
            NavHeader,NavFooter,NavBread,Modal
        },
        data(){
            return{
                cartList:[],
                isShowLoginMd:false,
                tipText:'',
                isShowdelItem:false,
                errorTip:false,
                userName:"",
                userPwd:"",
                loginModalFlag:false,
                productId:'',
                productNum:0,
                isShowReduceMd:false,
                isShowAddMd:false,
                allGoods:[]
            }
        },
        mounted () {
            this.init();
            this.getGoods();
        },
        computed:{
            nickName(){
                return this.$store.state.nickName;
            },
            checkAll(){
                if(this.cartList.length != 0){
                    return this.cartList.every((item)=>{
                        return item.checked == 1
                    })
                }else{
                    return false;
                }
            },
            totalPrice(){
                var money = 0;
                this.cartList.forEach((item)=>{
                    if(item.checked ==1){
                        money += parseFloat(item.salePrice) * parseInt(item.productNum)
                    }
                })
                return money;
            }
        },
        filters: {
            // 局部过滤器
            // currency:currency
        },
        methods:{
            getGoods(){
                axios.get("/goods").then((response)=>{
                    var res = response.data;
                    if(res.status == "0"){
                        this.allGoods = res.result.list;
                    }
                })
            },
            login(){
                if(!this.userName || !this.userPwd){
                    this.errorTip = true;
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
                        this.isShowLoginMd = false;
                        this.$store.commit("updateUserInfo",this.userName);
                        this.init();
                    }else{
                        this.errorTip = true
                    }
                })
            },
            init(){
                axios.get("/users/cartList").then((response) =>{
                    let res = response.data;
                    if(res.status == 0){
                        this.cartList = res.result;
                    }else if(res.status == 10001){
                        this.isShowLoginMd = true;
                        this.tipText = res.msg;
                    }
                })
            },
            delProduct(item){
                this.productId = item.productId;
                this.productNum = item.productNum;
                this.isShowdelItem = true
            },
            delConfirm(){
                axios.post("/users/cart/del", {productId:this.productId}).then((response)=>{
                    let res = response.data;
                    if(res.status == "0"){
                        this.isShowdelItem = false;
                        this.$store.commit('updateCartCount', -this.productNum)
                        this.init();
                    }
                })
            },
            editCart(params,obj){
                var stockNum;
                this.allGoods.forEach((item)=>{
                    item.productId == obj.productId ? stockNum = item.stock:''
                })
                switch(params){
                    case "checked":
                        obj[params] = obj[params] == 0 ? 1 : 0;
                        break;
                    case "add":
                        obj.productNum++;
                        if(obj.productNum>stockNum){
                            obj.productNum = stockNum;
                            this.isShowAddMd = true;
                            return;
                        }
                        this.$store.commit("updateCartCount",1)
                        break;
                    case "reduce":
                        if(obj.productNum>1){
                            obj.productNum--; 
                            this.$store.commit("updateCartCount",-1)
                        }else{
                            obj.productNum = 1;
                            this.isShowReduceMd = true;
                        }
                        break;
                }
                this.upDateCart(obj);
            },
            upDateCart(obj){
                axios.post("/users/editCart",{
                    "productId":obj.productId,
                    "productNum":obj.productNum,
                    "checked":obj.checked
                }).then((response)=>{
                    let res = response.data;
                })
            },
            closeModal(){
                this.isShowLoginMd =false;
                this.isShowdelItem = false;
                this.isShowReduceMd = false;
                this.isShowAddMd = false;
            },
            toggleCheckAll(){
                var flag = !this.checkAll;
                this.cartList.forEach((item) =>{
                    item.ckecked = flag ? 1 : 0
                })
                
                axios.post("/users/editCheckAll",  {
                    "checkAll":flag
                }).then((response)=>{
                    let res = response.data;
                    if(res.status == 0){
                        this.init();
                    }
                })
                
            },
            checkOut(){
                if(this.totalPrice>0){
                    this.$router.push("/address")
                }else{
                    return;
                }
            }
        }
    }
</script>
<style scoped>
    .input-sub,.input-add{
      min-width: 40px;
      height: 100%;
      border: 0;
      color: #605F5F;
      text-align: center;
      font-size: 16px;
      overflow: hidden;
      display: inline-block;
      background: #f0f0f0;
    }
    .item-quantity .select-self-area{
      background:none;
      border: 1px solid #f0f0f0;
    }
    .item-quantity .select-self-area .select-ipt{
      display: inline-block;
      padding:0 3px;
      width: 30px;
      min-width: 30px;
      text-align: center;
    }
    .cart-item-opration .item-edit-btn img{
        width: 22px;
    }
    .icon-checked-ok{
        font-size: 12px;
        color: #fff;
    }
    .icon-delete{
        font-size: 22px;
        cursor: pointer;
    }
    .item-all-check{
        position: relative;
    }
    .item-all-check .icon-checked-ok{
        position: absolute;
        left: 4px;
        top: 21px;
    }
</style>