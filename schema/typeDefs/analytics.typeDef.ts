import gql from "graphql-tag"


const analyticsTypeDef = gql`

enum ChangeDirection {
    INCREASE,
    DECREASE,
    NO_CHANGE
}

    type LowStockProduct {
        id: ID!,
        title: String!,
        sku: String!,
        quantity: Int!,
    }
    type CompletedOrder {
        _id:ID!
        total: Float!,
        orderPlaced: Date!,
        items: [CompletedOrderProductId!]!
    }

    type CompletedOrderProductId {
        productId: CompletedOrderProduct!
    }
type CompletedOrderProduct {
        _id:ID!
        category: String!
    }
    type YearlyStats {
        totalOrders: Int!,
        totalSales: Float,
        totalUsers: Int!,
    }
    type PercentageChange {
        changeBy: Int,
        changeDirection: ChangeDirection
    }

    type OrderItemsCategoryCounter {
        cat: String!,
        count: Int!
    }
    
    type SalesAnalytics {
        sales: Float!,
        changeInSales: Float!
    }
    type OrderAnalytics {
        orders: Float!,
        changeInOrders: Float!
    }

    
    type UserAnalytics {
        users: Int!,
        changeInUsers: Float!
    }

    type Sale {
        orderPlaced: Date!,
        total: Float!

    }

    type LowProduct {
        _id: ID!,
        title: String!,
        quantity: Int!,
        heroImg: String!,
        sku:String!
    }

    type Query {
        yearlyStats: YearlyStats
        orderAnalytics: OrderAnalytics
        salesAnalytics: SalesAnalytics
        userAnalytics: UserAnalytics
        totalLowStockProducts: [LowStockProduct],
        salesOverTime: [Sale],
        lowStockProducts: [LowProduct]
    }

`
export default analyticsTypeDef