<template>
  <div style="margin-top:70px;">
    <p>通过path传值{{$route.params.productId}}</p>
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
              this.salePrice = res.result.salePrice;
              this.stock = res.result.stock;
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
              console.log("object",修改成功);
            }
          }).catch((err) => {
            
          });
        }
      }
    }
</script>