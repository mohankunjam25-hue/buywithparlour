"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const product_model_1 = require("./product.model");
const category_model_1 = require("../categories/category.model");
const product_registry_1 = require("./product.registry");
const mongoose_1 = __importDefault(require("mongoose"));
class ProductService {
    /**
     * Public customer marketplace catalog with dynamic multi-faceted filtering
     */
    static async getProducts(query) {
        const page = Math.max(1, Number(query.page) || 1);
        const limit = Math.min(50, Math.max(1, Number(query.limit) || 24));
        const skip = (page - 1) * limit;
        // Strict Marketplace Guard: ONLY APPROVED & PUBLISHED products are visible to customers
        const filter = {
            approvalStatus: 'APPROVED',
            isPublished: true,
        };
        // 1. Dynamic Category Resolution (Supports both slug and ObjectId)
        if (query.category) {
            if (mongoose_1.default.Types.ObjectId.isValid(query.category)) {
                filter.category = new mongoose_1.default.Types.ObjectId(query.category);
            }
            else {
                // Resolve slug to ObjectId
                try {
                    const cat = await category_model_1.CategoryModel.findOne({ slug: query.category.toLowerCase().trim() });
                    if (cat) {
                        filter.category = cat._id;
                    }
                }
                catch {
                    // Ignore
                }
            }
        }
        // 2. Dynamic Brand Filter (Supports single brand or comma-separated brands)
        if (query.brand) {
            const brandList = query.brand.split(',').map((b) => b.trim()).filter(Boolean);
            if (brandList.length === 1) {
                filter.brand = new RegExp(`^${brandList[0]}$`, 'i');
            }
            else if (brandList.length > 1) {
                filter.brand = { $in: brandList.map((b) => new RegExp(`^${b}$`, 'i')) };
            }
        }
        // 3. Dynamic Price Range Filter
        if (query.minPrice !== undefined || query.maxPrice !== undefined) {
            filter.price = {};
            if (query.minPrice !== undefined && !isNaN(Number(query.minPrice))) {
                filter.price.$gte = Number(query.minPrice);
            }
            if (query.maxPrice !== undefined && !isNaN(Number(query.maxPrice))) {
                filter.price.$lte = Number(query.maxPrice);
            }
        }
        // 4. In Stock Filter
        if (query.inStock === true || query.inStock === 'true') {
            filter.stock = { $gt: 0 };
        }
        // 5. Customer Rating Filter
        if (query.minRating !== undefined && !isNaN(Number(query.minRating))) {
            filter.rating = { $gte: Number(query.minRating) };
        }
        // 6. Fast Multi-Field Search (Matches title, brand, description, tags)
        if (query.search && query.search.trim()) {
            const searchRegex = new RegExp(query.search.trim(), 'i');
            filter.$or = [
                { title: searchRegex },
                { brand: searchRegex },
                { description: searchRegex },
                { highlights: searchRegex },
                { 'category.name': searchRegex },
            ];
        }
        // 7. Dynamic Sorting Options
        let sortOption = { createdAt: -1 };
        if (query.sort === 'price_asc')
            sortOption = { price: 1 };
        if (query.sort === 'price_desc')
            sortOption = { price: -1 };
        if (query.sort === 'rating')
            sortOption = { rating: -1, totalReviews: -1 };
        if (query.sort === 'popular')
            sortOption = { totalReviews: -1, rating: -1 };
        if (query.sort === 'discount')
            sortOption = { discountPrice: 1 };
        // DB Live Execution
        if (mongoose_1.default.connection.readyState === 1) {
            const [products, total] = await Promise.all([
                product_model_1.ProductModel.find(filter)
                    .populate('category', 'name slug')
                    .sort(sortOption)
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                product_model_1.ProductModel.countDocuments(filter),
            ]);
            if (products.length > 0 || Object.keys(filter).length > 2) {
                return {
                    products: products,
                    total,
                    page,
                    totalPages: Math.ceil(total / limit) || 1,
                };
            }
        }
        // Dynamic Synchronized Fallback (Fetches live approved products from registry)
        const liveItems = await product_registry_1.ProductRegistry.getLiveProducts();
        let filtered = [...liveItems];
        if (query.category) {
            filtered = filtered.filter((p) => p.category?.slug === query.category ||
                p.category?._id === query.category ||
                (typeof p.category === 'string' && p.category === query.category));
        }
        if (query.brand) {
            filtered = filtered.filter((p) => query.brand.toLowerCase().split(',').includes(p.brand.toLowerCase()));
        }
        if (query.minPrice !== undefined) {
            filtered = filtered.filter((p) => (p.discountPrice || p.price) >= Number(query.minPrice));
        }
        if (query.maxPrice !== undefined) {
            filtered = filtered.filter((p) => (p.discountPrice || p.price) <= Number(query.maxPrice));
        }
        if (query.inStock) {
            filtered = filtered.filter((p) => p.stock > 0);
        }
        if (query.search) {
            const q = query.search.toLowerCase();
            filtered = filtered.filter((p) => p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
        }
        return {
            products: filtered,
            total: filtered.length,
            page: 1,
            totalPages: 1,
        };
    }
    /**
     * Dynamic Facets (Min/Max Price, Available Brands & Categories from DB without hardcoding)
     */
    static async getFacets() {
        if (mongoose_1.default.connection.readyState === 1) {
            const stats = await product_model_1.ProductModel.aggregate([
                { $match: { approvalStatus: 'APPROVED', isPublished: true } },
                {
                    $group: {
                        _id: null,
                        minPrice: { $min: '$price' },
                        maxPrice: { $max: '$price' },
                        brands: { $addToSet: '$brand' },
                    },
                },
            ]);
            const brandsList = (stats[0]?.brands || []).filter(Boolean).sort();
            const minPrice = stats[0]?.minPrice || 199;
            const maxPrice = stats[0]?.maxPrice || 4999;
            return {
                minPrice,
                maxPrice,
                brands: brandsList,
            };
        }
        const liveItems = await product_registry_1.ProductRegistry.getLiveProducts();
        const brands = Array.from(new Set(liveItems.map((p) => p.brand))).filter(Boolean).sort();
        const prices = liveItems.map((p) => p.discountPrice || p.price);
        return {
            minPrice: Math.min(...prices, 199),
            maxPrice: Math.max(...prices, 4999),
            brands,
        };
    }
    /**
     * Ultra-Fast Typeahead Search Suggestions (<15ms response)
     */
    static async getSuggestions(keyword) {
        if (!keyword || !keyword.trim()) {
            return { suggestions: [], brands: [], categories: [] };
        }
        const clean = keyword.trim();
        const regex = new RegExp(clean, 'i');
        if (mongoose_1.default.connection.readyState === 1) {
            const [matchingProducts, matchingCategories] = await Promise.all([
                product_model_1.ProductModel.find({
                    approvalStatus: 'APPROVED',
                    isPublished: true,
                    $or: [{ title: regex }, { brand: regex }],
                })
                    .select('title brand slug price images')
                    .limit(6)
                    .lean(),
                category_model_1.CategoryModel.find({ name: regex }).select('name slug').limit(3).lean(),
            ]);
            const titles = matchingProducts.map((p) => ({
                title: p.title,
                brand: p.brand,
                slug: p.slug,
                price: p.price,
            }));
            const uniqueBrands = Array.from(new Set(matchingProducts
                .filter((p) => p.brand && regex.test(p.brand))
                .map((p) => p.brand)));
            return {
                suggestions: titles,
                brands: uniqueBrands,
                categories: matchingCategories,
            };
        }
        const liveItems = await product_registry_1.ProductRegistry.getLiveProducts();
        const q = clean.toLowerCase();
        const matched = liveItems.filter((p) => p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
        return {
            suggestions: matched.slice(0, 6).map((p) => ({
                title: p.title,
                brand: p.brand,
                slug: p.slug,
                price: p.price,
            })),
            brands: Array.from(new Set(matched.map((p) => p.brand))),
            categories: [],
        };
    }
    static async getProductBySlug(slug) {
        if (mongoose_1.default.connection.readyState === 1) {
            const product = await product_model_1.ProductModel.findOne({
                slug,
                approvalStatus: 'APPROVED',
                isPublished: true,
            })
                .populate('category', 'name slug')
                .lean();
            if (product) {
                return product;
            }
        }
        const liveItems = await product_registry_1.ProductRegistry.getLiveProducts();
        const product = liveItems.find((p) => p.slug === slug);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }
    static async createProduct(data) {
        return (await product_registry_1.ProductRegistry.addProduct(data));
    }
    static async updateProduct(id, data) {
        if (mongoose_1.default.connection.readyState === 1) {
            const updated = await product_model_1.ProductModel.findByIdAndUpdate(id, data, { new: true });
            if (updated)
                return updated;
        }
        const liveItems = await product_registry_1.ProductRegistry.getLiveProducts();
        const prod = liveItems.find((p) => p._id === id);
        if (!prod)
            throw new Error('Product not found');
        Object.assign(prod, data);
        return prod;
    }
    static async deleteProduct(id) {
        if (mongoose_1.default.connection.readyState === 1) {
            await product_model_1.ProductModel.findByIdAndDelete(id);
        }
        await product_registry_1.ProductRegistry.deleteProduct(id);
    }
}
exports.ProductService = ProductService;
