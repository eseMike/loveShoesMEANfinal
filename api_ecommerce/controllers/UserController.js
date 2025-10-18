import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import token from '../services/token.js';

export default {
  register: async (req, res) => {
    try {
      const body = { ...req.body };

      // ✅ Usar siempre `role` (no `rol`)
      if (body.rol && !body.role) {
        body.role = body.rol;
        delete body.rol;
      }
      if (!body.role) body.role = 'client';
      body.role = String(body.role).toLowerCase() === 'admin' ? 'admin' : 'client';

      // Hash de contraseña
      body.password = await bcrypt.hash(body.password, 10);

      // Crear usuario
      const user = await User.create(body);

      // Respuesta sin password
      res.status(201).json({
        _id: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        createdAt: user.createdAt
      });
    } catch (error) {
      if (error && error.code === 11000) {
        return res.status(409).json({ message: 'El correo ya está registrado' });
      }
      console.log('Error en register:', error);
      res.status(500).send({ message: 'Ocurrió un error al registrar usuario' });
    }
  },

  register_admin: async (req, res) => {
    try {
      req.body.role = 'admin';
      req.body.password = await bcrypt.hash(req.body.password, 10);
      const user = await User.create(req.body);
      res.status(200).json(user);
    } catch (error) {
      console.log('Error en register_admin:', error);
      res.status(500).send({ message: 'Ocurrió un error al registrar el admin' });
    }
  },

  login: async (req, res) => {
    try {
      const user = await User.findOne({
        email: req.body.email,
        state: 1
      });
      if (user) {
        const compare = await bcrypt.compare(req.body.password, user.password);
        if (compare) {
          const tokenT = await token.encode(user._id, user.role, user.email);

          const USER_FRONTEND = {
            token: tokenT,
            user: {
              name: user.name,
              email: user.email,
              lastname: user.lastname,
              avatar: user.avatar
            }
          };

          res.status(200).json(USER_FRONTEND);
        } else {
          res.status(401).send({ message: 'Contraseña incorrecta' });
        }
      } else {
        res.status(404).send({ message: 'El usuario no existe' });
      }
    } catch (error) {
      console.log('Error en login:', error);
      res.status(500).send({ message: 'Ocurrió un error en login' });
    }
  },

  login_admin: async (req, res) => {
    try {
      const user = await User.findOne({
        email: req.body.email,
        state: 1,
        role: { $regex: /^admin$/i }
      });

      if (user) {
        const compare = await bcrypt.compare(req.body.password, user.password);
        if (compare) {
          const tokenT = await token.encode(user._id, user.role, user.email);

          const USER_FRONTEND = {
            token: tokenT,
            user: {
              name: user.name,
              email: user.email,
              lastname: user.lastname,
              avatar: user.avatar,
              role: user.role
            }
          };

          res.status(200).json(USER_FRONTEND);
        } else {
          res.status(401).send({ message: 'Contraseña incorrecta' });
        }
      } else {
        res.status(404).send({ message: 'El usuario admin no existe' });
      }
    } catch (error) {
      console.log('Error en login_admin:', error);
      res.status(500).send({ message: 'Ocurrió un error en login_admin' });
    }
  },

  update: async (req, res) => {
    try {
      let avatar_name = null;
      if (req.files && req.files.avatar) {
        const img_path = req.files.avatar.path;
        const name = img_path.split('\\');
        avatar_name = name[2];
      }

      if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
      }

      await User.findByIdAndUpdate({ _id: req.body._id }, req.body);
      const UserT = await User.findOne({ _id: req.body._id });

      res.status(200).json({
        message: 'El usuario se actualizó correctamente',
        user: {
          _id: UserT._id,
          name: UserT.name,
          lastname: UserT.lastname,
          email: UserT.email,
          avatar: avatar_name || UserT.avatar,
          role: UserT.role
        }
      });
    } catch (error) {
      console.log('Error en update:', error);
      res.status(500).send({ message: 'Ocurrió un error al actualizar usuario' });
    }
  },

  list: async (req, res) => {
    try {
      const users = await User.find().sort({ createdAt: -1 });

      const formattedUsers = users.map((user) => ({
        _id: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        createdAt: user.createdAt
      }));

      res.status(200).json({ users: formattedUsers });
    } catch (error) {
      console.log('Error en list:', error);
      res.status(500).send({ message: 'Ocurrió un error al listar usuarios' });
    }
  },

  remove: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete({ _id: req.body._id });
      res.status(200).json({
        message: 'El usuario se eliminó correctamente',
        user
      });
    } catch (error) {
      console.log('Error en remove:', error);
      res.status(500).send({ message: 'Ocurrió un error al eliminar usuario' });
    }
  }
};