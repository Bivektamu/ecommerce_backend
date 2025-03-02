import gql from "graphql-tag"
const reviewTypeDef = gql`
    type Review {
        id: ID!,
        customerId: ID!,
        productId: ID!,
        stars: Int!,
        review: String!
    }
    
    type Query {
        reviewsByProductId(id: ID): [Review]
    }

    input CreateReview {
        id: ID!,
        customerId: ID!,
        productId: ID!,
        stars: Int!,
        review: String!
    }
    type Mutation {
        createReview(input:CreateReview):Review
    }
`

export default reviewTypeDef