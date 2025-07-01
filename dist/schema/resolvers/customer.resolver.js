"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Customer_1 = __importDefault(require("../../dataLayer/schema/Customer"));
const typeDefs_1 = require("../../typeDefs");
const validateForm_1 = __importDefault(require("../../utilities/validateForm"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const verifyUser_1 = __importDefault(require("../../utilities/verifyUser"));
const customerRresolver = {
    Query: {
        customers: async (parent, args, context) => {
            if (!context.token) {
                throw new Error('Not Authenticated');
            }
            const user = (0, verifyUser_1.default)(context.token);
            if (user?.role !== typeDefs_1.User.ADMIN) {
                throw new Error('Not Authenticated');
            }
            const customers = await Customer_1.default.find();
            return customers;
        },
        customer: async (parent, args, context) => {
            if (!context.token) {
                throw new Error('Not Authenticated');
            }
            const user = (0, verifyUser_1.default)(context.token);
            if (!user) {
                throw new Error('Not Authenticated');
            }
            const id = args.id;
            const findCustomer = await Customer_1.default.findById(id);
            return findCustomer;
        },
        customerEmail: async (parent, args) => {
            const id = args.id;
            const findCustomer = await Customer_1.default.findById(id);
            if (!findCustomer) {
                throw new Error('Customer email not found');
            }
            return findCustomer.email;
        },
        customerName: async (parent, args) => {
            const id = args.id;
            const findCustomer = await Customer_1.default.findById(id);
            if (!findCustomer) {
                throw new Error('Customer email not found');
            }
            return { firstName: findCustomer.firstName, lastName: findCustomer.lastName };
        }
    },
    Mutation: {
        createCustomer: async (parent, args) => {
            const { email, password, firstName, lastName } = args.input;
            const validateSchema = [
                { value: firstName, name: 'firstName', type: 'string' },
                { value: lastName, name: 'lastName', type: 'string' },
                { value: email, name: 'email', type: 'email' },
                { value: password, name: 'password', type: 'password' },
            ];
            const errors = (0, validateForm_1.default)(validateSchema);
            if (Object.keys(errors).length > 0) {
                throw new Error(JSON.stringify(errors));
            }
            const customerExists = await Customer_1.default.findOne({ email: email.toLowerCase() });
            if (customerExists) {
                throw new Error('User already exists');
            }
            const customer = new Customer_1.default({
                firstName,
                lastName,
                email: email.toLowerCase(),
                password
            });
            const salt = bcrypt_1.default.genSaltSync(8);
            customer.password = bcrypt_1.default.hashSync(password, salt);
            return await customer.save();
        },
        deleteCustomer: async (parent, args) => {
            const { id } = args;
            try {
                const deletedUser = await Customer_1.default.findByIdAndDelete(id);
                if (deletedUser) {
                    return {
                        success: true,
                    };
                }
                throw new Error('User not found');
            }
            catch (error) {
                if (error instanceof Error) {
                    return {
                        success: false,
                        message: error.message
                    };
                }
            }
        },
        updateAddress: async (parent, args, context) => {
            if (!context.token) {
                throw new Error('Not Authenticated');
            }
            const user = (0, verifyUser_1.default)(context.token);
            if (!user || user.role !== typeDefs_1.User.CUSTOMER) {
                throw new Error('Not Authenticated');
            }
            const { street, city, state, zipcode, country } = args.input;
            const validateSchema = [
                { value: street, name: 'street', type: 'string' },
                { value: city, name: 'city', type: 'string' },
                { value: state, name: 'state', type: 'string' },
                { value: zipcode, name: 'zipcode', type: 'number', required: false },
                { value: country, name: 'country', type: 'string' },
            ];
            const errors = (0, validateForm_1.default)(validateSchema);
            if (Object.keys(errors).length > 0) {
                throw new Error(JSON.stringify(errors));
            }
            const findCustomer = await Customer_1.default.findById(user.id);
            if (!findCustomer) {
                throw new Error('Customer not found');
            }
            const address = {
                street, city, state, country
            };
            if (zipcode > 0) {
                address.zipcode = zipcode;
            }
            try {
                const updatedAddress = await Customer_1.default.findByIdAndUpdate(user.id, {
                    address
                });
                console.log(updatedAddress);
                return {
                    success: true
                };
            }
            catch (error) {
                if (error instanceof Error)
                    throw new Error(error.message);
            }
        }
    }
};
exports.default = customerRresolver;
