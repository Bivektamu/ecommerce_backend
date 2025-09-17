import WishList from "../../dataLayer/schema/WishList"
import { ErrorCode, UserRole } from "../../typeDefs"
import verifyUser from "../../utilities/verifyUser"

const wishListResolver = {
    Query: {
        wishListByUserId: async (parent: any, args: any, context: any) => {
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


            const userId = args.userId

            if (!userId) {
                throw new Error(ErrorCode.INPUT_ERROR)
            }

            const wishList = await WishList.findOne({ userId })

            if (!wishList) {
                throw new Error(ErrorCode.NOT_FOUND)
            }

            return wishList
        },
    },
    Mutation: {
        addToWishList: async (parent: any, args: any, context: any) => {
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

                const { userId, products } = args.input

                // const wishListExists = await WishList.findOne({ userId })

                // if (!wishListExists) {
                //     const wishList = new WishList({
                //         userId,
                //         products: products
                //     })

                //     await wishList.save()

                //     return wishList
                // }

                const updatedWishList = await WishList.findOneAndUpdate(
                    { userId },
                    {
                        userId,
                        products
                    },
                    {
                        new: true,
                        upsert: true,
                        runValidators: true
                    }
                )


                return updatedWishList


            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(error.message || ErrorCode.INTERNAL_SERVER_ERROR)
                }
            }


        },
        // updateWishList: async (parent: any, args: any, context: any) => {
        //     if (!context.token) {
        //         throw new Error(ErrorCode.NOT_AUTHENTICATED)
        //     }
        //     const user = verifyUser(context.token)
        //     if (!user) {
        //         throw new Error(ErrorCode.NOT_AUTHENTICATED)
        //     }
        //     if (user.role !== UserRole.CUSTOMER) {
        //         throw new Error(ErrorCode.NOT_AUTHENTICATED)
        //     }

        //     try {

        //         const { id, userId, products } = args.input



        //     } catch (error) {
        //         if (error instanceof Error) {
        //             throw new Error(error.message || ErrorCode.INTERNAL_SERVER_ERROR)
        //         }
        //     }


        // }
    }
}

export default wishListResolver