'use strict';
const mysql2 = require('mysql2');
const conn = require('../server');
// Guardar una compra
function savePurchase(req, res) {
    var params = req.body;
    conn.getConnection(async (err, result) => {
        if (err)
            return res.status(500).send({ message: 'Error en la petición' });
        saveAndUpdateStock(params).then((value) => {
            return res.status(200).send({
                savePurchase: value.purchaseSaved,
                updateStock: value.stockUpdated,
            });
        });
    });
}
async function saveAndUpdateStock(params) {
    var save = await conn
        .query('INSERT INTO COMPRA set ?', [params])
        .then((save) => {
        return save;
    })
        .catch((err) => {
        return err;
    });
    var stock = await conn
        .query('UPDATE PRODUCTO SET STOCK = STOCK - ? WHERE COD_PRODUCTO = ?', [
        params.CANTIDAD,
        params.COD_PRODUCTO,
    ])
        .then((stock) => {
        return stock;
    })
        .catch((err) => {
        return err;
    });
    return {
        purchaseSaved: save,
        stockUpdated: stock,
    };
}
// Ver todas las ventas
function getPurchases(req, res) {
    req.getConnection((err, connection) => {
        if (err)
            return res.status(500).send({ message: 'Error en la petición' });
        connection.query('SELECT COMPRA.ID, CLIENTE.NOMBRE, CLIENTE.APELLIDO, PRODUCTO.MARCA, COMPRA.CANTIDAD, COMPRA.FECHA_COMPRA, CLIENTE.TELEFONO FROM COMPRA INNER JOIN CLIENTE ON (COMPRA.CI = CLIENTE.CI) INNER JOIN PRODUCTO ON (COMPRA.COD_PRODUCTO = PRODUCTO.COD_PRODUCTO)', (err, rows) => {
            if (err)
                return res.send(err);
            res.json(rows);
        });
    });
}
// Ver una venta en concreto
function getPurchase(req, res) {
    var { id } = req.params;
    req.getConnection(async (err, connection) => {
        if (err)
            return res.status(500).send({ message: 'Error en la petición' });
        connection.query('SELECT COMPRA.ID, CLIENTE.NOMBRE, CLIENTE.APELLIDO, PRODUCTO.MARCA, COMPRA.CANTIDAD, COMPRA.FECHA_COMPRA, CLIENTE.TELEFONO FROM COMPRA INNER JOIN CLIENTE ON (COMPRA.CI = CLIENTE.CI) INNER JOIN PRODUCTO ON (COMPRA.COD_PRODUCTO = PRODUCTO.COD_PRODUCTO) WHERE COMPRA.ID = ?', [id], (err, result) => {
            if (err)
                return res
                    .status(500)
                    .send({ message: 'Sucedio algun error' })
                    .then();
            return res.status(200).send({ result });
        });
    });
}
// Filtrar ventas por nombre del cliente o fecha
function filterPurchasesByName(req, res) {
    var { nombre } = req.params;
    req.getConnection(async (err, connection) => {
        if (err)
            return res.status(500).send({ message: 'Error en la petición' });
        connection.query('SELECT COMPRA.ID, CLIENTE.NOMBRE, CLIENTE.APELLIDO, PRODUCTO.MARCA, COMPRA.CANTIDAD, COMPRA.FECHA_COMPRA, CLIENTE.TELEFONO FROM COMPRA INNER JOIN CLIENTE ON (COMPRA.CI = CLIENTE.CI) INNER JOIN PRODUCTO ON (COMPRA.COD_PRODUCTO = PRODUCTO.COD_PRODUCTO) WHERE CLIENTE.NOMBRE = ?', [nombre], (err, result) => {
            if (err)
                return res
                    .status(500)
                    .send({ message: 'Sucedio algun error' })
                    .then();
            return res.status(200).send({ result });
        });
    });
}
function deletePurchase(req, res) {
    var { id } = req.params;
    req.getConnection(async (err, connection) => {
        if (err)
            return res.status(500).send({ message: 'Error en la petición' });
        connection.query('DELETE FROM COMPRA WHERE ID = ?', [id], (err, result) => {
            if (err)
                return res
                    .status(500)
                    .send({ message: 'No se ha eliminado la compra' })
                    .then();
            return res
                .status(200)
                .send({ result, message: 'Compra eliminada correctamente' });
        });
    });
}
module.exports = {
    savePurchase,
    getPurchases,
    getPurchase,
    filterPurchasesByName,
    deletePurchase,
};
