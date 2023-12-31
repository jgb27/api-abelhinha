import jwt from 'jsonwebtoken';
import { Client } from '../../database.js';
import { verifyPassword } from '../utils/AccessUtils.js'

export const Login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = $1;';
    const { rows } = await Client.query(query, [username]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Login inválido', label: 'username' });
    }

    const user = rows[0];
    const senhaValida = await verifyPassword(password, user.password);

    if (!senhaValida) {
      return res.status(401).json({ message: 'Senha inválida', label: 'password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.MY_AWS_SECRET_ACCESS_KEY, {
      expiresIn: '12h',
    });

    return res.status(200).json({ message: 'Login bem-sucedido', token, role: user.role });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

export const AuthenticateCommonUser = async (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Token de autenticação não fornecido' });
  }

  jwt.verify(token, process.env.MY_AWS_SECRET_ACCESS_KEY, (error, decodedToken) => {
    if (error) {
      return res.status(401).json({ message: 'Token de autenticação inválido' });
    }

    req.user = decodedToken;
    next();
  });
}

export const Authenticate = async (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Token de autenticação não fornecido' });
  }

  jwt.verify(token, process.env.MY_AWS_SECRET_ACCESS_KEY, (error, decodedToken) => {
    if (error) {
      return res.status(401).json({ message: 'Token de autenticação inválido' });
    }

    req.user = decodedToken;
  });


  const query = 'SELECT role FROM users WHERE _id = $1;';
  const { rows: user } = await Client.query(query, [req.user.userId]);

  if (user[0].role != 'admin') return res.status(401).json({ message: 'Você não tem autorização' })

  next();
}
