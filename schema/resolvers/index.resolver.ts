
import { GraphQLUpload } from 'graphql-upload-ts'
import authResolver from "./auth.resolver";
import customerRresolver from "./customer.resolver";
import productResolver from './product.resolver';

const globalResolver = {
    Upload: GraphQLUpload,
}

export default [globalResolver, customerRresolver, authResolver, productResolver]