var mongoose = require("mongoose");
const uri =
  "mongodb+srv://armaan:jaya@1996@cluster0.oesty.mongodb.net/SUDHA?retryWrites=true&w=majority";
// connecting through my database named "SUDHA"
console.log("try to connect")
mongoose
  .connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then((res) => {
    console.log("mongoAtlas connected");
  })
  .catch((err) => {
    console.log(err.message);
  });
