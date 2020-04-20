
const mysql = require('../mysql').pool;

// Listar todos os pedidos
exports.getPedidos = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if(error) { return res.status(500).send({ error: error }) }
    conn.query(
      `
      SELECT  pedidos.id_pedidos,
            pedidos.quantidade,
            pedidos.id_produto,
            produtos.nome,
            produtos.preco
      FROM pedidos
      INNER JOIN produtos
        ON produtos.id_produtos = pedidos.id_produto;
      `,
      
      (error, result, field) => {
        if(error) { return res.status(500).send({ error: error }) }
        const response = {
          pedidos: result.map(pedido => {
            return {
              id_pedidos: pedido.id_pedidos,
              quantidade: pedido.quantidade,
              produto: {
                id_produto: pedido.id_produto,
                nome: pedido.nome,
                preco: pedido.preco
              },
              request: {
                tipo: 'GET',
                descricao: 'Retorna os detalhes de um pedido específico',
                url: 'http://localhost:3001/produtos/' + pedido.id_pedido
              } 
            }
          })
        }
        return res.status(201).send(response);
      }
    )
  });
};

// Insere um Pedido
exports.postPedidos = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if(error) { return res.status(500).send({ error: error }) }
    conn.query(
      'SELECT * FROM produtos WHERE id_produtos = ?', 
      [req.body.id_produto],
      (error, result, field) => {
        if(error) { return res.status(500).send({ error: error }) }
        if(result.length == 0){
          return res.status(404).send({
            menssagem: "Produto não encontrado"
          })
        }
        conn.query(
          'INSERT INTO pedidos (id_produto, quantidade) VALUES (?,?)',
          [req.body.id_produto, req.body.quantidade],
          (error, result, field) => {
            conn.release();
            if(error) { return res.status(500).send({ error: error}) }
            const response = {
              mensagem: "Pedido feito com sucesso",
              pedidoCriado: {
                id_pedido: result.id_pedido,
                id_produto: req.id_produto,
                quantidade: req.quantidade,
                request: {
                  tipo: 'GET',
                  descricao: 'Listar todos os pedidos',
                  url: 'http://localhost:3001/pedidos'
                }
              }
            }
            return res.status(201).send(response);
          }
        )
        
        
      }
    )  
  });
};


// Listar um único pedido
exports.getUmPedido = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if(error) { return res.status(500).send({ error: error }) }
    conn.query(
      'SELECT * FROM pedidos WHERE id_pedidos = ?;',
      [req.params.id_pedido],
      (error, result, field) => {
        if(error) { return res.status(500).send({ error: error }) }
        if(result.length == 0){
          return res.status(404).send({
            menssagem: "Não foi encontrado nenhum pedido"
          })
        }
        const response = {
          pedido: {
            id_pedidos: result[0].id_pedidos,
            id_produto: result[0].id_produto,
            quantidade: result[0].quantidade,
            request: {
              tipo: 'GET',
              descricao: 'Retorna todos os pedidos',
              url: 'http://localhost:3001/pedidos'
            }
          }
        }
        return res.status(201).send(response);
      }
    )

  });
};

// Exclui um Pedido
exports.deletePedido = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if(error) { return res.status(500).send({ error: error }) }
    conn.query(
      'DELETE FROM pedidos WHERE id_pedidos = ?',
      [req.body.id_pedido],
      (error, result, field) => {
        if(error) { return res.status(500).send({ error: error })}
        const response = {
          menssagem: 'Seu pedido foi removido',
          request: {
            tipo: 'POST',
            descricao: 'Faça um novo pedido',
            url: 'http://localhost:3001/pedidos',
            body: {
              id_produto: 'Number',
              quantidade: 'Number'
            }
          }
        }
        res.status(202).send(response);
      }
    );
  });
}