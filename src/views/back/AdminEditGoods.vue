<template>
  <div class="edit_goods">
    <h3>修改商品：{{productName}}</h3>
    售价：<input type="text" v-model="salePrice" />
    库存：<input type="text" v-model="stock">
    <button class="btn btn--orange" @click="edit">确定修改</button>
  </div>
</template>

<script>
    import axios from 'axios';
    export default{
      data() {
        return {
          productName:'',
          salePrice:'',
          stock:''
        }
      },
      mounted () {
        this.init();
      },
      methods: {
        init(){
          axios.post("/goods/queryGoods",{
            "productId":this.$route.params.productId
          }).then((response)=>{
            let res = response.data;
            if(res.status == 0){
              this.productName = res.result.productName;
              this.salePrice = res.result.salePrice;
              this.stock = res.result.stock;
            }else{
              console.log("object 无权操作");
            }
          })
        },
        edit(){
          axios.post("/goods/editGoods",{
            "productId":this.$route.params.productId,
            "salePrice":this.salePrice,
            "stock":this.stock
          }).then((response) => {
            let res = response.data;
            if(res.status == "0"){
              this.$router.push('/admin/goodsList');
              this.$message({
                  type: 'success',
                  message: '修改成功!'
              });
            }
          }).catch((err) => {
            
          });
        }
      }
    }
</script>
<style scoped>
  .edit_goods{
    margin-top:70px; 
    text-align: left;
    margin-left: 20px;
  }
</style>