const express = require('express');
const app = express();
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");

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

app.listen(port, () =>{
    console.log(`App is Listening to port no ${port}`);
});

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

app.get("/listings",async (req,res) =>{
    const allListings = await Listing.find();
   res.render("listings/index.ejs",{allListings}); 
});

// Show route

app.get("/listings/:id", async(req,res)=>{
    try{

        let {id} = req.params;
        const x = await Listing.findById(id);
        console.log(x)
        if (x){
            res.render("listings/show.ejs", {x});
        }
        else{
            res.render("listings/error.ejs")
        }
    }
    catch(err){
        res.render("listings/error.ejs")
    }
});


//Getting to the creating new listing page

app.get("/listings-new",(req,res)=>{
    res.render("listings/new.ejs");
});


//submiting the listing after creating it

app.post("/listings" , async(req,res,next) =>{
    try{
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    }catch(err){
        next(err);
    }
    
});

//Getting to the editing listing page

app.get("/listings/:id/edit",async (req,res)=>{
    let {id} = req.params;
    const x = await Listing.findById(id);
    res.render("listings/edit.ejs",{x});
});

//submiting the listing after editing it

app.put("/listings/:id",async (req,res) =>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
});

//Delete an existing listing

app.delete("/listings/:id", async (req,res) =>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

// server side authentication
app.use((err,req,res,next)=>{
    res.send("OOPS!! SOMETHING WENT WRONG");
});
