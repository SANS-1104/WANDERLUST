const express = require('express');
const app = express();
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const wrapAsync = require('./utils/wrapAsync');
const expressError = require('./utils/expressError');

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static (path.join(__dirname,"public")));  // MIDDLEWARE
app.use(express.urlencoded({extended : true}));  // MIDDLEWARE
app.use(methodOverride("_method"));  // MIDDLEWARE
app.engine('ejs', ejsMate);


main()
.then(() => {
    console.log("Connection Established");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const Listing = require("./models/listings")

//Home page

app.get("/", async(req,res) =>{
    // res.send("Welcome to WanderLust")
    // const allListings = await Listing.find();
    res.render("listings/home.ejs");
});

// app.get("/test",async (req,res)=>{
//     let sample  = new Listing({
//         title : "My New Villa",
//         description : "By the beach",
//         location : "Goa",
//         country : "India"
//     })
//     await sample.save();
//     console.log("Sample was saved successfully");
//     res.send("Successfull");
// });


// All Listings

app.get("/listings",wrapAsync(async (req,res) =>{
    const allListings = await Listing.find();
    res.render("listings/index.ejs",{allListings}); 
}));

// Show route

app.get("/listings/:id", wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const x = await Listing.findById(id);
    console.log(x)
    if (x){
        res.render("listings/show.ejs", {x});
    }
    else{
        res.render("listings/error.ejs")
    }
}));


//Getting to the creating new listing page

app.get("/listings-new",wrapAsync((req,res)=>{
    res.render("listings/new.ejs");
}));


//submiting the listing after creating it

app.post("/listings" , wrapAsync(async(req,res,next) =>{
    if(!req.body.listing){
        throw new expressError(400,"Please Send a Valid Data");
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

//Getting to the editing listing page

app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const x = await Listing.findById(id);
    res.render("listings/edit.ejs",{x});
}));

//submiting the listing after editing it

app.put("/listings/:id",wrapAsync(async (req,res) =>{
     if(!req.body.listing){
        throw new expressError(400,"Please Send a Valid Data");
    }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//Delete an existing listing

app.delete("/listings/:id", wrapAsync(async (req,res) =>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

app.all("*",(req,res,next)=>{
    next(new expressError(404,"Page Not Found"));
});

// server side authentication
app.use((err,req,res,next)=>{
    if (res.headersSent) {
        return next(err);
    }
    let{statusCode = 500,message="Something Went Wrong!!"} = err;
    res.render("listings/error.ejs")
    // res.send("OOPS!! SOMETHING WENT WRONG");
});

app.listen(port, () =>{
    console.log(`App is Listening to port no ${port}`);
});
