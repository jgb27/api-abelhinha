import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  tags: [String],
  url: String,
  description: String,
  imageUrl: String,
});

const Product = mongoose.model('Product', productSchema);

export default Product;
