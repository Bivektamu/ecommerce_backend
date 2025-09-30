import Order from "../../dataLayer/schema/Order"
import User from "../../dataLayer/schema/User"
import { CompletedOrder, ErrorCode, OrderItemPopulated, OrderItemsCategoryCounter, OrderStatus, unknownShape, UserRole } from "../../typeDefs"
import verifyUser from "../../utilities/verifyUser"



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
                let startFiscalDate
                const currentYear = (new Date()).getFullYear()

                const currentMonth = (new Date()).getMonth() + 1
                if (currentMonth >= 7) {
                    startFiscalDate = new Date(currentYear, 7, 1)
                }
                else {
                    startFiscalDate = new Date(currentYear - 1, 7, 1)
                }

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

                const now = new Date()
                const currentYear = (now).getUTCFullYear()

                const currentMonth = (now).getUTCMonth()

                const startDate = new Date(Date.UTC(currentYear, currentMonth, 1))
                const endDate = new Date(Date.UTC(currentYear, currentMonth, now.getDate(), 23, 59, 59, 999))

                const monthlyOrders = await Order.find({
                    orderPlaced: {
                        $gte: startDate,
                        $lte: endDate
                    },
                    status: OrderStatus.COMPLETED
                }).select('total orderPlaced items.productId').populate({
                    path: 'items.productId',
                    select: 'category'
                }).lean<CompletedOrder[]>()

                const orderItems = [...monthlyOrders.flatMap(order => order.items)]
                console.log(orderItems)
                let catCounter: unknownShape = {}, orderByCategory:OrderItemsCategoryCounter[] = []
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


                const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1
                const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear

                const previousMonthstartDate = new Date(Date.UTC(previousYear, previousMonth, 1))
                const previousMonthendDate = new Date(Date.UTC(previousYear, previousMonth + 1, 0))

                const lastMonthOrders = await Order.find({
                    orderPlaced: {
                        $gte: previousMonthstartDate,
                        $lte: previousMonthendDate
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