import { Client } from "../../database.js";
import { makeHashPassword } from "../utils/AccessUtils.js"

export const createUser = async (req, res) => {
  try {
    const { name, password, email } = req.body;

    const checkDuplicateQuery = 'SELECT * FROM users WHERE username = $1;';
    const { rows: existingUsers } = await Client.query(checkDuplicateQuery, [name]);

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Já existe um usuário com este nome' });
    }

    const insertQuery = 'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *;';
    const hashPassword = await makeHashPassword(password)
    const values = [name, hashPassword, email];

    const { rows: newUser } = await Client.query(insertQuery, values);

    return res.status(201).json({ message: 'Usuário criado com sucesso', user: newUser[0] });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

export const findUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'SELECT id, name FROM users WHERE id=$1';
    const values = [id];
    const { rows: user } = await Client.query(query, values)
    const { id: _id, name } = user[0];
    return res.status(200).json({ user: { _id, name } });

  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
