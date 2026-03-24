const express = require('express');
const multer = require('multer');
const path = require('path');

// Ścieżka tymczasowa – multer najpierw zapisuje pliki tu
const upload = multer({ dest: path.join(__dirname, '..', 'temp') });

const authenticateToken = require('../middleware/auth');

module.exports = (User) => {
    const router = express.Router();
    const userController = require('../controllers/userController')(User);

    // rejestracja z przesyłaniem awatara
    router.post('/register', upload.single('avatar'), userController.register);

    router.post('/login', userController.login);

    router.put('/user/update', authenticateToken, (req, res, next) => {
        console.log('PUT /user/update received');
        next();
    }, upload.single('avatar'), userController.updateProfile);
    router.post('/user/change-password', authenticateToken, userController.changePassword);

    router.get('/user', authenticateToken, async (req, res) => {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).send('User not found');

        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar
        });
    });

    return router;
};
