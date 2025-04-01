const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
  paymentId: { type: String, required: true },
  status: { type: String, enum: ["confirmed", "pending", "cancelled"], default: "confirmed" },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
