const express = require('express');
const router = express.Router()
const mongoose = require('mongoose')
const Order = require('../models/order')
const checkAuth = require('../middleware/check-auth')

router.get('/',checkAuth, (req, res, next) =>{
    Order.find()
    .select("product quantity _id")
    .populate('product')
    .exec()
    .then(orders => {
        res.status(200).json({
            count: orders.length,
            orders : orders.map(order => {
                return {
                    _id: order._id,
                    product : order.product,
                    quantity : order.quantity,
                    request: {
                        type: "GET",
                        url: `http://localhost:3000/orders/${order._id}`
                    }
                }
            })
        })
        
    })
    .catch(err => {
        res.status(404).json({
            error: err
        })
    })
})


router.post('/',checkAuth, (req, res, next) =>{
    const order = new Order({
        _id:  new mongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: req.body.quantity
    })
     order.save()
    .then(result => {
        console.log(result)
        res.status(201).json({
            message : "order stored",
            createdOrder: {
                _id: result._id,
                product: result.product,
                quantity : result.quantity
            },
            request: {
                type: "GET",
                url: `http://localhost:3000/orders/${result._id}`
            }
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
})

router.get('/:orderId',checkAuth, (req, res, next) =>{
    Order.findById(req.params.orderId)
    .populate('product')
    .exec()
    .then(order => {
        res.status(200).json({
            order: order,
            request: {
                type: "GET",
                url: "http://localhost:3000/orders"
            }
        })
    })
    .catch(err => {
        res.status(404).json(err)
    }) 
})

router.delete('/:orderId',checkAuth, (req, res, next) => {
    Order.findByIdAndDelete(req.params.orderId)
    .exec()
    .then(
        res.status(200).json({
            message: "order deleted successfully",
            request: {
                type: "POST",
                body: { productId: 'ID', quantity : 'Number'},
                url: "http://localhost:3000/orders"
            }
        })
    )
    .catch(err => {
        res.status(404).json({err})
    })
})
module.exports = router