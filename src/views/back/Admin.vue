<template>
    <el-container>
        <el-aside v-if="showAside" width="200px" style="background-color: rgb(238, 241, 246);position: fixed;top: 60px;">
          <el-menu :default-openeds="['1','2','3']">
            <el-submenu index="1">
              <template slot="title"><i class="el-icon-menu"></i>商品管理</template>
                <el-menu-item index="1-1"><router-link to="/admin/goodsList" tag="span"><i class="el-icon-view"></i>查看商品</router-link></el-menu-item>
                <el-menu-item index="1-2"><router-link to="/admin/addGoods" tag="span"><i class="el-icon-plus"></i>添加商品</router-link></el-menu-item>
                <!-- <el-menu-item index="1-3"><router-link to="/admin/editGoods" tag="span"><i class="el-icon-edit-outline"></i>编辑商品</router-link></el-menu-item> -->
            </el-submenu>
            <el-submenu index="2">
                <template slot="title"><i class="el-icon-menu"></i>销售管理</template>
                  <el-menu-item index="2-1"><router-link to="/admin/orderList" tag="span"><i class="el-icon-view"></i>所有订单</router-link></el-menu-item>
                  <el-menu-item index="2-2"><router-link to="/admin/orderDel" tag="span"><i class="el-icon-close"></i>删除订单</router-link></el-menu-item>
                  <el-menu-item index="2-3"><router-link to="/admin/orderChart" tag="span"><i class="el-icon-news"></i>订单分析</router-link></el-menu-item>
              </el-submenu>
            <el-submenu index="3">
                <template slot="title"><i class="el-icon-menu"></i>员工管理</template>
                  <el-menu-item index="3-1"><router-link to="/admin/userList" tag="span"><i class="el-icon-view"></i>查看员工</router-link></el-menu-item>
                  <el-menu-item index="3-2"><router-link to="/admin/addUser" tag="span"><i class="el-icon-plus"></i>添加员工</router-link></el-menu-item>
                  <el-menu-item index="3-3"><router-link to="/admin/delUser" tag="span"><i class="el-icon-close"></i>删除员工</router-link></el-menu-item>
                  <el-menu-item index="3-4"><router-link to="/admin/editUser" tag="span"><i class="el-icon-edit-outline"></i>编辑员工</router-link></el-menu-item>
              </el-submenu>
          </el-menu>
        </el-aside>
        
        <el-container :style="{ marginLeft: (showAll==true ? 200:0 )+'px'}" style="overflow:hidden;">
        <router-view></router-view>

        </el-container>
        <el-header style="text-align: right; font-size: 12px; width:100%; position: fixed;">
        </el-header>
        <div class="rotate_hidden" v-if="showAll" @click="showFull">
            <i class="el-icon-more" style="position: absolute; top: 12px;"></i>
            <i class="el-icon-more" style="position: absolute; top: 19px;"></i>
            <i class="el-icon-more" style="position: absolute; top: 26px;"></i>
        </div>
        <div class="rotate_hidden" v-if="!showAll" @click="showFull">
            <i class="el-icon-more-outline" style="position: absolute; top: 12px;"></i>
            <i class="el-icon-more-outline" style="position: absolute; top: 19px;"></i>
            <i class="el-icon-more-outline" style="position: absolute; top: 26px;"></i>
        </div>
        
        <el-dropdown style="position: fixed; top: 20px; right: 10px;" @command="handleCommand">
            <i class="el-icon-setting" style="margin-right: 15px"><span>  {{nickName}}</span></i>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="goAdmin">返回主页</el-dropdown-item>
                <el-dropdown-item command="goHome">返回商城</el-dropdown-item>
                <el-dropdown-item command="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        
        <div style="display: none;">
            <nav-header></nav-header>
        </div>
      </el-container>

</template>
<script>
    import NavHeader from '@/components/NavHeader';
    import axios from 'axios';
    export default {
        data() {
            const item = {
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            };
            return {
                tableData: Array(20).fill(item),
                showAll:true,
                showAside:true
            }
        },
        components:{NavHeader},
        computed: {
            nickName(){
                return this.$store.state.nickName;
            }
        },
        methods:{
            showFull(){
                this.showAside = !this.showAside;
                this.showAll = !this.showAll;
            },
            handleCommand(command){
                switch(command){
                    case "logout":
                        axios.post("/users/logout").then((response) =>{
                            let res = response.data;
                            if(res.status =="0"){
                                this.$store.commit("updateUserInfo","");
                                this.$store.commit("initCartCount",0)
                                this.$router.push("/")
                            }
                        });
                        break;
                    case "goHome":
                        this.$router.push("/");
                        break;
                    case "goAdmin":
                        this.$router.push("/admin");
                        break;
                }
                
            }
            
        }
    };
</script>
  
<style>
.el-header {
    background-color: #326656;
    color: #ffffff;
    line-height: 60px;
}
.el-menu{
    height: 100%;
}
.el-dropdown{
    color: #e3e6eb;
}
.el-aside {
    color: #333;
    height: 100%;
}
.el-table__row td{
    border:none;
}
.el-submenu__title{
    padding-right: 60px;
}
.rotate_hidden{
    position: fixed;
    height: 60px;
    width: 100px;
    color:#fff;
    font-size:24px; 
    left:40px; 
    text-align: left;
    cursor: pointer;
}
</style>
  
