import { CustomJwtPayload, User, UserRole, verifiedUser } from "../typeDefs"
import { verify } from "jsonwebtoken"

const verifyUser = (token: string) => {
    const verifiedUser: CustomJwtPayload = verify(token, process.env.JWTSECRET as string) as CustomJwtPayload

    if (verifiedUser) {
        const user: verifiedUser = {
            role: verifiedUser.role,
            id: verifiedUser.id
        }
        return user
    }
    return null
}

export default verifyUser