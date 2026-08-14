const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const uri = process.env.MONGODB_URI;

console.log('----------------------------------------------------');
console.log('Testing MongoDB Atlas Connection...');
console.log('URI Host:', uri ? uri.split('@')[1]?.split('/')[0] : 'None');
console.log('Database Name:', uri ? uri.split('.net/')[1]?.split('?')[0] : 'None');
console.log('----------------------------------------------------');

async function testConnection() {
  try {
    const startTime = Date.now();
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });

    const elapsed = Date.now() - startTime;
    console.log(`✅ SUCCESS: Connected to MongoDB Atlas in ${elapsed}ms!`);
    console.log(`Database state: readyState = ${mongoose.connection.readyState} (1 = Connected)`);

    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Existing collections:', collections.map(c => c.name));

    // Seed default categories if empty
    const CategorySchema = new mongoose.Schema({
      name: { type: String, required: true },
      slug: { type: String, required: true, unique: true },
      description: String,
      image: String,
    }, { timestamps: true });

    const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
    const categoryCount = await Category.countDocuments();
    console.log(`Current Categories Count: ${categoryCount}`);

    if (categoryCount === 0) {
      console.log('Seeding initial beauty categories...');
      await Category.insertMany([
        { name: 'Skin Care', slug: 'skin-care', description: 'Face serums, moisturizers & sunscreens' },
        { name: 'Hair Care', slug: 'hair-care', description: 'Spa oils, shampoos & deep repair masks' },
        { name: 'Hair Styling & Tools', slug: 'hair-styling', description: 'Blow dryers, straighteners & curlers' },
        { name: 'Face Care & Serums', slug: 'face-care', description: 'Hydrating sheet masks & anti-aging serums' },
        { name: 'Professional Salon Supplies', slug: 'salon-supplies', description: 'Salon-grade bulk supplies & tools' },
      ]);
      console.log('✅ Seeded 5 beauty categories successfully!');
    }

    // Check products
    const ProductSchema = new mongoose.Schema({
      title: { type: String, required: true },
      slug: { type: String, required: true, unique: true },
      brand: { type: String, required: true },
      price: { type: Number, required: true },
      discountPrice: Number,
      stock: { type: Number, required: true },
      rating: { type: Number, default: 4.8 },
      reviewCount: { type: Number, default: 50 },
      description: { type: String, required: true },
      images: [String],
      category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
      approvalStatus: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'APPROVED' },
      isPublished: { type: Boolean, default: true },
      isBestSeller: { type: Boolean, default: false },
    }, { timestamps: true });

    const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
    const productCount = await Product.countDocuments();
    console.log(`Current Products Count: ${productCount}`);

    if (productCount === 0) {
      const skinCat = await Category.findOne({ slug: 'skin-care' });
      const hairCat = await Category.findOne({ slug: 'hair-care' });
      const stylingCat = await Category.findOne({ slug: 'hair-styling' });

      console.log('Seeding initial approved beauty products into Atlas DB...');
      await Product.insertMany([
        {
          title: 'Vitamin C Face Serum with Hyaluronic Acid (30ml)',
          slug: 'vitamin-c-face-serum-30ml',
          brand: 'GlowSkin Pro',
          price: 799,
          discountPrice: 499,
          stock: 50,
          rating: 4.8,
          reviewCount: 142,
          description: 'Dermatologically tested Vitamin C face serum for dark spots, collagen boost, and radiant glowing skin.',
          images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80'],
          category: skinCat?._id,
          approvalStatus: 'APPROVED',
          isPublished: true,
          isBestSeller: true,
        },
        {
          title: 'Organic Herbal Hair Spa Oil with Bhringraj & Amla (200ml)',
          slug: 'organic-herbal-hair-spa-oil-200ml',
          brand: 'NatureRoots Organic',
          price: 699,
          discountPrice: 499,
          stock: 45,
          rating: 4.9,
          reviewCount: 98,
          description: '100% cold-pressed herbal hair spa therapy oil formulated with organic Bhringraj and Amla for hair repair.',
          images: ['https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=80'],
          category: hairCat?._id,
          approvalStatus: 'APPROVED',
          isPublished: true,
          isBestSeller: true,
        },
        {
          title: 'Professional Ionic Hair Dryer 2200W',
          slug: 'professional-ionic-hair-dryer-2200w',
          brand: 'SalonPro Tools',
          price: 2499,
          discountPrice: 1899,
          stock: 20,
          rating: 4.7,
          reviewCount: 64,
          description: 'Heavy-duty salon blow dryer with 3 heat settings and cool shot button for salon styling.',
          images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80'],
          category: stylingCat?._id,
          approvalStatus: 'APPROVED',
          isPublished: true,
          isBestSeller: false,
        },
      ]);
      console.log('✅ Seeded 3 approved beauty products into Atlas MongoDB!');
    }

    console.log('----------------------------------------------------');
    console.log('🎉 MongoDB Atlas Database is 100% OPERATIONAL & READY!');
    console.log('----------------------------------------------------');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection Failed:', error.message);
    process.exit(1);
  }
}

testConnection();
