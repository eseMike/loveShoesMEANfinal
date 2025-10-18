import routerx from 'express-promise-router';
import User from './User.js';
import Category from './category.js';
import Product from './product.js';

const router = routerx();
router.use('/users', User);
router.use('/categories', Category);
router.use('/products', Product);

router.get('/test', (req, res) => {
  res.json({ ok: true, message: 'API funcionando correctamente 🚀' });
});

export default router;