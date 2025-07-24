import mongoose, { Schema } from "mongoose";

const OrderSchema = new Schema({
    orderNumber: {
        type: String,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['PENDING', 'COMPLETED', 'PROCESSING', 'CANCELLED', 'FAILED', 'SHIPPED', 'REFUNDED'],
        required: true,
    },
    
    subTotal: {
        type: Number,
        required: true,
    },
    
    tax: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },

    items: [{
        productId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Product'
        },
        color: {
            type: String,
            enum: ['BLACK', 'RED', 'GRAY', 'WHITE', 'AMBER'],
            required: true
        },
        quantity: {
            type: Number,
            required: true,
        },
        size: {
            type: String,
            enum: ['S', 'M', 'L', 'XL'],
            required: true
        },
        price: {
            type: Number,
            required: true,
        },
        imgUrl: {
            type: String,
            required: true
        }
    }]
    ,
    shippingAddress: {
        street: {
            type: String,
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        postcode: {
            type: String,
        },
        country: {
            type: String,
        },
    },
    orderPlaced: {
        type: Date,
        default: Date.now
    },


})

const Order = mongoose.model('Order', OrderSchema)
export default Order