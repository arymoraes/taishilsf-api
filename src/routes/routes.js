const express = require('express');
const authMiddleware = require('../middleware/auth');
const UserAuthController = require('../controllers/AuthController');
const EmailController = require('../controllers/EmailController');

const router = express.Router();

router.get('/', (req, res) => res.status(200).send({
    wenked: 'da uma mamada',
}));
  
// // Login and Signup
router.post('/user/register', UserAuthController.register);
router.post('/user/login', UserAuthController.login);
router.get('/user/me', authMiddleware, UserAuthController.me);
// // router.post('/forgotPassword', ProviderControllers.forgotPassword);
// // router.post('/resetPassword', ProviderControllers.resetPassword);
// // router.get('/verify/:token', ProviderControllers.verify);

router.post('/sendMail', EmailController.sendMail);

// // readd middleware
// router.get('/admin/games/', GameController.getGames);
// router.get('/admin/categories/', CategoryController.getCategories);
// router.post('/admin/games/add', GameController.addGame);

// router.post('/admin/categories/add', CategoryController.addCategory);
  
module.exports = router;