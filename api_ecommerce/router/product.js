

import express from 'express';
import productController from '../controllers/ProductController.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const { verifyEcommerce, verifyAdmin } = auth;
const router = express.Router();

// Crear producto
router.post('/register', verifyAdmin, productController.register);

// Listar productos (opcional ?value= para filtrar)
router.get('/list', verifyEcommerce, productController.list);

// Actualizar producto
router.put('/update', verifyAdmin, productController.update);

// Eliminar producto (borrado físico)
router.delete('/remove/:id', verifyAdmin, productController.remove);

// Activar / Desactivar producto
router.put('/activate', verifyAdmin, productController.activate);
router.put('/deactivate', verifyAdmin, productController.deactivate);

// Galería de imágenes
router.post('/gallery/add/:id', verifyAdmin, upload.single('image'), productController.addImage);
router.delete('/gallery/remove/:id', verifyAdmin, productController.removeImage);

export default router;