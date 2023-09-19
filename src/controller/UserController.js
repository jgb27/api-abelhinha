import { Client } from "../../database.js";
import { makeHashPassword } from "../utils/AccessUtils.js"

export const createUser = async (req, res) => {
  try {
    const { name, username, password, email, fone, role: oldRole } = req.body;

    let role;

    if (!oldRole) {
      role = 'cliente'
    } else {
      role = oldRole
    }

    const insertQuery = 'INSERT INTO users (name, username, password, email, fone, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;';
    const hashPassword = await makeHashPassword(password)
    const values = [name, username, hashPassword, email, fone, role];

    const { rows: newUser } = await Client.query(insertQuery, values);

    return res.status(201).json({ message: 'Usuário criado com sucesso', user: newUser[0] });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

export const updatedUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, username, password, email, fone, role: oldRole } = req.body;

    const findUserQuery = 'SELECT * FROM users WHERE _id = $1;';
    const { rows: existingUser } = await Client.query(findUserQuery, [userId]);

    if (!existingUser || existingUser.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const updatedFields = {};
    if (name !== undefined) updatedFields.name = name;
    if (username !== undefined) updatedFields.username = username;
    if (password !== undefined) updatedFields.password = await makeHashPassword(password);
    if (email !== undefined) updatedFields.email = email;
    if (fone !== undefined) updatedFields.fone = fone;
    if (oldRole !== undefined) updatedFields.role = oldRole;

    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ message: 'Nenhum campo para atualizar' });
    }

    const updateQuery = 'UPDATE users SET ' +
      Object.keys(updatedFields).map((field, index) => `${field} = $${index + 1}`).join(', ') +
      ` WHERE _id = $${Object.keys(updatedFields).length + 1} RETURNING *;`;

    const updateValues = Object.values(updatedFields);
    updateValues.push(userId);

    const { rows: updatedUser } = await Client.query(updateQuery, updateValues);

    return res.status(200).json({ message: 'Usuário atualizado com sucesso', user: updatedUser[0] });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getAllUser = async (_req, res) => {
  try {
    const getQuery = 'SELECT _id, name, username, email, fone, role FROM users;';
    const { rows: users } = await Client.query(getQuery);
    return res.status(200).json(users)
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

export const getUser = async (req, res) => {
  try {
    const getQuery = 'SELECT name, username, email, fone, role FROM users WHERE _id = $1;';
    const { rows: user } = await Client.query(getQuery, [req.user.userId]);
    return res.status(200).json({ user: user[0] })
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

export const getProductByUser = async (req, res) => {
  try {
    const query = 'SELECT * FROM products p JOIN user_product up ON (p._id=up.product_id) WHERE up.user_id=$1;'
    const { rows: products } = await Client.query(query, [req.user.userId]);
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM users WHERE _id = $1 RETURNING *;';
    const { rows: deletedUser } = await Client.query(query, [id]);

    if (deletedUser.length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    return res.status(200).json({ message: 'Produto excluído com sucesso' });
  } catch (error) {

  }
}
