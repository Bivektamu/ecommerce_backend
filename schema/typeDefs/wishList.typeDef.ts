import gql from "graphql-tag";


const wishListTypeDef = gql`

    type ProductId {
        id: ID!
    }

    type WishList {
        id:ID!,
        userId:ID!,
        products:[ProductId!]
        createdAt: Date!
    }

    input ProductIdInput {
        id: ID!
    }
    
    input WishListInput {
        userId:ID!,
        products:[ProductIdInput!]
    }
    
    type Mutation {
        addToWishList(input:WishListInput):WishList
    }

    type Query {
        wishListByUserId(userId:ID):WishList
    }
`

export default wishListTypeDef