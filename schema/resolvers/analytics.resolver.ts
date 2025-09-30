import Order from "../../dataLayer/schema/Order"
import User from "../../dataLayer/schema/User"
import { CompletedOrder, ErrorCode, OrderItemPopulated, OrderItemsCategoryCounter, OrderStatus, unknownShape, UserRole } from "../../typeDefs"
import verifyUser from "../../utilities/verifyUser"

import { currentMonthStartDate, currentMonthEndDate, previousMonthStartDate, previousMonthEndDate, startFiscalDate } from '../../utilities/getDates'

const analyticsResolver = {
    Query: {
        yearlyStats: async (parent: any, args: any, context: any) => {
            try {
                // if (!context.token) {
                //     throw new Error(ErrorCode.NOT_AUTHENTICATED)
                // }
                // const user = verifyUser(context.token)

                // if (!user) {
                //     throw new Error(ErrorCode.NOT_AUTHENTICATED)
                // }

                // if (!user || user?.role !== UserRole.ADMIN) {
                //     throw new Error(ErrorCode.NOT_AUTHENTICATED)
                // }

                const endFiscalDate = new Date()

                const orders = await Order.find({
                    orderPlaced: {
                        $gte: startFiscalDate,
                        $lte: endFiscalDate
                    },
                    status: OrderStatus.COMPLETED
                }).select('total')

                const users = await User.find({
                    registeredDate: {
                        $gte: startFiscalDate,
                        $lte: endFiscalDate
                    }
                }).select('id')

                const yearlyStats = {
                    totalOrders: orders.length,
                    totalSales: orders.reduce((sum, order) => sum + order.total, 0),
                    totalUsers: users.length
                }

                return yearlyStats

            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(error.message || ErrorCode.INTERNAL_SERVER_ERROR)
                }
            }

        },
        salesAnalytics: async (parent: any, args: any, context: any) => {
            try {
                if (!context.token) {
                    throw new Error(ErrorCode.NOT_AUTHENTICATED)
                }
                const user = verifyUser(context.token)

                if (!user) {
                    throw new Error(ErrorCode.NOT_AUTHENTICATED)
                }

                if (!user || user?.role !== UserRole.ADMIN) {
                    throw new Error(ErrorCode.NOT_AUTHENTICATED)
                }

                const currentMonthOrders = await Order.find({
                    orderPlaced: {
                        $gte: currentMonthStartDate,
                        $lte: currentMonthEndDate
                    },
                    status: OrderStatus.COMPLETED
                }).select('total')

                const lastMonthOrders = await Order.find({
                    orderPlaced: {
                        $gte: previousMonthStartDate,
                        $lte: previousMonthEndDate
                    },
                    status: OrderStatus.COMPLETED
                }).select('total')

                const totalCurrentMonthSales = currentMonthOrders.reduce((sum, order) => sum + order.total, 0)

                const totalLastMonthSales = lastMonthOrders.reduce((sum, order) => sum + order.total, 0)

                let changeInOrders = 0, changeInSales = 0

                if (totalCurrentMonthSales > 0 && totalLastMonthSales > 0) {
                    changeInSales = ((totalCurrentMonthSales - totalLastMonthSales) / totalLastMonthSales) * 100
                }
                else if (totalLastMonthSales) {
                    changeInOrders = 100, changeInSales = 100
                }

                return {
                    sales: totalLastMonthSales,
                    changeInSales,
                }

                // throw new Error('working')

                // const monthlyStats = {
                //     currentMonthOrders,
                //     changeInOrders: 
                // }


                // const currentMonthUsers = await User.find({
                //     registeredDate: {
                //         $gte: startDate,
                //         $lte: endDate
                //     }
                // }).select('id')




                // return yearlyStats

            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(error.message || ErrorCode.INTERNAL_SERVER_ERROR)
                }
            }

        },
        orderAnalytics: async (parent: any, args: any, context: any) => {
            try {
                // if (!context.token) {
                //     throw new Error(ErrorCode.NOT_AUTHENTICATED)
                // }
                // const user = verifyUser(context.token)

                // if (!user) {
                //     throw new Error(ErrorCode.NOT_AUTHENTICATED)
                // }

                // if (!user || user?.role !== UserRole.ADMIN) {
                //     throw new Error(ErrorCode.NOT_AUTHENTICATED)
                // }



                const monthlyOrders = await Order.find({
                    orderPlaced: {
                        $gte: currentMonthStartDate,
                        $lte: currentMonthEndDate
                    },
                    status: OrderStatus.COMPLETED
                }).select('total orderPlaced items.productId').populate({
                    path: 'items.productId',
                    select: 'category'
                }).lean<CompletedOrder[]>()

                const orderItems = [...monthlyOrders.flatMap(order => order.items)]
                console.log(orderItems)
                let catCounter: unknownShape = {}, orderByCategory: OrderItemsCategoryCounter[] = []
                if (orderItems.length > 0) {

                    orderItems.map((order: OrderItemPopulated) => {
                        if (catCounter[order.productId.category]) {
                            catCounter[order.productId.category] = catCounter[order.productId.category] + 1
                        }
                        else {
                            catCounter[order.productId.category] = 1
                        }
                    })
                    orderByCategory = Object.keys(catCounter).map(cat => ({
                        cat,
                        count: catCounter[cat]
                    }))

                    console.log(orderByCategory)

                }

                const totalOrders = monthlyOrders.length
                const totalSales = monthlyOrders.reduce((sum, order) => sum + order.total, 0)


                const lastMonthOrders = await Order.find({
                    orderPlaced: {
                        $gte: previousMonthStartDate,
                        $lte: previousMonthEndDate
                    },
                    status: OrderStatus.COMPLETED
                }).select('total')

                let changeInOrders = 0, changeInSales = 0

                if (monthlyOrders.length > 0 && lastMonthOrders.length > 0) {
                    changeInOrders = ((monthlyOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100

                    const lastMonthSales = lastMonthOrders.reduce((sum, order) => sum + order.total, 0)
                    changeInSales = ((totalSales - lastMonthSales) / lastMonthSales) * 100

                }
                else if (lastMonthOrders.length < 1) {
                    changeInOrders = 100, changeInSales = 100
                }

                return {
                    totalOrders,
                    totalSales,
                    monthlyOrders,
                    changeInOrders,
                    changeInSales,
                    orderByCategory
                }

                // throw new Error('working')

                // const monthlyStats = {
                //     currentMonthOrders,
                //     changeInOrders: 
                // }


                // const currentMonthUsers = await User.find({
                //     registeredDate: {
                //         $gte: startDate,
                //         $lte: endDate
                //     }
                // }).select('id')




                // return yearlyStats

            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(error.message || ErrorCode.INTERNAL_SERVER_ERROR)
                }
            }

        }
    }
}

export default analyticsResolver