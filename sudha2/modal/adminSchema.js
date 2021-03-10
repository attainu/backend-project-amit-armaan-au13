var mongoose = require("mongoose");
var adminSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  password: String,
  phone:Number,
  profile: String,
  role: String,
});
mongoose.model("signupAdmin", adminSchema);
module.exports = mongoose.model("signupAdmin");
