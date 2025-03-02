import { Query } from "mongoose";
import Review from "../../dataLayer/schema/Review";
import { ReviewType, User } from "../../typeDefs";
import verifyUser from "../../utilities/verifyUser";

const reviewResolver = {
    Query: {
        reviewsByProductId: async (parent: any, args: any) => {
            const productId = args.id
            const reviews = await Review.find({ productId })
            console.log(reviews);

            return reviews
        }
    },
    Mutation: {
        createReview: async (parentparent: any, args: any, context: any) => {

            try {

                if (!context.token) {
                    throw new Error('Not Authenticated')
                }

                const user = verifyUser(context.token)

                if(!user || user.userRole !== User.CUSTOMER) {
                    throw new Error('Not Authenticated')
                }

                const {id, stars, productId, customerId, review} = args.input

                const newReview = new Review({
                    id,
                    stars,
                    productId,
                    customerId,
                    review
                })

                return await newReview.save()
            } catch (error) {
                throw error
            }

        }
    }
}

export default reviewResolver