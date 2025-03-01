import mongoose, { Schema } from "mongoose";

const ReviewSchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    customerId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Customer'
    },
    productId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
    stars: {
        type:Number,
        required: true
    },
    review: {
        type: String,
        required: true
    }

})

const Review = mongoose.model('Review', ReviewSchema)
export default Review
