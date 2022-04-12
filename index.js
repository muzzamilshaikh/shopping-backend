const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to DB Successfully"))
  .catch((err) => console.log("something goes wrong on server", err));

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);

app.listen(PORT, () => {
  console.log(`server is up & running on port ${PORT}`);
});
