const express = require("express");
const router = express.Router();
const session = require('express-session')
const bodyParser = require("body-parser");
const Admin = require("../modal/adminSchema");
const User = require("../modal/userSchema");
const product = require('../modal/productSchema')


router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

router.post("/addProduct",async (req,res)=>{
  // console.log(req.session)
  const item = await product.findOne({pid:req.body.pid});
  const prodName=await product.findOne({pname:req.body.name})
  if(item || prodName){
    res.send("product already exists, check for  its quantity")
  }
  else{
    product.create({
      pid: req.body.pid,
      pname: req.body.pname,
      amount: req.body.amount,
      available: req.body.available,
      tested: req.body.tested ? req.body.tested : "Not Suitable",
    });
    res.send("product added").status(200);
  }

    
    
});

//order items:
router.post("/order",async (req,res)=>{
  var count = req.body.count
   const selected = await product.findOne({pname:req.body.pname},(err,data)=>{
     if (err) throw err
     console.log(data)
     const temp = { pid: data.pid };
     const remaining = { $set: { available: data.available -count } };

  product.updateOne(temp, remaining, (err, resp) => {
       if (err) throw err;
     });
   })
   

   res.send(count +" items of "+ selected.pname +" "+ "ordered successfully " + "  ** Now remaining items of " +selected.pname + " is "+(selected.available-count)+" ** please pay the sum of Rs."+count*selected.amount+" for your purchase")
});
//get all the products
router.get("/items", (req, res) => {
  product.find({},{ _id:0,pname:1,available:1,amount:1}, (err, user) => {
    if (err) throw err;
    res.status(200), res.json(user);
  });
});
module.exports=router;