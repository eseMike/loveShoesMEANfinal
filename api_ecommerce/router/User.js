import routerx from 'express-promise-router';
import usercontroller from '../controllers/UserController.js';
import auth from '../middleware/auth.js';

const router = routerx();



router.post('/register', usercontroller.register);
router.put('/update', usercontroller.update);
// router.post('/register_admin', auth.verifyAdmin, usercontroller.register_admin);
// router.post('/register_admin', auth.verifyAdmin, usercontroller.register_admin); 
router.post('/register_admin', usercontroller.register_admin);

// router.get('/list', auth.verifyAdmin, usercontroller.list);
router.get('/list', auth.verifyAdmin, usercontroller.list);
// router.post('/register_admin', usercontroller.register_admin);
router.post('/login', usercontroller.login);
router.post('/login_admin', usercontroller.login_admin);

router.delete('/delete', usercontroller.remove);

export default router;
