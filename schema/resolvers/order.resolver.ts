import UserSchem from "../../dataLayer/schema/User"
import Order from "../../dataLayer/schema/Order"
import { ErrorCode, User, UserRole } from "../../typeDefs"
import verifyUser from "../../utilities/verifyUser"
import { GraphQLError } from "graphql"


const orderResolver = {
    Query: {
        orders: async (parent: any, args: any, context: any) => {

            try {
                // await new Promise((resolve) => setTimeout(resolve, 5000));
                if (!context.token) {
                    throw new Error(ErrorCode.NOT_AUTHENTICATED)
                }

                const user = verifyUser(context.token)

                if (!user) {
                    throw new GraphQLError('Not Authenticated', {
                        extensions: {
                            code: ErrorCode.NOT_AUTHENTICATED
                        }
                    })
                }

                if (user && user.role === UserRole.CUSTOMER) {
                    throw new GraphQLError('Not Authenticated', {
                        extensions: {
                            code: ErrorCode.NOT_AUTHENTICATED
                        }
                    })
                }

                const orders = await Order.find()
                return orders

            } catch (error) {
                if (error instanceof Error) {
                    throw new GraphQLError(error.message, {
                        extensions: {
                            code: ErrorCode.INTERNAL_SERVER_ERROR
                        }
                    })
                }
            }
        },
        userOrders: async (parent: any, args: any, context: any) => {

            try {
                if (!context.token) {
                    throw new Error(ErrorCode.NOT_AUTHENTICATED)
                }

                const user = verifyUser(context.token)

                if (!user) {
                    throw new GraphQLError('Not Authenticated', {
                        extensions: {
                            code: ErrorCode.NOT_AUTHENTICATED
                        }
                    })
                }

                const id = args.id
                const findUser = await UserSchem.findById(id)
                if (!user) {
                    throw new GraphQLError('Not Authenticated', {
                        extensions: {
                            code: ErrorCode.NOT_AUTHENTICATED
                        }
                    })
                }

                const orders = await Order.find({ userId: id })
                return orders
            } catch (error) {
                if (error instanceof Error) {
                    throw new GraphQLError(error.message, {
                        extensions: {
                            code: ErrorCode.INTERNAL_SERVER_ERROR
                        }
                    })
                }
            }

        },
        orderByNumber: async (parent: any, args: any, context: any) => {

            try {
                if (!context.token) {
                    throw new Error(ErrorCode.NOT_AUTHENTICATED)
                }

                const user = verifyUser(context.token)

                if (!user) {
                    throw new Error(ErrorCode.NOT_AUTHENTICATED)
                }

                const orderNumber = args.orderNumber
                if (!orderNumber) {
                    throw new Error(ErrorCode.INPUT_ERROR)
                }

                const order = await Order.find({ orderNumber })
                if (order.length < 1) {
                    throw new Error(ErrorCode.NOT_FOUND)
                }
                return order[0]

            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(error.message || ErrorCode.INTERNAL_SERVER_ERROR)
                }
            }

        },
    },
    Mutation: {
        createOrder: async (parent: any, args: any, context: any) => {
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
                const {
                    userId,
                    status,
                    total,
                    subTotal,
                    tax,
                    items,
                    shippingAddress,
                } = args.input

                const newOrder = new Order({
                    orderNumber: Date.now() + Math.floor((Math.random() * 1000)),
                    userId,
                    status,
                    total,
                    subTotal,
                    tax,
                    items,
                    shippingAddress,
                })

                await newOrder.save()
                return newOrder.orderNumber

            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(error.message || ErrorCode.INTERNAL_SERVER_ERROR)
                }

            }

        },
        updateOrderStatus: async (parent: any, args: any, context: any) => {

            if (!context.token) {
                throw new Error(ErrorCode.NOT_AUTHENTICATED)
            }

            const user = verifyUser(context.token)
            if (!user) {
                throw new Error(ErrorCode.NOT_AUTHENTICATED)
            }

            if (user.role !== UserRole.ADMIN) {
                throw new Error(ErrorCode.NOT_AUTHENTICATED)
            }

            const { id, status } = args.input

            try {
                const updateState = await Order.updateOne(
                    { _id: id },
                    {
                        $set: {
                            status
                        }
                    }
                )
                const { acknowledged, modifiedCount } = updateState
                if (acknowledged && modifiedCount === 1) {
                    return status
                }
                else throw new Error(ErrorCode.INTERNAL_SERVER_ERROR)

            } catch (error) {
                if (error instanceof Error)
                    throw new Error(error.message)
            }

        }
    }
}

export default orderResolver