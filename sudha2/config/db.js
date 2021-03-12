var mongoose = require("mongoose");
const url =
  "mongodb://armaan:jaya%401996@cluster0-shard-00-00.oesty.mongodb.net:27017,cluster0-shard-00-01.oesty.mongodb.net:27017,cluster0-shard-00-02.oesty.mongodb.net:27017/SUDHA?ssl=true&replicaSet=atlas-sbatld-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose
  .connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then((res) => {
    console.log("mongoAtlas connected");
  })
  .catch((err) => {
    console.log(err.message);
  });
