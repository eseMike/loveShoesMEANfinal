

import Category from '../models/category.js';

export default {
  async register(req, res) {
    try {
      const { name, description } = req.body;
      const category = new Category({ name, description });
      const savedCategory = await category.save();
      res.status(200).json(savedCategory);
    } catch (error) {
      console.log('Error en register categoría:', error);
      res.status(500).send({ message: 'Ocurrió un error en el registro de categoría' });
    }
  },

  async list(req, res) {
    try {
      let query = req.query.value;
      let categories = await Category.find({
        $or: [
          { name: new RegExp(query, 'i') },
          { description: new RegExp(query, 'i') }
        ]
      })
        .sort({ createdAt: -1 });
      res.status(200).json(categories);
    } catch (error) {
      console.log('Error en list categorías:', error);
      res.status(500).send({ message: 'Ocurrió un error al listar categorías' });
    }
  },

    // Obtener 1 categoría por _id: GET /api/categories/query?_id=...
  async query(req, res) {
    try {
      const { _id, id } = req.query;         // acepta _id o id por compatibilidad
      const uid = _id || id;
      if (!uid) return res.status(400).json({ message: 'Falta _id' });

      const cat = await Category.findById(uid);
      if (!cat) return res.status(404).json({ message: 'Categoría no encontrada' });

      return res.status(200).json(cat);
    } catch (error) {
      console.log('Error en query categoría:', error);
      return res.status(500).json({ message: 'Ocurrió un error al obtener la categoría' });
    }
  },

  async update(req, res) {
    try {
      const { _id, name, description } = req.body;
      const updated = await Category.findByIdAndUpdate(
        { _id },
        { name, description },
        { new: true }
      );
      res.status(200).json(updated);
    } catch (error) {
      console.log('Error en update categoría:', error);
      res.status(500).send({ message: 'Ocurrió un error al actualizar categoría' });
    }
  },

 // Eliminar una categoría: DELETE /api/categories/:id
async remove(req, res) {
  try {
    const { id } = req.params;                 // ← tomamos el id desde la ruta
    const removed = await Category.findByIdAndDelete(id); // ← eliminamos por id directo

    if (!removed) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    return res.status(200).json({ message: 'Categoría eliminada correctamente', _id: id });
  } catch (error) {
    console.log('Error en remove categoría:', error);
    return res.status(500).json({ message: 'Ocurrió un error al eliminar categoría' });
  }
},

  async activate(req, res) {
    try {
      const { _id } = req.body;
      const activated = await Category.findByIdAndUpdate(
        { _id },
        { state: 1 },
        { new: true }
      );
      res.status(200).json(activated);
    } catch (error) {
      console.log('Error en activate categoría:', error);
      res.status(500).send({ message: 'Ocurrió un error al activar categoría' });
    }
  },

  async deactivate(req, res) {
    try {
      const { _id } = req.body;
      const deactivated = await Category.findByIdAndUpdate(
        { _id },
        { state: 0 },
        { new: true }
      );
      res.status(200).json(deactivated);
    } catch (error) {
      console.log('Error en deactivate categoría:', error);
      res.status(500).send({ message: 'Ocurrió un error al desactivar categoría' });
    }
  }

  
};