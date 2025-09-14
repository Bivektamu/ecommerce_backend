import { CustomJwtPayload, ErrorCode, User, UserRole, verifiedUser } from "../typeDefs"
import { verify } from "jsonwebtoken"

const verifyUser = (token: string) => {
    try {

        const verifiedUser: CustomJwtPayload = verify(token, process.env.JWTSECRET as string) as CustomJwtPayload

        console.log(verifiedUser)

        if (verifiedUser) {
            const user: verifiedUser = {
                role: verifiedUser.role,
                id: verifiedUser.id
            }
            return user
        }
        return null
    } catch (error) {
         if(error instanceof Error) {
          throw new Error(ErrorCode.JWT_ERROR)
        }
    }
}

export default verifyUser