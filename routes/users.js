var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '123',
  port: '3306',
  database: 'nodesample'
});

connection.connect(function(err){
  if(!err) {
    console.log("Database is connected ... nn");
  } else {
    console.log("Error connecting database ... nn");
  }
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get("/userlist",function(req,res){
  connection.query('SELECT * from userinfo', function(err, rows, fields) {
    if (!err)
      res.json(rows);
    else
      console.log('Error while performing Query.');
  });
});


/*
 * POST to adduser.
 */
router.post('/adduser', function(req, res) {
  connection.query('INSERT INTO userinfo SET ?', req.body, function(err, result) {
    res.send(
        (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

/*
 * DELETE to deleteuser.
 */
router.delete('/deleteuser/:id', function(req, res) {
  var userDelSql = 'DELETE FROM userinfo  where Id='+req.params.id;
  connection.query(userDelSql, function (err, result) {
    res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
  });
});
/*
 * PUT to updateuser.
 */
router.put('/updateuser/:id', function(req, res) {
  var userUpSql = 'UPDATE userinfo SET ? WHERE Id='+req.params.id;
  connection.query(userUpSql, req.body, function(err, result) {
    res.send(
        (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

module.exports = router;
