<template>
    <div>
        <nav-header></nav-header>
        <nav-bread>
            <span>收货地址</span>
        </nav-bread>
        <div class="checkout-page">
            <div class="container">
              <div class="checkout-addr">
                <div class="page-title-normal">
                  <h2 class="page-title-h2"><span>check out</span></h2>
                </div>
                <!-- process step -->
                <div class="check-step">
                  <ul>
                    <li class="cur"><span>确认</span> 地址</li>
                    <li><span>查看</span> 账单</li>
                    <li><span>提交</span> 账单</li>
                    <li><span>交易</span> 确认</li>
                  </ul>
                </div>
          
                <!-- address list -->
                <div class="page-title-normal checkout-title">
                  <h2><span>购物地址</span></h2>
                </div>
                <div class="addr-list-wrap">
                  <div class="addr-list">
                    <ul>
                      <li v-for="(item,index) in addressListFilter" :class="{'check':checkedIndex == index}" @click="selectAddress(item,index)">
                        <dl>
                          <dt>{{item.userName}}</dt>
                          <dd class="address">{{item.streetName}}</dd>
                          <dd class="tel">{{item.tel}}</dd>
                        </dl>
                        <div class="addr-opration addr-del"  @click="delAddress(item.addressId)">
                          <span class="icon-delete"></span>
                        </div>
                        <div class="addr-opration addr-set-default">
                          <a href="javascript:;" class="addr-set-default-btn" v-if="!item.isDefault" @click="setDefaultAddress(item.addressId)"><i>设置为默认</i></a>
                        </div>
                        <div class="addr-opration addr-default" v-if="item.isDefault">默认地址</div>
                      </li>
                      <li class="addr-new">
                        <div class="add-new-inner" @click="addAddress">
                          <span class="icon-add">
                          </span>
                          <p>添加一个新的购物地址</p>
                        </div>
                      </li>
                    </ul>
                  </div>
          
                  <div class="shipping-addr-more">
                    <a class="addr-more-btn up-down-btn" href="javascript:;" @click="isMoreAddress" :class="{'open': limit >3}">
                      更多
                      <i class="i-up-down">
                        <i class="i-up-down-l"></i>
                        <i class="i-up-down-r"></i>
                      </i>
                    </a>
                  </div>
                </div>
          
                <!-- shipping method-->
                <div class="page-title-normal checkout-title">
                  <h2><span>购物方式</span></h2>
                </div>
                <div class="lemall-msg-info hidden">
                  <span>您选择的区域不在我们的交付区域内。请选择另一个送货地址。</span>
                </div>
                <div class="shipping-method-wrap">
                  <div class="shipping-method">
                    <ul>
                      <li class="check">
                        <div class="name">基础购物</div>
                        <div class="price">包邮</div>
                        <div class="shipping-tips">
                          <p>一旦发货,订单应该在1 - 7工作日抵达目的地</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="next-btn-wrap">
                  <router-link class="btn btn--m btn--red" :to="{path:'orderConfirm', query:{'addressId':selectedAddress}}">下一步</router-link>
                </div>
              </div>
            </div>
          </div>
          <nav-footer></nav-footer>
          <div class="md-modal modal-msg md-modal-transition" :class="{'md-show':addAddressMdShow}" v-if="addAddressMdShow" @close="closeAddAddressModal">
              <div class="md-top">
                <div class="md-title">添加一个收货地址</div>
              </div>
                <ul>
                  <li class="regi_form_input">
                    <i class="icon IconPeople"></i>
                    <input type="text" tabindex="1" v-model="vName" class="regi_login_input regi_login_input_left" placeholder="请输入收货人姓名" data-type="loginname">
                  </li>
                  <li class="regi_form_input noMargin">
                    <i class="icon IconPhone"></i>
                    <input type="text" tabindex="2" v-model="vPhone" class="regi_login_input regi_login_input_left login-input-no input_text" placeholder="请输入电话">
                  </li>
                  <x-address @on-hide="logHide" @on-show="logShow" :title="title" value-text-align="left" v-model="addressValue" :list="addressData" @on-shadow-change="onShadowChange" placeholder="请选择省市区" :show.sync="showAddress"></x-address>
                  <li class="regi_form_input noMargin">
                      <i class="icon IconAddress"></i>
                      <input type="text" tabindex="3" v-model="vAddress" class="regi_login_input regi_login_input_left login-input-no input_text" placeholder="请输入详细具体地址">
                    </li>
                </ul>
            <div slot="btnGroup">
              <a class="btn btn--m" @click="confirmAddAddress">确定</a>
              <a class="btn btn--m" @click="addAddressMdShow = false">取消</a>
            </div>
          </div>
          <div class="md-overlay" v-if="addAddressMdShow == true" @click="addAddressMdShow = false"></div>
          <modal :mdShow="delAddressMdShow" @close="closeDelAddressModal">
            <p slot="message">
              确定删除该地址？
            </p>
            <div slot="btnGroup">
              <a class="btn btn--m" @click="confirmDelAddress">确定</a>
              <a class="btn btn--m" @click="delAddressMdShow = false">取消</a>
            </div>
          </modal>
    </div>
</template>
<script>
    import '../../static/font.css'
    import NavHeader from '@/components/NavHeader.vue'
    import NavFooter from '@/components/NavFooter.vue'
    import NavBread from '@/components/NavBread.vue'
    import Modal from '@/components/Modal.vue'
    import axios from 'axios'
    import { XAddress,ChinaAddressV4Data } from 'vux'
    import {currency, getCookie} from "../assets/util.js"
    export default{
        name:"mallAddress",
        data(){
            return{
                addressList:[],
                limit:3,
                checkedIndex:-1,
                addAddressMdShow:false,
                delAddressMdShow:false,
                addressIdValue:0,
                selectedAddress:'',
                vName:'',
                vPhone:'',
                vAddress:'',

                title: '选择省 市 区',
                addressValue: [],
                addressData: ChinaAddressV4Data,
                showAddress: false,
                provinceCityDistrict:''
            }
        },
        components:{
            NavHeader,NavFooter,NavBread,Modal,XAddress
        },
        mounted () {
          this.getAddressList();  
        },
        computed:{
            addressListFilter(){
                return this.addressList.slice(0,this.limit)
            }
        },
        methods: {
            getAddressList(){
              if(!getCookie("userId")) return;
                axios.get("/users/addressList").then((response) => {
                    let res = response.data
                    this.addressList = res.result;

                    if(!this.selectedAddress){
                      this.selectedAddress = this.addressList.map((item) => {
                        if(item.isDefault == true){
                          return item.addressId
                        }
                      })
                    }
                })
                
            },
            isMoreAddress(){
                if(this.addressListFilter.length == 3){
                    this.limit = this.addressList.length
                }else{
                    this.limit = 3
                }
            },
            selectAddress(obj,index){
              this.checkedIndex = index;
              this.selectedAddress = obj.addressId
            },
            setDefaultAddress(id){
              axios.post("/users/setDefaultAddress",{
                "addressId":id
              }).then((response)=>{
                let res = response.data;
                if(res.status == "0"){
                  this.getAddressList();
                }
              })
            },
            addAddress(){
              this.addAddressMdShow = true;
            },
            delAddress(addressId){
              this.delAddressMdShow = true;
              this.addressIdValue = addressId;
            },
            confirmAddAddress(){
              if(this.vName == '' || this.vPhone == '' || this.vAddress == '' || this.addressValue == []) return;
              axios.post("/users/addAddress",{
                "userName":this.vName,
                "tel":this.vPhone,
                "streetName":this.provinceCityDistrict+this.vAddress
              }).then((response)=>{
                let res = response.data;
                if(res.status == "0"){
                  this.vName = '';
                  this.vPhone = '';
                  this.vAddress = '';
                  this.addressValue = [];
                  this.getAddressList();
                  this.addAddressMdShow = false;
                }
              })
            },
            confirmDelAddress(){
              axios.post("/users/delAddress", {
                "addressId":this.addressIdValue
              }).then((response) => {
                let res = response.data;
                if(res.status=="0"){
                  this.getAddressList();
                  this.delAddressMdShow = false;
                }
              })
            },
            closeAddAddressModal(){
              this.addAddressMdShow = false;
            },
            closeDelAddressModal(){
              this.delAddressMdShow = false;
            },

            doShowAddress () {
              this.showAddress = true
              setTimeout(() => {
                this.showAddress = false
              }, 2000)
            },
            onShadowChange (ids, names) {
              // console.log(names.join(''))
              this.provinceCityDistrict = names.join('');
            },
            changeData () {
            },
            changeDataByLabels () {
            },
            changeDataByLabels2 () {
            },
            getName (value) {
              return value2name(value, ChinaAddressV4Data)
            },
            logHide (str) {
              console.log(this.addressValue );
            },
            logShow (str) {
              console.log('on-show')
              console.log(this.addressValue);
            }
        }
    }
</script>
<style>
    .add-new-inner .icon-add{
      font-size: 48px;
    }
    .addr-del .icon-delete{
      font-size: 18px;
    }
    .vux-cell-box{
      text-align: left;
      margin-bottom: 24px;
    }
    .vux-cell-box:not(:first-child):before{
      height: 0;
      border-top: 0!important;
    }
</style>