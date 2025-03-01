import { JwtPayload} from "jsonwebtoken"
import mongoose, { ObjectId } from "mongoose"

export type Customer = {
    id: String
    firstName: String,
    lastName: String,
    email: String,
    password: String
}

export enum User {
    ADMIN = 'ADMIN',
    CUSTOMER = 'CUSTOMER',
}

export type Admin = {
    id: String
    firstName: String,
    lastName: String,
    email: String,
    password: String
}

export interface UserRole {
    userRole: User,
    id:string

}

export interface CustomJwtPayload extends JwtPayload {
    userRole:User,
    id:string,
    iat: number,
    exp:number
}

export interface MyContext {
    customer?: Omit<Customer, 'password'>
    admin?: Omit<Admin, 'password'>
}



export interface inputProductImg {
    _id:string,
    img:any
}

export interface ProductImage {
    _id: ObjectId,
    url: string,
    fileName:string
}

export interface FormError {
    [key:string] : string
}

export interface ValidateSchema<T> {
    name: string,
    type: string,
    value: T,
    msg?:string
}

export interface ReviewType {
    id: String,
    customerId: mongoose.Types.ObjectId,
    productId: mongoose.Types.ObjectId,
    stars: Number,
    review: String
}