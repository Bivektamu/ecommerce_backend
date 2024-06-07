import { JwtPayload} from "jsonwebtoken"
import { ObjectId } from "mongoose"

export type Customer = {
    id: String
    firstName: String,
    lastName: String,
    email: String,
    password: String
}

export type Admin = {
    id: String
    firstName: String,
    lastName: String,
    email: String,
    password: String
}


export interface MyContext {
    customer?: Omit<Customer, 'password'>
    admin?: Omit<Admin, 'password'>
}

export interface CustomJwtPayload extends JwtPayload {
    admin?: Omit<Admin, 'password'>
    customer?: Omit<Customer, 'password'>
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