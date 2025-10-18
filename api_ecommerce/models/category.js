// /Users/mikealbarran/Desktop/Desarrollo Mike/loveShoesMEANfinal/api_ecommerce/models/category.js
import mongoose, { Schema, model } from 'mongoose';

const CategorySchema = new Schema(
  {
    name: { type: String, maxlength: 120, required: true, unique: true, trim: true },
    description: { type: String, maxlength: 500, trim: true, default: '' },
    state: { type: Number, default: 1 } // 1: Active, 0: Inactive
  },
  {
    timestamps: true // createdAt / updatedAt automáticos
  }
);

// Evita OverwriteModelError en reinicios / HMR
export default mongoose.models.Category || model('Category', CategorySchema);