const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const mongoose = require("mongoose");

router.get("/", (req, res, next) => {
  Product.find()
  .select('name price _id')
  .then((products) => {
      const response = {
          count: products.length,
          products : products.map(product => ({
                name: product.name,
                price: product.price,
                _id: product._id,
                request: {
                    type:"GET",
                    url:`http://localhost:3000/${product.id}`
                }

          }))
      }
      res.status(200).json(response);
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
      res.status(201).json({
        message: "Created product successfully",
        createdProduct: {
            name: result.name,
            price: result.price,
            _id: result._id,
            request: {
                type:"GET",
                url:`http://localhost:3000/${result.id}`
            }
        }
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
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json({
            product: doc,
            request:{
                type: "GET",
                url:"http://localhost:3000/products/"
            }
        });
      } else {
        res.status(404).json({
          message: "no valid entry found",
        });
      }
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
      .exec()
      .then(result => {
        res.status(200).json({
            message: 'product updated',
            request: {
                type:'GET',
                url: 'http://localhost:3000/products/'
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
});



router.delete("/:productId", (req, res, next) => {
    const id = req.params.productId;
    Product.findByIdAndDelete({_id: id})
      .exec()
      .then((result) => {
        // res.console('deleted successfully')
        res.status(200).json({
            message: 'product deleted',
            request: {
                type:'POST',
                url: 'http://localhost:3000/products',
                body: {name: 'String', price: 'Number'}
            }
        });
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    });
});

module.exports = router;
