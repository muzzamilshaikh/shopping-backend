const router = require("express").Router();
const CryptoJS = require("crypto-js");

const Order = require("../models/Order");
const {
  verifyTokenAndAdmin,
  verifyToken,
  verifyTokenAndAuth,
} = require("./verifyToken");

// CREATE
router.post("/", verifyToken, async (req, res) => {
  const order = new Order(req.body);
  try {
    const saveOrder = await order.save();
    res.status(200).json(saveOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});
// UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted");
  } catch (error) {
    res.status(500).json(error);
  }
});

//get user order
router.get("/find/:userId", verifyTokenAndAuth, async (req, res) => {
  try {
    const order = await Order.find({ userId: req.params.userId });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get all

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get montly income
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
