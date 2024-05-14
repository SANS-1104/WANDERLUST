const express = require('express');
const app = express();
const port = 8800;
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static (path.join(__dirname,"public")));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));

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

app.get("/", (req,res) =>{
    res.send("It's Working Fine!!");
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


// Home page

app.get("/listings",async (req,res) =>{
    const allListings = await Listing.find();
   res.render("index.ejs",{allListings}); 
});

// Show route

app.get("/listings/:id", async(req,res)=>{
    let {id} = req.params;
    const x = await Listing.findById(id);
    res.render("show.ejs", {x});
});

app.get("/listings/new",(req,res)=>{
    res.render("new.ejs");
})