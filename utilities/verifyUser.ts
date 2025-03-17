import { Admin, Customer, CustomJwtPayload, User, UserRole } from "../typeDefs"
import { verify } from "jsonwebtoken"

const verifyUser = (token: string) => {
    const verifiedUser: CustomJwtPayload = verify(token, process.env.JWTSECRET as string) as CustomJwtPayload
    console.log('asdf');
    console.log(verifiedUser);
    


    if (verifiedUser) {
        const userRole: UserRole = {
            role: verifiedUser.role,
            id: verifiedUser.id
        }
        return userRole
    }
    return null
}

export default verifyUser