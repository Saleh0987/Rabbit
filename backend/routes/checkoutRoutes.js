const express = require("express");
const Checkout = require("../models/Checkout");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
const {protect} = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, async (req, res) => {
 const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;
 
 if (!checkoutItems || checkoutItems.length === 0) {
  return res.status(400).json({ message: "No items in the checkout" });
 }

 try {

  const newCheckout = await Checkout.create({
    user: req.user._id,
    checkoutItems: checkoutItems,
    shippingAddress,
    paymentMethod,
    totalPrice,
    paymentStatus: paymentMethod === "Pay on Delivery" ? "pending" : "Pending",
    isPaid: paymentMethod === "Pay on Delivery" ? false : false,
  });


  console.log(`Checkout created for user: ${req.user._id}`);
  res.status(201).json(newCheckout);

 } catch (error) {
  console.error(error);
  res.status(500).json({ message: "Error creating checkout" });
 }
});

router.put("/:id/pay", protect, async (req, res) => {
 const { paymentStatus, paymentDetails } = req.body;
 try {
  const checkout = await Checkout.findById(req.params.id);
  
  if (!checkout) {
   return res.status(404).json({ message: "Checkout not found" });
  }

  if (paymentStatus === "paid") {
   checkout.isPaid = true;
   checkout.paymentStatus = paymentStatus;
   checkout.paymentDetails = paymentDetails;
   checkout.paidAt = Date.now();
   await checkout.save();
   res.status(200).json(checkout);
  } else {
   return res.status(400).json({ message: "Invalid payment status" });
  }

 } catch (error) {
  console.error(error);
  res.status(500).json({ message: "Error updating checkout" });
 }
});


router.post("/:id/finalize", protect, async (req, res) => {
  try {
  const checkout = await Checkout.findById(req.params.id);
  if (!checkout) {
    return res.status(404).json({message: "Checkout not found"});
   }
   
   if (checkout.isPaid && !checkout.isFinalized) {
    const finalOrder = await Order.create({
      user: checkout.user,
      orderItems: checkout.checkoutItems,
      shippingAddress: checkout.shippingAddress,
      paymentMethod: checkout.paymentMethod,
      totalPrice: checkout.totalPrice,
      isPaid: false,
      paidAt: checkout.paidAt,
      isDelivered: false,
      paymentStatus: "pending",
      paymentDetails: checkout.paymentDetails,
    });

    checkout.isFinalized = true;
    checkout.finalizedAt = Date.now();
    await checkout.save();
    await Cart.findOneAndDelete({ user: checkout.user });
    res.status(201).json(finalOrder);
   } else if (checkout.isFinalized) {
    return res.status(400).json({ message: "Checkout already finalized" });
   } else {
    return res.status(400).json({ message: "Checkout is not paid" });
   }
  } catch (error) {
   console.error(error);
   res.status(500).json({ message: "Error finalizing checkout" });
  }
});

module.exports = router;
