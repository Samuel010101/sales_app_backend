'use strict';

const mysql2 = require('mysql2');
const conn = require('../server');

// Guardar una compra
function savePurchase(req: any, res: any) {
  var params = req.body;

  conn.getConnection(async (err: string, result: any) => {
    if (err) return res.status(500).send({ message: 'Error en la petición' });

    saveAndUpdateStock(params).then((value: any) => {
      return res.status(200).send({
        savePurchase: value.purchaseSaved,
        updateStock: value.stockUpdated,
      });
    });
  });
}

async function saveAndUpdateStock(params: any) {
  var save = await conn
    .query('INSERT INTO COMPRA set ?', [params])
    .then((save: any) => {
      return save;
    })
    .catch((err: any) => {
      return err;
    });

  var stock = await conn
    .query('UPDATE PRODUCTO SET STOCK = STOCK - ? WHERE COD_PRODUCTO = ?', [
      params.CANTIDAD,
      params.COD_PRODUCTO,
    ])
    .then((stock: any) => {
      return stock;
    })
    .catch((err: any) => {
      return err;
    });

  return {
    purchaseSaved: save,
    stockUpdated: stock,
  };
}

// Ver todas las ventas
function getPurchases(req: any, res: any) {
  req.getConnection((err: string, connection: any) => {
    if (err) return res.status(500).send({ message: 'Error en la petición' });

    connection.query(
      'SELECT COMPRA.ID, CLIENTE.NOMBRE, CLIENTE.APELLIDO, PRODUCTO.MARCA, COMPRA.CANTIDAD, COMPRA.FECHA_COMPRA, CLIENTE.TELEFONO FROM COMPRA INNER JOIN CLIENTE ON (COMPRA.CI = CLIENTE.CI) INNER JOIN PRODUCTO ON (COMPRA.COD_PRODUCTO = PRODUCTO.COD_PRODUCTO)',
      (err: string, rows: JSON) => {
        if (err) return res.send(err);

        res.json(rows);
      }
    );
  });
}

// Ver una venta en concreto
function getPurchase(req: any, res: any) {
  var { id } = req.params;

  req.getConnection(async (err: string, connection: any) => {
    if (err) return res.status(500).send({ message: 'Error en la petición' });

    connection.query(
      'SELECT COMPRA.ID, CLIENTE.NOMBRE, CLIENTE.APELLIDO, PRODUCTO.MARCA, COMPRA.CANTIDAD, COMPRA.FECHA_COMPRA, CLIENTE.TELEFONO FROM COMPRA INNER JOIN CLIENTE ON (COMPRA.CI = CLIENTE.CI) INNER JOIN PRODUCTO ON (COMPRA.COD_PRODUCTO = PRODUCTO.COD_PRODUCTO) WHERE COMPRA.ID = ?',
      [id],
      (err: string, result: JSON) => {
        if (err)
          return res
            .status(500)
            .send({ message: 'Sucedio algun error' })

            .then();
        return res.status(200).send({ result });
      }
    );
  });
}

// Filtrar ventas por nombre del cliente o fecha
function filterPurchasesByName(req: any, res: any) {
  var { nombre } = req.params;

  req.getConnection(async (err: string, connection: any) => {
    if (err) return res.status(500).send({ message: 'Error en la petición' });

    connection.query(
      'SELECT COMPRA.ID, CLIENTE.NOMBRE, CLIENTE.APELLIDO, PRODUCTO.MARCA, COMPRA.CANTIDAD, COMPRA.FECHA_COMPRA, CLIENTE.TELEFONO FROM COMPRA INNER JOIN CLIENTE ON (COMPRA.CI = CLIENTE.CI) INNER JOIN PRODUCTO ON (COMPRA.COD_PRODUCTO = PRODUCTO.COD_PRODUCTO) WHERE CLIENTE.NOMBRE = ?',
      [nombre],
      (err: string, result: Array<object>) => {
        if (err)
          return res
            .status(500)
            .send({ message: 'Sucedio algun error' })

            .then();
        return res.status(200).send({ result });
      }
    );
  });
}

function deletePurchase(req: any, res: any) {
  var { id } = req.params;

  req.getConnection(async (err: string, connection: any) => {
    if (err) return res.status(500).send({ message: 'Error en la petición' });

    connection.query(
      'DELETE FROM COMPRA WHERE ID = ?',
      [id],
      (err: string, result: any) => {
        if (err)
          return res
            .status(500)
            .send({ message: 'No se ha eliminado la compra' })

            .then();
        return res
          .status(200)
          .send({ result, message: 'Compra eliminada correctamente' });
      }
    );
  });
}

module.exports = {
  savePurchase,
  getPurchases,
  getPurchase,
  filterPurchasesByName,
  deletePurchase,
};

// function editPurchase(req: any, res: any) {
//   const { id } = req.params;
//   const { COD_PRODUCTO, CANTIDAD } = req.body;
//   const newCompra = {
//     COD_PRODUCTO,
//     CANTIDAD,
//   };

//   req.getConnection(async (err: string, connection: any) => {
//     if (err) return res.status(500).send({ message: 'Error en la petición' });

//     connection.query(
//       'UPDATE COMPRA SET ? WHERE ID = ?',
//       [newCompra, id],
//       (err: string, purchaseUpdate: any) => {
//         if (err)
//           return res.status(500).send({ message: 'Error en la petición' });

//         if (!purchaseUpdate)
//           return res
//             .status(404)
//             .send({ message: 'La compra no existe' })

//             .then();
//         return res
//           .status(200)
//           .send({ message: 'Compra actualizada', purchaseUpdate });
//       }
//     );
//   });
// }

// req.getConnection(async (err: string, connection: any) => {
//   if (err) return res.status(500).send({ message: 'Error en la petición' });

//   const saveCompra = await connection.query(
//     'INSERT INTO COMPRA set ?',
//     [params],
//     (err: string, rows: any) => {
//       if (err)
//         return res
//           .status(500)
//           .send({ message: 'Error al guardar la compra' });

//       return res.status(200).send({ message: 'Compra realizada' });
//     }
//   );

//   const updateStock = await connection.query(
//     'UPDATE PRODUCTO SET STOCK = STOCK - ?'[params.CANTIDAD] +
//       'WHERE COD_PRODUCTO = ?'[params.COD_PRODUCTO],
//     (err: string, result: any) => {
//       if (err)
//         return res
//           .status(500)
//           .send({ message: 'Error al actualizar el stock' });

//       return res(200).send({ message: 'Stock actualizado correctamente' });
//     }
//   );
// });

// const updateStock = await connection.query(
//   'UPDATE PRODUCTO SET STOCK = STOCK - ?'[params.CANTIDAD] +
//     'WHERE COD_PRODUCTO = ?'[params.COD_PRODUCTO],
//   function (err: string, result: any) {
//     if (err)
//       return res
//         .status(500)
//         .send({ message: 'Error al actualizar el stock' });
//   }
// )((updateStock: any) => {
//   return res.status(200).send({ message: 'Stock actualizado' });
// });
// } catch (err) {
//   return res.status(500).send({ message: 'Error en esta operación' });
// }
