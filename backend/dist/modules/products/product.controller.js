"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const product_service_1 = require("./product.service");
const response_1 = require("../../utils/response");
class ProductController {
    static async getProducts(req, res, next) {
        try {
            const search = req.query.search;
            const category = req.query.category;
            const brand = req.query.brand;
            const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
            const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
            const minRating = req.query.minRating ? Number(req.query.minRating) : undefined;
            const sort = req.query.sort;
            const inStock = req.query.inStock;
            const page = req.query.page ? Number(req.query.page) : 1;
            const limit = req.query.limit ? Number(req.query.limit) : 24;
            const result = await product_service_1.ProductService.getProducts({
                search,
                category,
                brand,
                minPrice,
                maxPrice,
                minRating,
                inStock,
                sort,
                page,
                limit,
            });
            (0, response_1.sendResponse)(res, 200, true, 'Products retrieved', result);
        }
        catch (error) {
            next(error);
        }
    }
    static async getFacets(_req, res, next) {
        try {
            const facets = await product_service_1.ProductService.getFacets();
            (0, response_1.sendResponse)(res, 200, true, 'Dynamic product facets fetched', { facets });
        }
        catch (error) {
            next(error);
        }
    }
    static async getSuggestions(req, res, next) {
        try {
            const q = req.query.q || '';
            const suggestions = await product_service_1.ProductService.getSuggestions(q);
            (0, response_1.sendResponse)(res, 200, true, 'Search suggestions fetched', suggestions);
        }
        catch (error) {
            next(error);
        }
    }
    static async getProductBySlug(req, res, next) {
        try {
            const product = await product_service_1.ProductService.getProductBySlug(req.params.slug);
            (0, response_1.sendResponse)(res, 200, true, 'Product details fetched', { product });
        }
        catch (error) {
            if (error instanceof Error && error.message === 'Product not found') {
                (0, response_1.sendError)(res, 404, error.message);
                return;
            }
            next(error);
        }
    }
    static async createProduct(req, res, next) {
        try {
            const product = await product_service_1.ProductService.createProduct(req.body);
            (0, response_1.sendResponse)(res, 201, true, 'Product created successfully', { product });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateProduct(req, res, next) {
        try {
            const product = await product_service_1.ProductService.updateProduct(req.params.id, req.body);
            (0, response_1.sendResponse)(res, 200, true, 'Product updated successfully', { product });
        }
        catch (error) {
            next(error);
        }
    }
    static async deleteProduct(req, res, next) {
        try {
            await product_service_1.ProductService.deleteProduct(req.params.id);
            (0, response_1.sendResponse)(res, 200, true, 'Product deleted successfully');
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ProductController = ProductController;
