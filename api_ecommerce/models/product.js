

import mongoose, { Schema } from 'mongoose';

const ProductSchema = new Schema(
  {
    name: { type: String, maxlength: 250, required: true, trim: true },
    description: { type: String, maxlength: 2000, required: false, trim: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    category: { type: Schema.ObjectId, ref: 'Category', required: true },
    images: [{ type: String, trim: true }],
    state: { type: Number, default: 1 }, // 1: Active, 0: Inactive
  },
  { timestamps: true }
);

const Product = mongoose.model('product', ProductSchema);
export default Product;