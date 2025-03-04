import { timeStamp } from "console";
import mongoose, { Schema } from "mongoose";

const ReviewSchema = new Schema({
    
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
    rating: {
        type:Number,
        required: true
    },
    review: {
        type: String,
        required: true
    },
    timeStamp: {
        type: Date,
        default: Date.now
    }

})

const Review = mongoose.model('Review', ReviewSchema)
export default Review
