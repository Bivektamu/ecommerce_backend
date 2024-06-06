import { Admin, CustomJwtPayload, Customer } from "../typeDefs"
import { verify } from "jsonwebtoken"

const verifyUser = (token: string) => {
    const user = verify(token, process.env.JWTSECRET as string) as CustomJwtPayload

    if (user) {
        if(user.admin) {
            const admin:Omit<Admin, 'password'> = {
                ...user.admin,
                firstName: 'Admin1',
                lastName:'AdminLastName',
                email:process.env.ADMIN_EMAIL as string
            }
            return admin
        }
        return user.customer as Omit<Customer, 'password'>
    }
    return null
    // return user
}

export default verifyUser