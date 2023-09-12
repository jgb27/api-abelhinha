import bcrypt from 'bcrypt';

export const makeHashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
  }
}

export const verifyPassword = async function (password, user_password) {
  try {
    return await bcrypt.compare(password, user_password);
  } catch (error) {
    throw error;
  }
};
