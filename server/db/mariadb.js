const mariadb = require('mysql');

const conn = mariadb.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '0427',
  database: 'korive',
  multipleStatements: true,
});

module.exports = conn;
