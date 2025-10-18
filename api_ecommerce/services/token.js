import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export default {
  encode: async (_id, rol, email) => {
    const token = jwt.sign(
      { _id, rol, email },
      'ecommerce_loveshoes',
      { expiresIn: '1d' }
    );
    return token;
  },

  decode: async (token) => {
    try {
      const { _id } = await jwt.verify(token, 'ecommerce_loveshoes');
      const user = await User.findOne({ _id, state: 1 });
      if (user) {
        return user;
      }
      return false;
    } catch (error) {
      console.log('Error en decode token:', error);
      return false;
    }
  }
};