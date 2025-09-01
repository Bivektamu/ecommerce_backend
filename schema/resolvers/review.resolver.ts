import { Query } from "mongoose";
import Review from "../../dataLayer/schema/Review";
import { ErrorCode, FormError, ReviewType, User, UserRole, ValidateSchema } from "../../typeDefs";
import verifyUser from "../../utilities/verifyUser";
import validateForm from "../../utilities/validateForm";

const reviewResolver = {
    Query: {
        productReviews: async (parent: any, args: any) => {
            try {
                const productId = args.id
                const reviews = await Review.find({ productId })
                return reviews
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(error.message || ErrorCode.INTERNAL_SERVER_ERROR)
                }

            }

        },


    },
    Mutation: {
        createReview: async (parentparent: any, args: any, context: any) => {


            if (!context.token) {
                throw new Error('Not Authenticated')
            }

            const user = verifyUser(context.token)

            if (!user || user.role !== UserRole.CUSTOMER) {
                throw new Error('Not Authenticated')
            }

            const { rating, productId, customerId, review } = args.input

            const validateSchema: ValidateSchema<any>[] = [
                { value: rating, name: 'rating', type: 'number' },
                { value: productId, name: 'productId', type: 'string' },
                { value: customerId, name: 'customerId', type: 'string' },
                { value: review, name: 'review', type: 'string' },
            ]

            const errors: FormError = validateForm(validateSchema)
            if (Object.keys(errors).length > 0) {
                throw new Error(JSON.stringify(errors))
            }

            const newReview = new Review({
                rating,
                productId,
                customerId,
                review
            })

            return await newReview.save()


        }
    }
}

export default reviewResolver