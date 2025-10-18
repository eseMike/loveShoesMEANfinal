import express from 'express';
import categoryController from '../controllers/categoryController.js';
import auth from '../middleware/auth.js';
const { verifyEcommerce, verifyAdmin } = auth;

const router = express.Router();

// Crear categoría
router.post('/register', verifyAdmin, categoryController.register);

// Listar categorías (opcional ?value= para filtrar)
router.get('/list', verifyEcommerce, categoryController.list);

// Obtener 1 categoría por _id (p.ej. /api/categories/query?_id=... )
router.get('/query', verifyEcommerce, categoryController.query);

// Actualizar categoría
router.put('/update', verifyAdmin, categoryController.update);

// Eliminar categoría (borrado físico)
router.delete('/remove/:id', verifyAdmin, categoryController.remove);

// Activar / Desactivar
router.put('/activate', verifyAdmin, categoryController.activate);
router.put('/deactivate', verifyAdmin, categoryController.deactivate);

export default router;
