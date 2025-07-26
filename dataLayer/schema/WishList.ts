import mongoose, { Schema } from "mongoose";

const WishListSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },

        products: [
            {
                id: {
                    type: Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product'
                }
            },
        ]
    },
    {
        timestamps: true,
    }

)

const WishList = mongoose.model('WishList', WishListSchema)
export default WishList