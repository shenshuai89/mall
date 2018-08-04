// 定义mongodb模型
var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var productSchema = new Schema({
    "productId":String,
    "productName":String,
    "salePrice":Number,
    "productImage":String,
    "productNum":Number,
    "checked":String,
    "stock":Number
})

// mongoose.model("Goods", productSchema),可以和mongodb数据的goods集合相对应
module.exports = mongoose.model("Goods", productSchema)