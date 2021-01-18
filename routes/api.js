const router = require('express').Router();
const db = require('../database/database.js');
const { loginRequired, admin } = require('../middlewares/verify.js');

// API for searching posts.
router.get('/getpost', (req, res) => {
   const sql = `SELECT * FROM posts`;
   db.query(sql, (err, result) => {
      if(err) {
         console.log(err);
         res.send('ERROR!');
      }
      else {
         res.send(result);
      }
   })
})


router.get('/getpost/:title', (req, res) => {
   title = `%${db.escape(req.params.title).slice(1, req.params.title.length + 1)}%`;
   const sql = `SELECT * FROM posts WHERE title LIKE '${title}'`;
   db.query(sql, (err, result) => {
      if(err) {
         console.log(err);
         res.send('ERROR!');
      }
      else {
         res.send(result);
      }
   })
})


// API for searching blogs.
router.get('/getblog', (req, res) => {
   const sql = `SELECT * FROM blogs`;
   db.query(sql, (err, result) => {
      if(err) {
         console.log(err);
         res.send('ERROR!');
      }
      else {
         res.send(result);
      }
   })
})


router.get('/getblog/:title', (req, res) => {
   title = `%${db.escape(req.params.title).slice(1, req.params.title.length + 1)}%`;
   const sql = `SELECT * FROM blogs WHERE title LIKE '${title}'`;
   db.query(sql, (err, result) => {
      if(err) {
         console.log(err);
         res.send('ERROR!');
      }
      else {
         res.send(result);
      }
   })
})


router.get('/getuser', loginRequired, (req, res) => {
   res.send(req.user);
})

router.get('/getuser/:id', loginRequired, admin, (req, res) => {
   const sql = `SELECT * FROM users AS u
                  WHERE u.id = ${req.params.id}
                  `;
   db.query(sql, (err,result) => {
      res.send(result);
   })
})

router.get('/getusersuggestion/:suggest', loginRequired, admin, (req, res) => {
   suggest = `%${db.escape(req.params.suggest).slice(1, req.params.suggest.length + 1)}%`;
   const sql = `SELECT * FROM users WHERE name LIKE '${suggest}'`;
   db.query(sql, (err, result) => {
      res.send(result);
   })
})

module.exports = router;