const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
module.exports.createReview=async(req,res)=>{
    let {id}=req.params;
    const{rating,comment,userId}=req.body;
    const review=new Review({rating,comment,author:userId});
    await review.save();
    await Listing.findByIdAndUpdate(id,{$push:{reviews:review._id}});
    res.json({message:"Review created",review});
}
module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{review,reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listing/${id}/allReviews`);
}