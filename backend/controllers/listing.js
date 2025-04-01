const { string } = require("joi");
const Listing=require("../models/listing");
const User=require("../models/User");
const review = require("../models/review");
const razorpay_key=process.env.RAZORPAY_KEY;
module.exports.index=async (req,res)=>{
    const allListings=await Listing.find({});
    res.json({message:"Alllistings",allListings});
};
module.exports.renderNewForm=(req,res)=>{
    res.render("new.ejs");
};
module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author",
        },
}).populate("owner");
    let sum=0;
    for(let i=0;i<listing.reviews.length;i++){
        let num=parseInt(listing.reviews[i].rating);
        sum=sum+num;
    }
    let average=Math.floor(sum/listing.reviews.length);
    res.json({message:"Listing fetched",listing,average});
    
}
module.exports.createListing = async (req, res) => {
    try {
        const { title, country, price,description,location, landmark,userId} = req.body.listing;
        if (!title || !country || !price || !description || !location || !landmark) {
          return res.status(400).json({ error: "All fields are required" });
        }
        const parsedPrice = Number(price);
        if (isNaN(parsedPrice)) {
          return res.status(400).json({ error: "Invalid price value" });
        }
        const url=req.file.path;
        const filename=req.file.filename;
        const newListing = new Listing({
          title,
          country,
          price: parsedPrice,
          image: { url, filename },
          description,
          location,
          landmark,
        });
        newListing.owner=userId;
        // Save to database
        await newListing.save();
        res.status(201).json(newListing);
      } catch (error) {
        console.error("Error creating listing:", error);
        res.status(500).json({ error: "Internal server error" });
      }
};
module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("edit.ejs",{listing});
}
module.exports.addToWishList=async(req,res)=>{
  let {userId,listingId}=req.body;
  const listing=await Listing.findById(listingId);
  const user=await User.findById(userId);
  user.wishlist.push(listingId);
  await user.save();
  res.json({message:"Listing added to wishlist",user});
}
module.exports.fetchWishList=async(req,res)=>{
  let {id}=req.params;
  const user=await User.findById(id).populate("wishlist");
  res.json(user.wishlist);
}
module.exports.updateListing=async(req,res)=>{
    try {

        const { id } = req.params;
        const { title, country, price, description, location, landmark, userId } = req.body.listing;
        // Validation: Ensure all fields are provided
        if (!title || !country || !price || !description || !location || !landmark) {
          return res.status(400).json({ error: "All fields are required" });
        }
        const parsedPrice = Number(price);
        if (isNaN(parsedPrice)) {
          return res.status(400).json({ error: "Invalid price value" });
        }
        let listing = await Listing.findById(id);
        if (!listing) {
          return res.status(404).json({ error: "Listing not found" });
        }
        listing.title = title;
        listing.country = country;
        listing.price = parsedPrice;
        listing.description = description;
        listing.location = location;
        listing.landmark = landmark;
        listing.userId = userId;
    
        // If an image is uploaded, update the image URL
        if (req.file) {
          listing.image.url = req.file.path;  // Assuming `imageUrl` field in your model
          listing.image.filename = req.file.filename; // Store filename if needed
        }
    
        // Save the updated listing
        await listing.save();
    
        return res.status(200).json({ message: "Listing updated successfully", listing });
      } catch (err) {
        console.error("Error updating listing:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
}
module.exports.deleteListing=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted sucessfully")
    res.redirect("/listing");
}