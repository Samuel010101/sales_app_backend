'use strict';

var express = require('express');
var CompraController = require('./controllers');
var api = express.Router();

api.post('/guardar-compra', CompraController.savePurchase);

api.get('/compras', CompraController.getPurchases);

api.get('/compra/:id', CompraController.getPurchase);
api.get('/compras/:nombre', CompraController.filterPurchasesByName);

api.delete('/eliminar-compra/:id', CompraController.deletePurchase);

// api.put('/editar-compra/:id', CompraController.editPurchase);

module.exports = api;