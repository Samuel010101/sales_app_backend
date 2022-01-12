'use strict';
var app = require('./app');
// Loading routes
var compra_routes = require('./compra/routes');
// Conecction to the database
var mysql = require('mysql2'), connect = require('express-myconnection');
const dbOptions = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Dioswithme',
    database: 'cursoBD',
};
// Middleware
app.use(connect(mysql, dbOptions, 'single'));
app.use('/api', compra_routes);
// Listen a server
app.set('port', process.env.PORT || 7000);
app.listen(app.get('port'), () => {
    console.log('Server running on port', app.get('port'));
});
