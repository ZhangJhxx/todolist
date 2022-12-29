// 数据库连接
const mysql = require("mysql");
const database = process.env.MYSQL_DATABASE;
const conn = mysql.createConnection({
  host: 'mysql',
  user: 'root',
  port: "3306",
  password: 'admin',
  multipleStatements: true,
  useConnectionPooling: true,
});

conn.connect((err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("connected to mysql");
  }
});

conn.query(
  `Create Database If Not Exists ${database} Character Set UTF8;`,
  (err, result) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log(result);
    }
  }
);

conn.query(`use ${database}; CREATE TABLE IF NOT EXISTS todo_list(
    id INT UNSIGNED AUTO_INCREMENT, 
    val VARCHAR(100) NOT NULL,
    done tinyint(1) NOT NULL,
    PRIMARY KEY ( id )
);`, (err, results) => {
    if (err) {
        console.log(err);
    } else {
        console.log(results);
    }
});

module.exports = conn;
