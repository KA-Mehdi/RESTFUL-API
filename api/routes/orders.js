const express = require('express');
const router = express.Router()
const mongoose = require('mongoose')
const Order = require('../models/order')


router.get('/', (req, res, next) =>{
    Order.find()
    .select("product quantity _id")
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


router.post('/', (req, res, next) =>{
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

router.get('/:orderId', (req, res, next) =>{
    Order.findById(req.params.orderId)
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

router.delete('/:orderId', (req, res, next) => {
    Order.findByIdAndDelete(req.params.orderId)
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