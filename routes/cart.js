const router = require("express").Router();
const CryptoJS = require("crypto-js");

const Cart = require("../models/Cart");
const {
  verifyTokenAndAdmin,
  verifyToken,
  verifyTokenAndAuth,
} = require("./verifyToken");

// CREATE
router.post("/", verifyToken, async (req, res) => {
  const cart = new Cart(req.body);
  try {
    const saveCart = await cart.save();
    res.status(200).json(saveCart);
  } catch (error) {
    res.status(500).json(error);
  }
});
// UPDATE
router.put("/:id", verifyTokenAndAuth, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete
router.delete("/:id", verifyTokenAndAuth, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart has been deleted");
  } catch (error) {
    res.status(500).json(error);
  }
});

//get cart
router.get("/find/:userId", verifyTokenAndAuth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get all

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
