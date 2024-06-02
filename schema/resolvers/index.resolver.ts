import adminRresolver from "./admin.resolver";
import customerRresolver from "./customer.resolver";


const globalResolver = {
    Query: {
        getAuthStatus: (parent: any, args: any, context: any) => {

            if (context !== null && (context.admin || context.customer))
                return { isLoggedIn: true }

            else
                return { isLoggedIn: false }
        }
    },
}

export default [globalResolver, customerRresolver, adminRresolver]