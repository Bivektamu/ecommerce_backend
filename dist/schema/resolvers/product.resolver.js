"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Product_1 = __importDefault(require("../../dataLayer/schema/Product"));
const verifyUser_1 = __importDefault(require("../../utilities/verifyUser"));
const uploadImage_1 = __importDefault(require("../../utilities/uploadImage"));
const deleteImage_1 = __importDefault(require("../../utilities/deleteImage"));
const productResolver = {
    Query: {
        products: async (parent, args, context) => {
            // if (!context.token) {
            //   throw new Error('Not Authenticated')
            // }
            // const admin = verifyUser(context.token)
            // if (!admin) {
            //   throw new Error('Not Authenticated')
            // }
            const products = await Product_1.default.find();
            return products;
            // return products.map(({__typename, ...rest})=>rest)
        },
        product: async (parent, args, context) => {
            const admin = context.admin;
            if (!admin) {
                throw new Error('Not Authenticated');
            }
            const id = args.id;
            const findproduct = await Product_1.default.findById(id);
            return findproduct;
        }
    },
    Mutation: {
        createProduct: async (parent, args, context) => {
            if (!context.token) {
                throw new Error('Not Authenticated');
            }
            const admin = (0, verifyUser_1.default)(context.token);
            if (!admin) {
                throw new Error('Not Authenticated');
            }
            try {
                const { title, slug, description, colors, sizes, price, category, quantity, sku, stockStatus, featured, imgs } = args.input;
                const productExists = await Product_1.default.findOne({ slug: slug.toLowerCase() });
                if (productExists) {
                    throw new Error('Product Already Exists');
                }
                const folder = `public/upload/product`;
                let newImgs = [];
                try {
                    const uploadPromises = imgs.map((item) => (0, uploadImage_1.default)(item, folder, slug));
                    newImgs = await Promise.all(uploadPromises);
                }
                catch (error) {
                    throw error;
                }
                const newProduct = new Product_1.default({
                    title, slug, description, colors, sizes, price, quantity, category, sku, stockStatus, featured, imgs: newImgs
                });
                return await newProduct.save();
            }
            catch (error) {
                if (error) {
                    console.log(error);
                    throw error;
                }
            }
        },
        editProduct: async (parent, args, context) => {
            try {
                if (!context.token) {
                    throw new Error('Not Authenticated');
                }
                const admin = (0, verifyUser_1.default)(context.token);
                if (!admin) {
                    throw new Error('Not Authenticated');
                }
                const { title, slug, description, colors, sizes, price, category, quantity, sku, stockStatus, featured, newImgs, oldImgs, id } = args.input;
                const productExists = await Product_1.default.findById(id);
                if (!productExists) {
                    throw new Error('Product does not Exist');
                }
                let toUpdateImgs = [...oldImgs];
                // loop thorugh old images and filter out if its its exists in new images or not
                if (productExists?.imgs.length > oldImgs.length) {
                    const imgToDelete = productExists?.imgs.filter(img => oldImgs.findIndex((oldImg) => oldImg.id === img.id) < 0).map(img => img.fileName);
                    imgToDelete.map(img => (0, deleteImage_1.default)(img));
                }
                if (newImgs.length > 0) {
                    const folder = `public/upload/product`;
                    try {
                        const uploadPromises = newImgs.map((item) => (0, uploadImage_1.default)(item, folder, slug));
                        const uploadedImgs = await Promise.all(uploadPromises);
                        toUpdateImgs = [...toUpdateImgs, ...uploadedImgs];
                    }
                    catch (error) {
                        throw error;
                    }
                }
                try {
                    const updatedProduct = await Product_1.default.findByIdAndUpdate(id, {
                        title, slug, description, colors, sizes, price, category, quantity, sku, stockStatus, featured, imgs: toUpdateImgs
                    }, { new: true });
                    return updatedProduct;
                }
                catch (error) {
                    if (error)
                        throw error;
                }
            }
            catch (error) {
                if (error) {
                    console.log(error);
                    throw error;
                }
            }
        },
        // Delete Product Mutation
        deleteProduct: async (parent, args, context) => {
            if (!context.token) {
                throw new Error('Not Authenticated');
            }
            const admin = (0, verifyUser_1.default)(context.token);
            if (!admin) {
                throw new Error('Not Authenticated');
            }
            const { id } = args;
            try {
                const product = await Product_1.default.findById(id);
                if (product) {
                    const imgstoDelete = product?.imgs.map(img => img.fileName);
                    imgstoDelete.map(img => (0, deleteImage_1.default)(img));
                    const productExists = await Product_1.default.findByIdAndDelete(id);
                    if (productExists) {
                        return {
                            success: true,
                        };
                    }
                }
                throw new Error('Bad Request');
            }
            catch (error) {
                if (error instanceof Error) {
                    throw error;
                }
            }
        }
    }
};
exports.default = productResolver;
