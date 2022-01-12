'use strict';
var express = require('express');
var app = express();
// CARGAS DE RUTAS
// var compra_routes = require('./compra/routes');
// MIDDLEWARE
app.use(express.json());
// CORS
// RUTAS
// app.use('/api', compra_routes);
//EXPORT
module.exports = app;
