var mongoose = require("mongoose")

var userSchema = new mongoose.Schema({
    "userId":String,
    "userName":String,
    "userPwd":String,
    "level":Number,
    "cartList":[
        {
            "productId":String,
            "productName":String,
            "productImage":String,
            "salePrice":String,
            "checked":Number,
            "productNum":Number
        }
    ],
    "addressList":[
        {
            "addressId":String,
            "userName":String,
            "streetName":String,
            "postCode":Number,
            "tel":String,
            "isDefault":Boolean
        }
    ],
    "orderList":[
        {
            "orderId":String,
            "orderTotal":Number,
            "orderStatus":String,
            "createDate":String,
            "goodsList":Array,
            "addressInfo":String
        }
    ]
})

// 第三个参数为集合的名称
module.exports = mongoose.model("User", userSchema)