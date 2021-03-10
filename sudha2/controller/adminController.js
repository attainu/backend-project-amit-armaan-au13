const express = require("express");
const router = express.Router();
var session = require("express-session");
const jwt = require("jsonwebtoken");
const bycrypt = require("bcryptjs");
const Admin = require("../modal/adminSchema");
const User = require("../modal/userSchema");
const config = require("../config/config");

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
// router.use(session({ secret: "keyboard cat", cookie: { maxAge: 60000 } }));

//register as admin:
router.post("/adminregister", async (req, res) => {
  var hashpassword = bycrypt.hashSync(req.body.password, 8);
  const user = await Admin.findOne({ email: req.body.email });
  const mobile = await Admin.findOne({ phone: req.body.phone });
  if (user || mobile) {
    res.send(
      "user already exists or phone number is already assigned to another user"
    );
  } else {
    Admin.create(
      {
        name: req.body.name,
        email: req.body.email,
        password: hashpassword,
        phone: req.body.phone,
        profile: req.body.profile,
        role: "Admin",
      },
      (err, user) => {
        if (err) throw err;
        res.status(200).send(user);
      }
    );
  }
});
//login as admin

router.post("/adminlogin", (req, res) => {
  // console.log(req.session)
  Admin.findOne({ email: req.body.email }, (err, user) => {
    if (err) return res.status(500).send("error while login");
    if (!user) return res.send({ auth: false, token: "NO USER FOUND" });
    else {
      const passIsValid = bycrypt.compareSync(req.body.password, user.password);
      if (!passIsValid)
        return res.send({ auth: false, token: "wrong password" });
      var token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 3600,
      });
      var decoded = jwt.verify(token, config.secret);
      console.log(decoded);
      req.session.users = user;
      res.send({
        data: user,
        auth: true,
        token: token,
        message: "logged in as " + user.role,
      });
    }
  });
});

//getting personal info api
router.get("/AdminInfo", (req, res) => {
  console.log("76", req.session.users);
  var token = req.headers["x-access-token"];
  if (!token) res.send({ auth: false, token: "No token Provided" });
  jwt.verify(token, config.secret, (err, data) => {
    if (err) return res.send("error while login");
    Admin.findById(data.id, (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  });
});

//api for update intrests
router.patch("/intrest", (req, res) => {
  var tokens = req.headers["x-access-token"];
  User.find({ dues: { $gt: 1500 } }, (err, data) => {
    if (err) return res.send("server error");
    if (!data.length) return res.send("no user in dues");
    else {
      jwt.verify(tokens, config.secret, (err, info) => {
        if (err) return res.send("no authorized");
        Admin.findById(info.id, (err, result) => {
          if (err) return res.send("not authorizes");
          if (!result) {
            return res.send("not authorizes");
          } else {
            if (result.role == "Admin") {
              data.forEach((element) => {
                var temp = { dues: element.dues };
                var tempnew = {
                  $set: { dues: element.dues + element.dues * 0.1 },
                };
                User.updateMany(temp, tempnew, (err, res) => {
                  if (err) throw err;
                });
              });
            } else {
              res.send("not authorized");
            }
          }
        });
      });

      return res.send(data);
    }
  });
});

// delete inactive users:
router.delete("/delete",(req,res)=>{
   var tokens = req.headers["x-access-token"];
   if(!tokens) return res.send("Not authorized to delete")
   User.find({ status: "InActive" }, (err, data) => {
     if (err) return res.send("server error");
     if (!data.length) return res.send("no inactive users");
     else {
       jwt.verify(tokens, config.secret, (err, info) => {
         if (err) return res.send("no authorized");
         Admin.findById(info.id, (err, result) => {
           if (err) return res.send("not authorizes");
           if (!result|| null) {
             return res.send("not authorizes");
           } else {
             if (result.role == "Admin") {
               console.log(data)
              User.deleteOne({"status":"InActive"},(err,resp)=>{
                res.send(resp)
              })
             } else {
               res.send("not authorized");
             }
           }
         });
       });

       return res.send(data);
     }
   });
})
//get all the admins
router.get("/admins", (req, res) => {
  Admin.find({}, { name: 1, profile: 1, role: 1, phone: 1 }, (err, user) => {
    if (err) throw err;
    res.status(200), res.json(user);
  });
});
module.exports = router;
