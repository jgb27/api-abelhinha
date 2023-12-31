import { Client } from '../../database.js';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.MY_AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
  }
});

const deletePdf = async (id) => {
  const findId = 'SELECT pdf_url FROM products WHERE _id = $1;';
  const { rows: findKey } = await Client.query(findId, [id]);

  const namePdf = findKey[0].pdf_url.split('/')[5]

  await s3.send(new DeleteObjectCommand({
    Bucket: 'abelhinha-bucket',
    Key: `ebook/${process.env.ENVIRONMENT}/${namePdf}`
  }))
}

const deleteImage = async (id) => {
  const findId = 'SELECT image_url FROM products WHERE _id = $1;';
  const { rows: findKey } = await Client.query(findId, [id]);

  const nameImg = findKey[0].image_url.split('/')[5];

  await s3.send(new DeleteObjectCommand({
    Bucket: 'abelhinha-bucket',
    Key: `image/${process.env.ENVIRONMENT}/${nameImg}`
  }))
}

export const getAllProducts = async (_req, res) => {
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
    const { name, price, tags: tag, description } = req.body;

    const imageUrl = req.files.image ? req.files.image[0].location : null;
    const pdfUrl = req.files.pdf ? req.files.pdf[0].location : null;

    const tags = tag.replace(/\s/g, '').split(',')

    const insertQuery = 'INSERT INTO products (name, price, tags, description, image_url, pdf_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;';
    const values = [name, price, tags, description, imageUrl, pdfUrl];
    const { rows: newProduct } = await Client.query(insertQuery, values);

    return res.status(201).json({ message: 'Produto registrado com sucesso', product: newProduct[0] });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, tags: tag, description } = req.body;

    const imageUrl = req.files.image ? req.files.image[0].location : null;
    const pdfUrl = req.files.pdf ? req.files.pdf[0].location : null;

    const tags = tag.replace(/\s/g, '').split(',')

    const findProductQuery = 'SELECT * FROM products WHERE _id = $1;';
    const { rows: existingProduct } = await Client.query(findProductQuery, [id]);

    if (!existingProduct || existingProduct.length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    const updatedFields = {};
    if (name !== undefined) updatedFields.name = name;
    if (price !== undefined) updatedFields.price = price;
    if (tags !== undefined) updatedFields.tags = tags;
    if (description !== undefined) updatedFields.description = description;
    if (imageUrl !== null) {
      deleteImage(id);
      updatedFields.image_url = imageUrl;
    }
    if (pdfUrl !== null) {
      deletePdf(id);
      updatedFields.pdf_url = pdfUrl;
    }

    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ message: 'Nenhum campo para atualizar' });
    }

    const updateQuery = 'UPDATE products SET ' +
      Object.keys(updatedFields).map((field, index) => `${field} = $${index + 1}`).join(', ') +
      ` WHERE _id = $${Object.keys(updatedFields).length + 1} RETURNING *;`;

    const updateValues = [...Object.values(updatedFields), id];

    const { rows: updatedProduct } = await Client.query(updateQuery, updateValues);

    return res.status(200).json({ message: 'Produto atualizado com sucesso', product: updatedProduct[0] });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const findProductByName = async (req, res) => {
  const { name } = req.params;
  const query = 'SELECT * FROM products WHERE LOWER(name) LIKE $1;';
  const { rows } = await Client.query(query, [`%${name.toLowerCase()}%`]);
  return res.status(200).json({ product: rows });
}

export const findProductByTag = async (req, res) => {
  const { tag } = req.params;
  const query = 'SELECT * FROM products WHERE $1 = ANY(tags);';
  const { rows } = await Client.query(query, [`${tag.toLowerCase()}`]);
  return res.status(200).json({ product: rows });
}

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    deleteImage(id);
    deletePdf(id);

    const selectQuery = 'SELECT * FROM user_product where product_id=$1;'
    const { rows: select } = await Client.query(selectQuery, [id]);

    if (select.length != 0) {
      const deleteQuery = 'DELETE FROM user_product where product_id = $1 RETURNING *;';
      const { rows } = await Client.query(deleteQuery, [id]);

      if (rows.length === 0) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }
    }

    const query = 'DELETE FROM products WHERE _id = $1 RETURNING *;';
    const { rows: deletedProduct } = await Client.query(query, [id]);

    if (deletedProduct.length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    return res.status(200).json({ message: 'Produto excluído com sucesso' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
