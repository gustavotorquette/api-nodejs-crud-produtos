const express = require('express'); 
const router = express.Router();

// Controllers
const PedidosController = require('../controllers/pedidos-controller'); 


// RETORNA TODOS OS PEDIDOS
router.get('/', PedidosController.getPedidos);

// INSERE UM PEDIDOS
router.post('/', PedidosController.postPedidos);

// RETORNA OS DADOS DE UM PEDIDOS
router.get('/:id_pedido', PedidosController.getUmPedido);

// EXCLUI UM PEDIDOS
router.delete('/', PedidosController.deletePedido);


module.exports = router;