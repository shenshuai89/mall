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

// mongoose.model("Goods", productSchema),
module.exports = mongoose.model("Goods", productSchema)