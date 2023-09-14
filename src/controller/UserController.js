import { Client } from "../../database.js";
import { makeHashPassword } from "../utils/AccessUtils.js"

export const createUser = async (req, res) => {
  try {
    const { name, username, password, email, fone, role } = req.body;

    const insertQuery = 'INSERT INTO users (name, username, password, email, fone, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;';
    const hashPassword = await makeHashPassword(password)
    const values = [name, username, hashPassword, email, fone, role];

    const { rows: newUser } = await Client.query(insertQuery, values);

    return res.status(201).json({ message: 'Usuário criado com sucesso', user: newUser[0] });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

export const getAllUser = async (req, res) => {
  try {
    const getQuery = 'SELECT name, username, email, fone, role FROM users;';
    const { rows: users } = await Client.query(getQuery);
    return res.status(200).json({ users })
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
