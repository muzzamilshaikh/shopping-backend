const router = require("express").Router();
const Stripe = require("stripe");
const stripe = Stripe(
  "sk_test_51Kkl1ASDTreR90r9A7Yq9Xxc5JjSpAJwX1LqvNJkc8eqRD9LwEHobc9UqTtTdPeAUgO26GWlLW7ifGyY5Vtj44S700OeitSAq0"
);

router.post("/payment", (req, res) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "inr",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr);
      } else {
        res.status(200).json(stripeRes);
      }
    }
  );
});

module.exports = router;
