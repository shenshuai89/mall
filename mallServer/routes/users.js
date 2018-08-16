var express = require('express');
var router = express.Router();
var User = require("../models/user")
var Goods = require("../models/goods")
var session = require("express-session")
var cookie = require("cookie-parser")
require("../util/util")


var allGoods=[];
Goods.find({},function (err, doc) {
  if(!err){
    allGoods = doc;
  }
})
/* GET users listing. */
router.post('/userList', function(req, res, next) {
  var userId = req.cookies.userId;
  if(userId){
    User.findOne({"userId":userId},function(err,doc){
      if(doc.level == 1){
        User.find({},function(err,users){
          console.log(users);
        })
      }
    })
  }
  User.find({})
});

router.get('/test', function(req, res, next) {
  res.send('访问子路由users/test');
});
router.post("/queryPhone", function(req,res,next){
  var phone = req.body.phone;
  User.findOne({"phone":phone},function(err,doc){
    if(err){
      res.json({
        status:"1",
        msg:err.message,
      })
    }else{
      if(doc){
        res.json({
          status:'110110',
          msg:'',
          result:'该号码已经注册'
        })
      }else{
        res.json({
          status:'0',
          msg:'',
          result:''
        })
      }
      
    }
  })
})
// 注册新用户
router.post("/register", function (req,res,next) {
  var userName = req.body.userName,
      userPwd = req.body.userPwd,
      phone = req.body.phone;
  var doc1 = new User({
    "userId":new Date().getTime(),
    "userName":userName,
    "userPwd":userPwd,
    "phone":phone,
    "gender":"",
    "position":"",
    "department":"",
    "hiredate":new Date().Format('yyyy-MM-dd hh:mm:ss'),
    "positionstatus":'',
    "leavedate":"",
    "level":3,
    "cartList":[],
    "addressList":[],
    "orderList":[]
  })
  doc1.save(function(err, doc){
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:'注册新用户失败'
      })
    }else{
      res.json({
        status:'0',
        msg:'',
        result:doc
      })
    }
  })
})
// 登录
router.post("/login",function(req,res,next){
  var params = {
    userName: req.body.userName,
    userPwd : req.body.userPwd
  }
  User.findOne(params, function(err, doc){
    if(err){
      res.json({
        status:"1",
        msg:"输入的用户名或密码有误",
        result:''
      })
    }else{
      if(doc){
        // cookie存储
        res.cookie("userId",doc.userId,{
          path:"/",
          maxAge:1000*60*60*12
        })
        res.cookie("userName",doc.userName,{
          path:"/",
          maxAge:1000*60*60*12
        })
        // session存储
        // req.session.user = doc
        res.json({
          status:"0",
          msg:"用户"+doc.userName+"登录成功",
          result:{
            userName:doc.userName,
            userPwd:doc.userPwd,
            level:doc.level
          }
        })
      }else{
        res.json({
          status:"1",
          msg:"用户名或密码不匹配",
          result:''
        })
      }
    }
  })
})

// 登出接口
router.post("/logout", function (req, res,next) { 
  res.cookie("userId", "" ,{
    path:"/",
    maxAge:-1
  })
  res.cookie("userName", "" ,{
    path:"/",
    maxAge:-1
  })
  res.json({
    status:"0",
    msg:'',
    result:''
  })
})

// 检查登录状态
router.get("/checkLogin", function (req, res, next) { 
  if(req.cookies.userId){
    res.json({
      status:"0",
      msg:"",
      result:req.cookies.userName
    })
  }else{
    res.json({
      status:"1",
      msg:"用户未登录",
      result:""
    })
  }
})

// 加入购物车
router.get("/cartList", function(req,res,next){
  if(req.cookies.userId){
    User.findOne({userId:req.cookies.userId}, function(err, doc){
      if(err){
        res.json({
          status:"1",
          msg:err.message || "未登录，无法查看购物车",
          result:''
        })
      }else{
        if(doc){
          res.json({
            status:"0",
            msg:"",
            result:doc.cartList
          })
        }
      }
    })
  }
})

// 更新购物车数据
router.post("/editCart", function (req,res,next) {
  var userId = req.cookies.userId, 
      productId = req.body.productId, 
      productNum = req.body.productNum,
      checked = req.body.checked;
  if(userId){
    User.update({"userId":userId,"cartList.productId":productId},{
      "cartList.$.productNum":productNum,
      "cartList.$.checked":checked
    },function(err,doc){
      if(err){
        res.json({
          status:"1",
          msg:err.message,
          result:''
        })
      }else{
        res.json({
          status:"0",
          msg:"success",
          result:'suc'
        })
      }
    })
  }
})

// 删除购物车一条数据
router.post("/cart/del", function(req, res, next){
  let userId = req.cookies.userId,productId = req.body.productId;
  if(userId){
    User.update({"userId":userId},
      { $pull:
        {"cartList":
          {"productId":productId}
        }
      },
    function(err,doc){
      if(err){
        res.json({
          status:"1",
          msg:err.message,
          result:''
        })
      }else{
        res.json({
          status:"0",
          msg:'success',
          result:'success'
        })
      }
    })
  }
})

// 获取购物车商品的数量
router.get("/cartCount", function (req, res, next) {
  var userId = req.cookies.userId;
  User.findOne({"userId":userId}, function (err, doc) {
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:''
      })
    }else{
      var cartCount = 0;
      doc.cartList.forEach(item => {
        cartCount += item.productNum;
      })
      res.json({
        status:"0",
        msg:'success',
        result:cartCount
      })
    }
  })
})
// 更新全部是否选中状态
router.post("/editCheckAll", function(req,res,next){
  var userId = req.cookies.userId,
      checkAll = req.body.checkAll ? 1 : 0;
  User.findOne({"userId":userId}, function(err,user){
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:''
      })
    }else{
      if(user){
        user.cartList.forEach((item)=>{
          item.checked = checkAll;
        })
        user.save(function(err1,doc){
          if(err1){
            res.json({
              status:"1",
              msg:err.message,
              result:''
            })
          }else{
            res.json({
              status:"0",
              msg:"success",
              result:"succ"
            })
          }
        })
      }else{
        res.json({
          status:"0",
          msg:"success",
          result:"succ"
        })
      }
    }
  })
})

// 获取收货地址列表
router.get("/addressList", function(req, res, next){
  var userId = req.cookies.userId;
  User.findOne({"userId":userId}, function(err,doc){
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:''
      })
    }else{
      res.json({
        status:"0",
        msg:'',
        result:doc.addressList
      })
    }
  })
})

// 添加一个收货地址
router.post("/addAddress", function (req,res,next) {
  var userId = req.cookies.userId,
  userName = req.body.userName,
  tel = req.body.tel,
  streetName = req.body.streetName,
  addressId= postCode = new Date().getTime(),
  isDefault = false;

  User.findOne({"userId":userId}, function(err, doc){
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:'添加地址信息失败'
      })
    }else{
      if(doc){
        var addressList = doc.addressList;
        var newAddress = {
          "addressId":addressId,
          "userName":userName,
          "streetName":streetName,
          "postCode":postCode,
          "tel":tel,
          "isDefault":isDefault
        }
        addressList.unshift(newAddress);

        doc.save(function (err1,doc1) {
          if(err1){
            res.json({
              status:"1",
              msg:err.message,
              result:'添加地址信息失败'
            })
          }else{
            res.json({
              status:"0",
              msg:"success",
              result:doc.addressList
            })
          }
        })
      }
    }
  })
})

// 设置默认的收货地址
router.post("/setDefaultAddress", function(req, res, next){
  var userId = req.cookies.userId,
      addressId = req.body.addressId;
  if(!addressId){
    res.json({
      status:"10003",
      msg:"地址信息有误",
      result:''
    })
  }else{
    User.findOne({"userId":userId}, function(err,doc){
      if(err){
        res.json({
          status:"1",
          msg:err.message,
          result:''
        })
      }else{
        if(doc){
          var addressList = doc.addressList;
          addressList.forEach((item) => {
            if(item.addressId == addressId){
              item.isDefault = true;
            }else{
              item.isDefault = false;
            }
          })
          doc.save(function (err1,doc1) {
            if(err1){
              res.json({
                status:"1",
                msg:err.message,
                result:''
              })
            }else{
              res.json({
                status:"0",
                msg:"success",
                result:doc.addressList
              })
            }
          })
        }
        
      }
    })
  }
})

// 删除一个地址
router.post("/delAddress", function (req, res, next) {
  var userId = req.cookies.userId, addressId = req.body.addressId;
  User.update({"userId":userId},{
    $pull:{
      "addressList":{"addressId":addressId}
    }
  }, function(err, doc){
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:""
      })
    }else{
      res.json({
        status:"0",
        msg:"success",
        result:'suc'
      })
    }
  })
})

// 支付账单
router.post("/payment", function(req, res, next){
  var userId = req.cookies.userId,
      orderTotal = req.body.orderTotal,
      stock = req.body.stock,
      addressId = req.body.addressId;
  User.findOne({"userId":userId}, function (err,doc) { 
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:''
      })
    }else{
      var address = '',goodsList = [];
      var platform = '168';
      var r1 = Math.floor(Math.random()*100);
      var r2 = Math.floor(Math.random()*100);
      var sysDate = new Date().Format('yyyyMMddhhmmss');
      var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss')
      var orderId = platform + ''+r1+''+ sysDate + r2;
      var orderStatus = Math.random()>0.3 ? '1':'0';

      doc.addressList.forEach(item =>{
        if(addressId == item.addressId){
          address = item;
        }
      })
      // 获取用户购物车选中购买的商品
      doc.cartList.forEach(item => {
        if(item.checked == "1"){
          goodsList.push(item);
        }
      })
      // 如果购物车选择的商品的数量大于商品库存，则订单状态为0(失败)
      for(var i=0;i<goodsList.length;i++){
        for(var j=0;j<allGoods.length;j++){
          if(goodsList[i].productId == allGoods[j].productId && goodsList[i].stock > allGoods[j].stock){
            orderStatus == 0;
          }
        }
      }
      var order = {
        orderId:orderId,
        orderTotal:orderTotal,
        stock:stock,
        addressInfo:address,
        goodsList:goodsList,
        orderStatus:orderStatus,
        createDate:createDate
      }
      doc.orderList.unshift(order);

      if(orderStatus=='1'){
        // 订单成功，购物车删除勾选的商品
        for(var i = 0;i<doc.cartList.length;i++){
          for(var j=0;j<goodsList.length;j++){
            if(goodsList[j].productId == doc.cartList[i].productId){
              doc.cartList.splice(i,1);
            }
          }
        }
      }
      doc.save(function(err1,doc1){
        if(err1){
          res.json({
            status:"1",
            msg:err1.message,
            result:''
          })
        }else{
          res.json({
            status:"0",
            msg:'success',
            result:{
              orderId:order.orderId,
              orderTotal:order.orderTotal,
            }
          })
        }
      })
    }
   })
})

// 重新提交账单
router.post("/repayment", function(req,res,next){
  var userId = req.cookies.userId,
      orderId = req.body.orderId;
      User.findOne({'userId':userId}, function(err,doc){
        if(err){
          res.json({
            status:"1",
            msg:err.message,
            result:''
          })
        }else{
          // 把所有订单都设置为状态为1
          doc.orderList.forEach(item => {
            if(item.orderId == orderId){
              console.log("goodsList 订单的商品",item.goodsList);
              for(var i=0;i<item.goodsList.length;i++){
                for(var j=0;j<doc.cartList.length;j++){
                  if(item.goodsList[i].productId == doc.cartList[j].productId){
                    doc.cartList.splice(j,1);
                  }
                }
              }
              item.orderStatus = '1';
            }
          })

          doc.save(function(err1,doc1){
            if(err1){
              res.json({
                status:"1",
                msg:err1.message,
                result:''
              })
            }else{
              res.json({
                status:'0',
                msg:'success',
                result:doc.orderList
              })
            }
          })
          
        }
      })
})
// 订单列表
router.get("/orderList", function(req,res,next){
  var userId = req.cookies.userId;
  User.findOne({"userId":userId}, function(err,doc){
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:''
      })
    }else{
      res.json({
        status:'0',
        msg:'success',
        result:doc.orderList
      })
    }
  })
})
// 订单成功
router.get("/orderDetail", function(req, res, next){
  var userId = req.cookies.userId, orderId = req.query.orderId;
  User.findOne({"userId":userId}, function (err, doc) { 
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:''
      })
    }else{
      var orderTotal = 0,orderStatus='';
      if(doc.orderList.length>0){
        doc.orderList.forEach(item => {
          if(item.orderId == orderId){
            orderTotal = item.orderTotal
            orderStatus = item.orderStatus
          }
        })
        res.json({
          status:"0",
          msg:'',
          result:{
            orderId:orderId,
            orderStatus:orderStatus,
            orderTotal:orderTotal
          }
        })
      }else{
        res.json({
          status:"110000",
          msg:"该订单下无商品",
          result:''
        })
      }
    }
  })
})

// 后台查询所有订单
router.get("/allOrderList", function(req,res,next){
  User.find({}, function (err, doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      var allLists=[];
      doc.forEach(item => {
        item.orderList.length==0 ? "":allLists.push(item.orderList)
      })
      res.json({
        status:'0',
        msg:'所有用户的所有订单',
        result:allLists
      })
    }
  })
})

module.exports = router;
