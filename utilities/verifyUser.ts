import { Admin, CustomJwtPayload, Customer, User } from "../typeDefs"
import { verify } from "jsonwebtoken"

const verifyUser = (token: string) => {
    const userVerified = verify(token, process.env.JWTSECRET as string) as CustomJwtPayload

    if (userVerified) {
        if (userVerified.admin) {
            return { user: User.ADMIN }
        }
        return { user: User.CUSTOMER }
        // return user.customer as Omit<Customer, 'password'>
    }
    return { user: null }
}

export default verifyUser