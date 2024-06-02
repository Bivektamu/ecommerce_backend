import { JwtPayload} from "jsonwebtoken"

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