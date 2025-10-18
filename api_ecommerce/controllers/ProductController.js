


import fs from 'fs';
import path from 'path';
import Product from '../models/product.js';

export default {
  async register(req, res) {
    try {
      const { name, description, price, stock, category } = req.body;
      const product = new Product({ name, description, price, stock, category });
      const savedProduct = await product.save();
      res.status(200).json(savedProduct);
    } catch (error) {
      console.log('Error en register producto:', error);
      res.status(500).send({ message: 'Ocurrió un error en el registro de producto' });
    }
  },

  async list(req, res) {
  try {
    const raw = (req.query.value ?? '').toString().trim();
    const criteria = raw
      ? { $or: [{ name: new RegExp(raw, 'i') }, { description: new RegExp(raw, 'i') }] }
      : {}; // ← sin búsqueda: trae todos

    const products = await Product.find(criteria)
      .populate('category', { name: 1, description: 1 })
      .sort({ createdAt: -1 });

    return res.status(200).json(products);
  } catch (error) {
    console.log('Error en list productos:', error);
    return res.status(500).send({ message: 'Ocurrió un error al listar productos' });
  }
 }, 

  async update(req, res) {
    try {
      const { _id, name, description, price, stock, category } = req.body;
      const updated = await Product.findByIdAndUpdate(
        { _id },
        { name, description, price, stock, category },
        { new: true }
      );
      res.status(200).json(updated);
    } catch (error) {
      console.log('Error en update producto:', error);
      res.status(500).send({ message: 'Ocurrió un error al actualizar producto' });
    }
  },

  async remove(req, res) {
    try {
      const { _id } = req.body;
      const removed = await Product.findByIdAndDelete({ _id });
      res.status(200).json(removed);
    } catch (error) {
      console.log('Error en remove producto:', error);
      res.status(500).send({ message: 'Ocurrió un error al eliminar producto' });
    }
  },

  async activate(req, res) {
    try {
      const { _id } = req.body;
      const activated = await Product.findByIdAndUpdate(
        { _id },
        { state: 1 },
        { new: true }
      );
      res.status(200).json(activated);
    } catch (error) {
      console.log('Error en activate producto:', error);
      res.status(500).send({ message: 'Ocurrió un error al activar producto' });
    }
  },

  async deactivate(req, res) {
    try {
      const { _id } = req.body;
      const deactivated = await Product.findByIdAndUpdate(
        { _id },
        { state: 0 },
        { new: true }
      );
      res.status(200).json(deactivated);
    } catch (error) {
      console.log('Error en deactivate producto:', error);
      res.status(500).send({ message: 'Ocurrió un error al desactivar producto' });
    }
  },

  async addImage(req, res) {
    try {
      const { id } = req.params;
      if (!req.file) {
        return res.status(400).send({ message: 'No se recibió archivo de imagen' });
      }
      const filename = req.file.filename;
      const updated = await Product.findByIdAndUpdate(
        { _id: id },
        { $push: { images: filename } },
        { new: true }
      ).populate('category', { name: 1, description: 1 });

      res.status(200).json(updated);
    } catch (error) {
      console.log('Error en addImage producto:', error);
      res.status(500).send({ message: 'Ocurrió un error al agregar imagen' });
    }
  },

  async removeImage(req, res) {
    try {
      const { id } = req.params;
      const { image } = req.body;
      if (!image) {
        return res.status(400).send({ message: 'Falta el nombre de la imagen a eliminar' });
      }

      const updated = await Product.findByIdAndUpdate(
        { _id: id },
        { $pull: { images: image } },
        { new: true }
      ).populate('category', { name: 1, description: 1 });

      const imgPath = path.join(process.cwd(), 'upload', 'products', image);
      if (fs.existsSync(imgPath)) {
        try { fs.unlinkSync(imgPath); } catch (e) { console.log('No se pudo borrar archivo:', e?.message); }
      }

      res.status(200).json(updated);
    } catch (error) {
      console.log('Error en removeImage producto:', error);
      res.status(500).send({ message: 'Ocurrió un error al remover imagen' });
    }
  }
};