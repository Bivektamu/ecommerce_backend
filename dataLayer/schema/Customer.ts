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
    
})

const Customer = mongoose.model('Customer', CustomerSchema)
export default Customer