const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const mongoose = require("mongoose");

router.get("/", (req, res, next) => {
  Product.find()
    .then((products) => {
      console.log(products);
      res.status(200).json(products);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        errror: err,
      });
    });
});

router.post("/", (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });
  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "handling POST requests to /products",
        product: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .then((doc) => {
      console.log(`from the database${doc}`);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({
          message: "no valid entry found",
        });
      }

      res.status(200).json({
        doc,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.patch("/:productId", (req, res, next) => {
    const id = req.params.productId
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }

    Product.findByIdAndUpdate({_id: id}, {$set: updateOps})
    .then(result => {
        console.log(result)
        res.status(200).json(result)
    })
});

router.delete("/:productId", (req, res, next) => {
    const id = req.params.productId;
    Product.findByIdAndDelete({_id: id})
    .then((result) => {
        // res.console('deleted successfully')
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    });
});

module.exports = router;
