import User from '../models/User.js';

export const CreateUser = async (req, res) => {
  try {
    const { name, password } = req.body;

    const existingUser = await User.findOne({ name });

    if (existingUser) {
      return res.status(400).json({ message: 'Já existe um usuário com este email' });
    }

    const newUser = new User({ name, password });

    await newUser.save();

    return res.status(201).json({ message: 'Usuário criado com sucesso', user: newUser });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
