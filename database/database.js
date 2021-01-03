const mysql = require('mysql');

const db = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: 'ulab333',
   database: 'student_hub'
});

db.connect(err => {
   if(err) {
      console.log('Cannot connect to database');
   }
   else {
      console.log('connected to database');
   }
});

module.exports = db;