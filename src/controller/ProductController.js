import Product from '../models/Product.js';

export const GetAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

export const AddNewProduct = async (req, res) => {
  try {
    const { name, price, tags, url: link, description } = req.body;
    const { location: url } = req.file;

    const existingProduct = await Product.findOne({ $or: [{ name }, { url }] });

    if (existingProduct) {
      return res.status(400).json({ message: 'Já existe um produto com este título ou URL' });
    }

    const product = new Product({
      name,
      price,
      tags: tags.split(','),
      url: link,
      description,
      imageUrl: url,
    });

    await product.save();

    return res.status(201).json({ message: 'Produto registrado com sucesso', product });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

export const FindProductByName = async (req, res) => {
  const { name, tag } = req.params;
  const product = await Product.find({ name: { $regex: name, $options: 'i' } })
  return res.status(200).json({ product })
}

export const FindProductByTag = async (req, res) => {
  const { tag } = req.params;
  const product = await Product.find({ tags: { $regex: tag, $options: 'i' } })
  return res.status(200).json({ product })
}

export const DeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    return res.status(200).json({ message: 'Produto excluído com sucesso' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
