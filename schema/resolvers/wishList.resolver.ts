import WishList from "../../dataLayer/schema/WishList"
import { ErrorCode, UserRole } from "../../typeDefs"
import verifyUser from "../../utilities/verifyUser"

const wishListResolver = {
    Query: {},
    Mutation: {
        createWishList: async (parent: any, args: any, context: any) => {
            if (!context.token) {
                throw new Error(ErrorCode.NOT_AUTHENTICATED)
            }
            const user = verifyUser(context.token)
            if (!user) {
                throw new Error(ErrorCode.NOT_AUTHENTICATED)
            }
            if (user.role !== UserRole.CUSTOMER) {
                throw new Error(ErrorCode.NOT_AUTHENTICATED)
            }

            try {

                const { userId, products} = args.input

                const wishList = new  WishList({
                    userId,
                    products
                })

                await wishList.save()
                return wishList

            } catch (error) {
                if(error instanceof Error) {
                    throw new Error(error.message || ErrorCode.INTERNAL_SERVER_ERROR)
                }
            }


        }
    }
}

export default wishListResolver