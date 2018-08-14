var express = require('express')
var app= express()
var fs = require('fs');
var bodyParser = require('body-parser')
var multer = require('multer')
var router = express.Router();
var mongoose = require("mongoose")
// 连接goods集合的数据
var Goods = require('../models/goods')
var User = require('../models/user')

// 连接MongoDB数据库
// mongoose.connect('mongodb://127.0.0.1:27017/mall');

// mongoose.connection.on('connected', function(){
//     console.log("MongoDB connected success");
// })

// mongoose.connection.on('error', function(){
//     console.log("MongoDB connected error");
// })

// mongoose.connection.on('disconnected', function(){
//     console.log("MongoDB connected disconnected");
// })



router.get('/', function(req,res,next){
    let page = parseInt(req.query.page);
    let pageSize = parseInt(req.query.pageSize);
    let priceRange = req.query.priceRange;
    let skip = (page-1)*pageSize;
    let sort = req.query.sort;
    let params = { }
    var priceGt =0,priceLte=0;
    if(priceRange != "all"){
        switch(priceRange){
            case "0":
                priceGt=0;priceLte=100; break;
            case "1":
                priceGt=100;priceLte=500; break;
            case "2":
                priceGt=500;priceLte=1000; break;
            case "3":
                priceGt=1000;priceLte=5000; break;
            case "4":
                priceGt=5000;priceLte=1000000000000000000000000000; break;
        }
        params={
            "salePrice":{
                $gt:priceGt,
                $lte:priceLte
            }
        }
    }
    // console.log(req.query);    {page:"1",pageSize:"8",sort:"1"}
    if(JSON.stringify(req.query) == "{}"){
        Goods.find({}, function (err, doc) { 
            if(err){
                res.json({
                    status:'1',
                    msg:err.message
                })
            }else{
                res.json({
                    status:'0',
                    msg:'',
                    result:{
                        count:doc.length,
                        list:doc
                    }
                })
            }
        })
    }else{
        // 分页
        let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
        // 排序
        goodsModel.sort({"salePrice":sort})
        goodsModel.exec(function (err, doc) { 
            if(err){
                res.json({
                    status:'1',
                    msg:err.message
                })
            }else{
                res.json({
                    status:'0',
                    msg:'',
                    result:{
                        count:doc.length,
                        list:doc
                    }
                })
            }
        })
    }
})

// 设置添加购物车的路由
// 加入到购物车
router.post("/addCart", function(req,res,next){
    var userId = req.cookies.userId, productId= req.body.productId;
    // 导入User数据模型
    // var User = require("../models/user")
    User.findOne({userId:userId},function(err, userDoc){
        if(err){
            res.json({
                status:"1",
                msg:err.message
            })
        }else{
            if(userDoc){
                let goodsItem = '';
                userDoc.cartList.forEach((item)=>{
                    // 遍历购物车已经存在的商品，新添加的商品和已经存在的商品对比，存在就将productNum加1
                    if(item.productId == productId){
                        goodsItem = item;
                        item.productNum ++;
                    }
                })
                if(goodsItem){
                    // 如果商品已经存在，值更新productNum，然后保存数据
                    userDoc.save(function(err2, doc2){
                        if(err2){
                            res.json({
                                status:"1",
                                msg:err2.message
                            })
                        }else{
                            res.json({
                                status:"0",
                                msg:"",
                                result:"success"
                            })
                        }
                    })
                }else{
                    // 如果商品不存在，新添加商品
                    Goods.findOne({productId:productId},function(err1,doc1){
                        var newObj ={};
                        if(err1){
                            res.json({
                                status:"1",
                                msg:err.message
                            })
                        }else{
                            if(doc1){
                                // 通过新建对象，把要添加属性通过赋值的方法给新建的对象，可以把这个新对象添加到集合数组中
                                newObj = {
                                    productNum:1,
                                    checked:1,
                                    productId:doc1.productId,
                                    productName:doc1.productName,
                                    salePrice:doc1.salePrice,
                                    stock:doc1.stock,
                                    productImage:doc1.productImage
                                }
                                // 给购物车添加商品
                                userDoc.cartList.push(newObj);
                                userDoc.save(function(err2, doc2){
                                    if(err2){
                                        res.json({
                                            status:"1",
                                            msg:err2.message
                                        })
                                    }else{
                                        res.json({
                                            status:"0",
                                            msg:"",
                                            result:userDoc
                                        })
                                    }
                                })
                            }
                        }
                    })
                }
                
            }
        }
    })
})


// 后台管理员添加商品
router.post("/addGood", function(req,res, next){
    var userId = req.cookies.userId,
    productName = req.body.productName,
    salePrice = req.body.salePrice,
    stock = req.body.stock,
    procductImage = req.body.procductImage;

    User.findOne({userId:userId}, function(err, userDoc){
        if(err){
            res.json({
                status:"1",
                msg:err.message
            })
        }else{
            if(userDoc){
                // 将base64转jpg图片
                var picName = productName+"_"+Date.now();
                var path = 'public/images/'+ picName +'.jpg';
                var base64 = procductImage.replace(/^data:image\/\w+;base64,/, "");//去掉图片base64码前面部分data:image/png;base64
                var dataBuffer = new Buffer(base64, 'base64'); //把base64码转成buffer对象，
                fs.writeFile(path,dataBuffer,function(err){//用fs写入文件
                    if(err){
                        console.log(err);
                    }else{
                        console.log('写入成功！');
                    }
                })
                var newGoods = new Goods({
                    "productId":new Date().getTime(),
                    "productName":productName,
                    "salePrice":salePrice,
                    "stock":stock,
                    "productImage":picName+".jpg",
                    "checked":1
                })
                newGoods.save(function (error,doc) {
                    if(error){
                        res.json({
                            status:"1",
                            msg:error.message
                        })
                    }else{
                        res.json({
                            status:0,
                            msg:"添加商品成功",
                            result:doc
                        })
                    }
                })
            }
        }
    })
})

// 编辑之前查询商品信息
router.post("/queryGoods",function(req, res, next){
    var userId = req.cookies.userId,
    productId = req.body.productId;
    if(userId){
        Goods.findOne({"productId":productId},function (err,doc) {
            if(err){
                res.json({
                    status:1,
                    msg:err.message
                })
            }else{
                res.json({
                    status:0,
                    msg:"find one goods",
                    result:doc
                })
            }
        })
    }
})
// 后台管理编辑商品
router.post("/editGoods", function(req,res,next){
    var userId = req.cookies.userId,
    productId = req.body.productId,
    salePrice = req.body.salePrice,
    stock = req.body.stock;
    if(userId){
        Goods.update({"productId":productId},{
            salePrice,stock
        },function(err,doc){
            if(err){
                res.json({
                    status:1,
                    msg:err.message
                })
            }else{
                res.json({
                    status:0,
                    msg:"修改成功",
                    result:"update success"
                })
            }
        })
    }
})
// 订单支付后，库存减少
router.post("/reduceStock", function (req,res,next) {
    var userId = req.cookies.userId,
    productNum = req.body.productNum,
    productId = req.body.productId,
    remainStock;
    if(userId){
        Goods.findOne({"productId":productId}, function(err, doc){
            if(!err){
                remainStock = doc.stock-productNum;
                
                Goods.update({"productId":productId},{
                    "stock":remainStock
                },function(err,doc){
                    if(err){
                        res.json({
                            status:1,
                            msg:err.message
                        })
                    }else{
                        res.json({
                            status:0,
                            msg:"修改成功",
                            result:"update success"
                        })
                    }
                })
            }
        })
        
    }
})


module.exports = router;