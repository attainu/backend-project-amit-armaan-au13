var mongoose = require("mongoose");
// connecting through my database named "SUDHA"
mongoose.connect("mongodb+srv://armaan:jaya@1996@cluster0.oesty.mongodb.net/SUDHA?retryWrites=true&w=majority", {
  useUnifiedTopology: true,
  useNewUrlParser: true
}).then(res=>{
  console.log("mongoAtlas connected")
}).catch(err=>{
  console.log(err.message)
});
