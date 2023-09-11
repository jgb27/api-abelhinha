import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const verifyPassword = async function (password, truePassword) {
  try {
    return await bcrypt.compare(password, truePassword);
  } catch (error) {
    throw error;
  }
};

export const Login = async (req, res) => {
  try {
    const { name, password } = req.body;

    const user = await User.findOne({ name });

    if (!user) {
      return res.status(401).json({ message: 'Login inválido' });
    }

    const senha = await verifyPassword(password, user.password)

    if (!senha) {
      return res.status(401).json({ message: 'Senha inválida' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.MY_AWS_SECRET_ACCESS_KEY, {
      expiresIn: '12h',
    });

    return res.status(200).json({ message: 'Login bem-sucedido', token });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

export const Authenticate = (req, res, next) => {

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
