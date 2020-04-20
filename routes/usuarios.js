const express = require('express'); 
const router = express.Router();

// Controller
const UsuarioController = require('../controllers/usuarios-controller');

router.post('/cadastro', UsuarioController.cadastrarUsuario);

router.post('/login', UsuarioController.loginUser);

module.exports = router;

