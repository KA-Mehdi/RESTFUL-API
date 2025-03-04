const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  // link the database order with product
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true},
  quantity: { type: Number, default: 1 }
});

module.exports = mongoose.model("Order", orderSchema);
