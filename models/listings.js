const mongoose = require("mongoose");
const listingSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    description : String,
    image :{
        type : String,
        set: (v) => v===""?"https://static.thenounproject.com/png/944120-200.png":v,
        default : "https://static.thenounproject.com/png/944120-200.png"
    },
    price : {
        type : Number,
        default : 1000
    },
    location : String,
    country : String
})

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;
