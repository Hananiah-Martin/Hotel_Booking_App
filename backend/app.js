if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
console.log(process.env.CLOUD_NAME);
const express = require("express");
let port = 8080;
const cors = require("cors");
const app = express();
const CryptoJS = require("crypto-js");
const mongoose = require("mongoose");
const path = require("path");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const ejsMate = require("ejs-mate");
app.use(cors({ origin: "*" }));
app.engine("ejs", ejsMate);
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/User.js");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const User = require("./models/User.js");
const Booking = require("./models/booking.js");
const Razorpay = require("razorpay");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const store = MongoStore.create({
  mongoUrl:
    "mongodb+srv://hananiahhoney5:55VikeotfqDYmKT2@cluster0.5h25d9m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});
store.on("error", () => {
  console.log("Error in mongo session store", err);
});
const sessionOptions = {
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionOptions));
app.use(flash());
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
main()
  .then(() => {
    console.log("connected to database successfully");
  })
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect(
    "mongodb+srv://hananiahhoney5:55VikeotfqDYmKT2@cluster0.5h25d9m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      serverSelectionTimeoutMS: 60000,
      connectTimeoutMS: 60000,
      socketTimeoutMS: 60000,
      tls: true,
    }
  );
}
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          return done(null, user);
        }
        user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          user.googleId = profile.id;
          await user.save();
          return done(null, user);
        }
        user = new User({
          googleId: profile.id,
          username: profile.displayName,
          email: profile.emails[0].value,
        });
        await user.save();
        return done(null, user);
      } catch (err) {
        console.error("Error during authentication:", err);
        return done(err, null);
      }
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
app.get(
  "/auth/google/callback",
  (req, res, next) => {
    next();
  },
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "User authentication failed" });
    }
    const token = jwt.sign(
      {
        id: req.user.googleId,
        name: req.user.name,
        email: req.user.email,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.redirect(`http://localhost:5173/oauth-callback?userId=${req.user._id}`);
  }
);

app.get("/auth/logout", (req, res) => {
  req.logout();
  res.redirect("http://localhost:3000");
});
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});
app.post("/create-order", async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100, // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: "order_" + Date.now(),
      payment_capture: 1, // auto capture payment
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
});
app.post("/verify-payment", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  const generated_signature = CryptoJS.HmacSHA256(
    razorpay_order_id + "|" + razorpay_payment_id,
    process.env.RAZORPAY_SECRET
  ).toString(CryptoJS.enc.Hex);
  if (generated_signature !== razorpay_signature) {
    return res
      .status(400)
      .json({ status: "failure", message: "Payment verification failed" });
  }
  res.json({ status: "success", message: "Payment Verification successfull" });
});
app.post("/create-booking", async (req, res) => {
  try {
    const { userId, listingId, paymentId, checkInDate, checkOutDate } =
      req.body;

    if (!userId || !listingId || !paymentId || !checkInDate || !checkOutDate) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const newBooking = new Booking({
      userId,
      listingId,
      paymentId,
      checkInDate,
      checkOutDate,
      status: "confirmed",
    });

    await newBooking.save();
    res.json({ success: true, message: "Booking confirmed!" });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
app.get("/bookings/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const bookings = await Booking.find({ userId }).populate("listingId");

    res.json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
app.put("/cancel-booking/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: "canceled" }, // Set status to "canceled"
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.json({ success: true, message: "Booking canceled successfully", booking: updatedBooking });
  } catch (error) {
    console.error("Error canceling booking:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.use("/listing", listingRouter);
app.use("/listing/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});
app.use((err, req, res, next) => {
  let { statusCode = 404, message = "Page Not Found" } = err;
  res.render("errorPage.ejs", { message });
});
app.listen(port, () => {
  console.log("listening");
});
