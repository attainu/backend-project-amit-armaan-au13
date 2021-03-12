const express = require("express");
const app = express();
var session = require("express-session");
const db = require("./config/db");

const port = process.env.PORT || 3000;
const cors = require("cors");
app.use(cors());
//user control
const userController = require("./controller/userController");
app.use("/api/auth", userController);
//admin control
const AdminController = require("./controller/adminController");
app.use("/api/auth",AdminController)
//product control
const ProductController = require("./controller/productController")
app.use("/api/auth",ProductController)


app.get('/',(req,res)=>{
  res.send("Health check ok")
})
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
