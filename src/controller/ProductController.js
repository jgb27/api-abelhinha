import { Client } from '../../database.js';

export const getAllProducts = async (req, res) => {
  try {
    const query = 'SELECT * FROM products;';
    const { rows } = await Client.query(query)
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
export const addNewProduct = async (req, res) => {
  try {
    const { name, price, tags, url, description } = req.body;
    const imageUrl = req.file ? req.file.location : null;

    const checkDuplicateQuery = 'SELECT * FROM products WHERE name = $1 OR url = $2;';
    const { rows: existingProducts } = await Client.query(checkDuplicateQuery, [name, url]);

    if (existingProducts.length > 0) {
      return res.status(400).json({ message: 'Já existe um produto com este título ou URL' });
    }

    const insertQuery = 'INSERT INTO products (name, price, tags, url, description, imageUrl, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;';
    const values = [name, price, tags.split(','), url, description, imageUrl, req.user.userId];
    const { rows: newProduct } = await Client.query(insertQuery, values);

    return res.status(201).json({ message: 'Produto registrado com sucesso', product: newProduct[0] });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

export const findProductByName = async (req, res) => {
  const { name } = req.params;
  const query = 'SELECT * FROM products WHERE LOWER(name) LIKE $1;';
  const { rows } = await Client.query(query, [`%${name.toLowerCase()}%`]);
  return res.status(200).json({ product: rows });
}

export const findProductByTag = async (req, res) => {
  const { tag } = req.params;
  const query = 'SELECT * FROM products WHERE LOWER(tags) LIKE $1;';
  const { rows } = await Client.query(query, [`%${tag.toLowerCase()}%`]);
  return res.status(200).json({ product: rows });
}

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM products WHERE id = $1 RETURNING *;';
    const { rows: deletedProduct } = await Client.query(query, [id]);

    if (deletedProduct.length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    return res.status(200).json({ message: 'Produto excluído com sucesso' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
