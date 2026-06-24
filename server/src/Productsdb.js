const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    console.log(process.env.MONGO_URI);

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("========== FULL ERROR ==========");
    console.error(error);
    console.error("================================");
    process.exit(1);
  }
};

const reviewSchema = new mongoose.Schema({
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  date: { type: Date, required: true },
  reviewerName: { type: String, required: true },
  reviewerEmail: { type: String, required: true },
});

const dimensionsSchema = new mongoose.Schema({
  width: Number,
  height: Number,
  depth: Number,
});

const metaSchema = new mongoose.Schema({
  createdAt: Date,
  updatedAt: Date,
  barcode: String,
  qrCode: String,
});

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  discountPercentage: { type: Number, default: 0 },
  rating: { type: Number, min: 0, max: 5 },
  stock: { type: Number, required: true },
  tags: [String],
  brand: { type: String },
  sku: { type: String, unique: true },
  weight: Number,
  dimensions: dimensionsSchema,
  warrantyInformation: String,
  shippingInformation: String,
  availabilityStatus: {
    type: String,
    enum: ["In Stock", "Out of Stock", "Low Stock"],
  },
  reviews: [reviewSchema],
  returnPolicy: String,
  minimumOrderQuantity: Number,
  meta: metaSchema,
  images: [String],
  thumbnail: String,
});

// Prevent overwrite error during hot reload
const Product =
  mongoose.models.Product ||
  mongoose.model("Product", productSchema, "productCollection");

module.exports = { Product, connectDB };