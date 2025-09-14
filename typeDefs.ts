import { JwtPayload } from "jsonwebtoken"
import mongoose, { ObjectId } from "mongoose"


export type Address = {
    street: String,
    city: String,
    state: String,
    postcode: String,
    country: String,
}

export enum UserRole {
    ADMIN = 'admin',
    CUSTOMER = 'customer',
}

export type User = {
    id: String
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    role: UserRole
}

export interface CustomJwtPayload extends JwtPayload {
    role: UserRole,
    id: string,
    iat?: number,
    exp?: number
}

export interface verifiedUser {
    role: UserRole,
    id: string
}

export interface MyContext {
    token?: String
}


export interface inputProductImg {
    _id: string,
    img: any
}

export interface ProductImage {
    _id: ObjectId,
    url: string,
    fileName: string
}

export interface FormError {
    [key: string]: string
}

export interface ValidateSchema<T> {
    name: string,
    type: string,
    value: T,
    msg?: string,
    required?: boolean
}

export interface ReviewType {
    id: String,
    customerId: mongoose.Types.ObjectId,
    productId: mongoose.Types.ObjectId,
    stars: Number,
    review: String
}

export interface CustomError extends Error {
    code: ErrorCode
}

export enum ErrorCode {
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    BAD_CREDENTIALS = 'BAD_CREDENTIALS',
    SHIPPING_ADDRESS_ERROR = 'SHIPPING_ADDRESS_ERROR',
    INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
    NOT_AUTHENTICATED = 'NOT_AUTHENTICATED',
    WRONG_USER_TYPE = 'WRONG_USER_TYPE',
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    INPUT_ERROR = 'INPUT_ERROR',
    NOT_FOUND = 'NOT_FOUND',
    JWT_ERROR = 'JWT_ERROR'
} 