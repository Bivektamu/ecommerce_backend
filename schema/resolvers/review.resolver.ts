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
                if(!productId) {
                    throw new Error(ErrorCode.INPUT_ERROR)
                }
                const reviews = await Review.find({ productId }).populate('userId', 'email firstName lastName')
                return reviews
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(error.message || ErrorCode.INTERNAL_SERVER_ERROR)
                }

            }

        },
        reviews: async (parent: any, args: any, context: any) => {

            try {
                if (!context.token) {
                    throw new Error('Not Authenticated')
                }

                const user = verifyUser(context.token)

                if (!user || user.role !== UserRole.ADMIN) {
                    throw new Error('Not Authenticated')
                }

                const reviews = await Review.find().populate("userId", "firstName lastName email").populate('productId', 'title imgs')

                return reviews

            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(error.message)
                }

            }
        }


    },
    Mutation: {
        createReview: async (parent: any, args: any, context: any) => {

            if (!context.token) {
                throw new Error('Not Authenticated')
            }

            const user = verifyUser(context.token)

            if (!user || user.role !== UserRole.CUSTOMER) {
                throw new Error('Not Authenticated')
            }

            const { rating, productId, userId, review } = args.input

            const validateSchema: ValidateSchema<any>[] = [
                { value: rating, name: 'rating', type: 'number' },
                { value: productId, name: 'productId', type: 'string' },
                { value: userId, name: 'userId', type: 'string' },
                { value: review, name: 'review', type: 'string' },
            ]

            const errors: FormError = validateForm(validateSchema)
            if (Object.keys(errors).length > 0) {
                throw new Error(JSON.stringify(errors))
            }

            const newReview = new Review({
                rating,
                productId,
                userId,
                review
            })

            return await newReview.save()


        },
        editReview: async (parent: any, args: any, context: any) => {

            try {
                if (!context.token) {
                    throw new Error('Not Authenticated')
                }

                const user = verifyUser(context.token)

                if (!user || user.role !== UserRole.CUSTOMER) {
                    throw new Error('Not Authenticated')
                }

                const { rating, review, id } = args.input

                const validateSchema: ValidateSchema<any>[] = [
                    { value: rating, name: 'rating', type: 'number' },
                    { value: review, name: 'review', type: 'string' },
                ]

                const errors: FormError = validateForm(validateSchema)
                if (Object.keys(errors).length > 0) {
                    throw new Error(JSON.stringify(errors))
                }

                const editedReview = await Review.findByIdAndUpdate(
                    id,
                    {
                        rating,
                        review
                    })

                return editedReview


            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(error.message)
                }
            }
        },
        deleteReview: async (parent: any, args: any, context: any) => {

            try {
                if (!context.token) {
                    throw new Error('Not Authenticated')
                }

                const user = verifyUser(context.token)

                if (!user) {
                    throw new Error('Not Authenticated')
                }

                const { id } = args
                const deletedReview = await Review.findByIdAndDelete(id)
                if (deletedReview) {
                    return {
                        success: true,
                    }

                }
                throw new Error('Review not found')
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(error.message)
                }
            }
        }
    }
};

export default reviewResolver