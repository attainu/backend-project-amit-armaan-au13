var mongoose = require("mongoose");
var productSchema = new mongoose.Schema({
  pid: String,
  pname: String,
  amount: Number,
  available:Number,
  tested:String
});
mongoose.model("products", productSchema);
module.exports = mongoose.model("products");
