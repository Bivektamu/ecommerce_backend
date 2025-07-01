import mongoose, { Schema } from "mongoose";

const CustomerSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },
    registeredDate: {
        type: Date,
        default: Date.now
    },
    address: {
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
    }

})

const Customer = mongoose.model('Customer', CustomerSchema)
export default Customer