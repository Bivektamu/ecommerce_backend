import { Query } from "mongoose";
import Review from "../../dataLayer/schema/Review";
import { ReviewType } from "../../typeDefs";

const reviewResolver = {
    Query: {
        reviewsByProductId: async(parent: any, args: any) => {
            const productId = args.id
            const reviews = await Review.find({productId })
            console.log(reviews);
            
            return reviews
        }
    }
}

export default reviewResolver