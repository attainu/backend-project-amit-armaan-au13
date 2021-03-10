var mongoose = require("mongoose");
var userSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  password: String,
  profile: String,
  role: String,
  status:String,
  phone: Number,
  milk: Array,
  dues: Number,
  cattleFeed: Array,
});
mongoose.model("signupUser", userSchema);
module.exports = mongoose.model("signupUser");
