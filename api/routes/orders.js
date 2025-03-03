const express = require('express');
const router = express.Router()

router.get('/', (req, res, next) =>{
    res.status(200).json({
        message: 'orders were fetched'
    })
})


router.post('/', (req, res, next) =>{
    const order = {
        productId : req.body.id,
        quantity: req.body.quantity

    }
    res.status(201).json({
        message: 'order was created'
    })
})

router.get('/:orderId', (req, res, next) =>{
    res.status(200).json({
        message: 'orders were fetched',
        orderId : req.params.orderId
    })
})

module.exports = router