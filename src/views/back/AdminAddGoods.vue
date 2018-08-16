<template>
    <div class="add_goods">
        <el-form :model="nameValidateForm" ref="nameValidateForm" label-width="100px" class="demo-ruleForm">
            <el-form-item
              label="产品名称"
              prop="name"
              :rules="[
                { required: true, message: '名称不能为空'},
              ]"
            >
            <el-input type="text" v-model="nameValidateForm.name" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <el-form :model="priceValidateForm" ref="priceValidateForm" label-width="100px" class="demo-ruleForm">
            <el-form-item
              label="价格"
              prop="price"
              :rules="[
                { required: true, message: '价格不能为空'},
                { type: 'number', message: '价格必须为数字值'}
              ]"
            >
            <el-input type="number" v-model.number="priceValidateForm.price" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <el-form :model="stockValidateForm" ref="stockValidateForm" label-width="100px" class="demo-ruleForm">
            <el-form-item
              label="库存"
              prop="stock"
              :rules="[
                { required: true, message: '库存不能为空'},
                { type: 'number', message: '库存必须为数字值'}
              ]"
            >
            <el-input type="number" v-model.number="stockValidateForm.stock" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
       <div class="cropper-content">
            <span class="fileinput-button">
                <el-button type="primary">上传图片</el-button>
                <input type="file" name="image" accept="image/*" style="width: 100px; font-size: 28px;cursor: pointer;"
                    @change="setImage"
                />
            </span>
            <span v-if="!cropImg">暂无图片</span>
            <img
                v-if="cropImg"
                :src="cropImg"
                alt="Cropped Image"
                class="show_image"
            />
       </div>
       <div class="btn_group">
            <el-button type="success" @click="submit">确认添加</el-button>
            <el-button type="danger" @click="cancel">取消清空</el-button>
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
    import VueCropper from 'vue-cropper'
    import Modal from '@/components/Modal.vue'
    export default{
        name:"adminGoodsList",
        components: {
            VueCropper
        },
        data(){
            const item = {
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            };
            return{
                tableData: [],
                page:1,
                pageSize:14,
                sortFlag:true,
                priceChecked:'all',
                busy:true,
                isFirstLoad:true,
                loading:false,
                isShowLoading:true,
                nameValidateForm: {
                  name:''
                },
                priceValidateForm: {
                  price: ''
                },
                stockValidateForm: {
                    stock:''
                },
                cropImg:"",
                crop:'',
                imgSrc:"",
                mdShow:false
            }
        },
        components:{
            Modal
        },
        methods: {
            setImage(e){
                const file = e.target.files[0];
                if(!file){
                    this.$message('未选择任何文件');
                    return;
                }
                if (file.type && !file.type.includes('image/')) {
                    this.$message('请选择一个图片文件');
                    return;
                }
        
                if (typeof FileReader === 'function') {
                    const reader = new FileReader();
                    // console.log(file);
                    // console.log(reader);
                    const isLt2M = file.size / 1024 / 1024 < 2;
                    if(!isLt2M){
                        this.$message({message:'图片过大，请压缩一下',type: 'warning'});
                        return false;
                    }
                    reader.onload = (event) => {
                        this.cropImg = reader.result;
                    };
                    reader.readAsDataURL(file);
                } else {
                    alert('浏览器不支持图片上传功能');
                }
            },
            submit(){
                this.$refs.nameValidateForm.validate((valid) => {
                    if (!valid) {
                        this.$message({message:'名称输入有误，不能提交！',type: 'warning'});
                        return false;
                    }
                });
                this.$refs.priceValidateForm.validate((valid) => {
                    if (!valid) {
                        this.$message({message:'价格输入有误，不能提交！',type: 'warning'});
                        return false;
                    } 
                });
                this.$refs.stockValidateForm.validate((valid) => {
                    if (!valid) {
                        this.$message({message:'库存输入有误，不能提交！',type: 'warning'});
                        return false;
                    } 
                });
                if(!this.cropImg){
                    this.$message({message:'未上传商品图片，不能提交！',type: 'warning'});
                    return false;
                }
                axios.post("/goods/addGood", {
                    "productName":this.nameValidateForm.name,
                    "salePrice":this.priceValidateForm.price,
                    "stock":this.stockValidateForm.stock,
                    "procductImage":this.cropImg,
                    "checked":1
                }).then(response => {
                    let res = response.data;
                    if(res.status == "0"){
                        this.$confirm('商品添加成功，是否继续添加商品', '提示', {
                                confirmButtonText: '继续添加',
                                cancelButtonText: '查看商品',
                                type: 'warning'
                            }).then(() => {
                                this.$message({
                                    type: 'success',
                                    message: '继续添加!'
                                });
                                this.nameValidateForm = {};
                                this.priceValidateForm = {};
                                this.stockValidateForm = {};
                                this.cropImg = '';
                            }).catch(() => {
                                this.$message({
                                    type: 'success',
                                    message: '查看商品'
                                });          
                                this.$router.push("/admin/goodsList")
                        });
                    }else{
                        this.mdShow = true;
                    }
                })
            },
            cancel(){
                this.nameValidateForm = {};
                this.priceValidateForm = {};
                this.stockValidateForm = {};
                this.cropImg = '';
            },
            closeModal(){
                this.mdShow = false;
            }
        }
    }
</script>
<style>
    .add_goods{
        position: relative; 
        top: 60px;
        margin: 20px;
        width: 100%;
        background: #f5f7fc;
        margin-bottom: 100px;
        text-align: left;
    }
    .cropper-content{
        margin-left: 30px;
    }
    .fileinput-button {
        position: relative;
        display: inline-block;
        overflow: hidden;
        cursor: pointer;
    }

    .fileinput-button input{
        position:absolute;
        right: 0px;
        top: 0px;
        opacity: 0;
        filter: 'alpha(opacity=0)';
        font-size: 200px;
    }
    .show_image{
        width: 180px; height: 180px; border: 1px solid gray;border-radius: 3%;
    }
    .btn_group{
        margin-top: 50px;
        text-align: center
    }
</style>