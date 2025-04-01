const { required } = require("joi");
const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Listing=require("./listing");
const userSchema = new Schema({
    googleId: {
        type: String,
        unique: true,  // Ensure uniqueness for Google users
        sparse: true   // Allows non-Google users to not have this field
    },
    username: {
        type: String,
        required: function() { return !this.googleId; }  // Required only for non-Google users
    },
    email: {
        type: String,
        required: true,
        unique: true  // Ensure no duplicate emails
    },
    password: {
        type: String,
        required: function() { return !this.googleId; } // Required only for non-Google users
    },
    wishlist: [{
        type: Schema.Types.ObjectId,
        ref: "Listing"
    }],
    bookings: [{
        type: Schema.Types.ObjectId,
        ref: "Listing"
    }],
});


module.exports=mongoose.model("User",userSchema);