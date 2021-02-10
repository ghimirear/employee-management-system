const mysql = require('mysql');
const consoletable = require('console.table');
const connection = mysql.createConnection({
  host: 'localhost',

  // Your port, if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Be sure to update with your own MySQL password!
  password: 'M26monicamysql',
  database: 'employeedb',
});
const afterConnection = () => {
  connection.query('SELECT * FROM emprole', (err, res) => {
    if (err) throw err;
    console.log(consoletable.getTable(res))
    //console.log(res);
    connection.end();
  });
};

connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  afterConnection()
 // connection.end();
  
});