const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect("mongodb://localhost:27017/priceData");
app.set("view engine", "ejs");
app.use(express.static("public"));
var test_variable = 1;
var test_variable2 = 1;
var currentUname;


//  schema for price from admin
const priceSchema = new mongoose.Schema({
    packageID: Number,
    place: String,
    description: String,
    stayAmt: Number,
    foodAmt: Number,
    busAmt: Number,
    trainAmt: Number,
    planeAmt: Number
})

const userSchema = new mongoose.Schema({
    packID: String,
    travel: String,
    food: String,
    stay: String,
    noOfDays: String,
    date: String,
})

const loginSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    age: Number,
    username: String,
    password: String
})

const userOpt = new mongoose.model("useropt", userSchema);
const adminPrice = new mongoose.model("tour", priceSchema);
const loginCred = new mongoose.model("login", loginSchema);


var firstPackage = new adminPrice({
    packageID: 1001,
    place: "new-york",
    description: "visit to newyork america and many cities nearby",
    stayAmt: 2000,
    foodAmt: 1500,
    busAmt: 1000,
    trainAmt: 800,
    planeAmt: 4000

})

var secondPackage = new adminPrice({
    packageID: 1002,
    place: "mumbai",
    description: "visit juhu and many other beaches",
    stayAmt: 3000,
    foodAmt: 1500,
    busAmt: 1000,
    trainAmt: 800,
    planeAmt: 4000
})

var newUser = new userOpt({
    packID: "001",
    travel: "hiib",
    food: "hiib",
    stay: "hiib",
    noOfDays: "hiib",
    date: "hiib"
})
var newUser2 = new userOpt({
    packID: "002",
    travel: "hiib",
    food: "hiib",
    stay: "hiib",
    noOfDays: "hiib",
    date: "hiib"
})

newUser.save();
newUser2.save();

var login1 = new loginCred({
    firstName: "vishal",
    lastName: "pawar",
    age: 20,
    username: "vishal17",
    password: "vishal123"
})


loginCred.find({ username: "vishal17" }, function (err, docs) {
    if (err) {
        console.log(err);
    } else {
        if (docs.length == 0) {
            login1.save();
        }
    }
})



adminPrice.find({ packageID: { $gt: 0 } }, function (err, docs) {
    if (err) {
        console.log(err);
    }
    else {
        if (docs.length === 0) {
            firstPackage.save()
            secondPackage.save();
        }
    }
});



// home get route
app.get("/", function (req, res) {
    res.render("login");
})

app.post("/", function (req, res) {
    let uName = req.body.userName;
    let pWord = req.body.passWord;
    loginCred.find({username:uName}, function (err, docs) {
        if(err){
            console.log(err);
        }else{
            if(docs.length==0){
                res.render("error4", {err_msg: "acc not found"});
            }else{
                
                if(docs[0].password==pWord){
                    currentUname=docs[0].username;
                    res.redirect("/display");
                }else{
                    res.render("error4", { err_msg : "wrong password"});
                }
            }
        }
        
    })

   

})

app.get("/createAccount", function (req, res) {
    res.render("createAccount");
})

var is_same = 1;

app.post("/createAccount", function (req, res) {

    let uName = req.body.userName;

    loginCred.find({}, function (err, docs) {
        if (err) {
            console.log(err);
        } else {
            for (var i = 0; i < docs.length; i++) {
                if (docs[i].username == uName) {

                    res.render("error3");

                    break;
                } else {
                    if (i == docs.length - 1) {
                        res.render("accSuccess")
                    }
                }
            }
        }
    })


    var newAcc = new loginCred({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        age: req.body.age,
        username: req.body.userName,
        password: req.body.passWord
    })
    newAcc.save();

})



app.get("/display", function (req, res) {

    adminPrice.find({ packageID: { $gt: 0 } }, function (err, docs) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("home", {
                arr: docs
            });
        }
    });

})

// compose route

app.get("/compose", function (req, res) {

    res.render("compose");
})

app.post("/compose", function (req, res) {
    let packageeeID = req.body.packageID;
    let place = req.body.place;
    let description = req.body.description;
    let stayAmt = req.body.stayAmt;
    let foodAmt = req.body.foodAmt;
    let busAmt = req.body.busAmt;
    let trainAmt = req.body.trainAmt;
    let planeAmt = req.body.planeAmt;

    // checks weather package with same id is present 
    //  if presents shows error page otherwise redirects to root route

    adminPrice.find({}, function (err, docs) {
        if (err) {
            console.log(err);
        }
        else {
            for (var i = 0; i < docs.length; i++) {

                if (docs[i].packageID == packageeeID) {
                    res.render("error1");
                    break;

                }
                else {
                    if (test_variable == 1) {

                        const newTable = new adminPrice({
                            packageID: packageeeID,
                            place: place,
                            description: description,
                            stayAmt: stayAmt,
                            foodAmt: foodAmt,
                            busAmt: busAmt,
                            trainAmt: trainAmt,
                            planeAmt: planeAmt
                        })

                        newTable.save();
                        res.redirect("/display");
                        test_variable = 0;
                    }
                }
            }
        }
    });
})


app.get("/posts/:postID", function (req, res) {

    var packid = req.params.postID;
    adminPrice.find({ packageID: { $gt: 0 } }, function (err, docs) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("post", { arr: docs, pid: packid })
        }
    });


})





app.post("/post", function (req, res) {
    var packID = req.body.packId;
    let travel = req.body.travel;
    let food = req.body.food;
    let stay = req.body.stay;
    let noOfDays = req.body.noOfDays;
    let date = req.body.date;

    var find = false;

    userOpt.find({ packID: packID }, function (err, docs) {
        if (err) {
            console.log(err);
        } else {
            find = true;
        }
    })


})


// var newUser3 = new userOpt({
//     packID: packID,
//     travel: travel,
//     food: food,
//     stay: stay,
//     noOfDays: noOfDays,
//     date: date
// })

// newUser3.save();


// })

app.get("/posts/:infoID/info", function (req, res) {
    let infoID = req.params.infoID;

    res.render("info", { iit: infoID });

})


app.listen(3000);