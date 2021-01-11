const router = require('express').Router();
const db = require('../database/database.js');
const { loginRequired } = require('../middlewares/verify.js');

router.get('/getpost', (req, res) => {
   const sql = `SELECT * FROM POSTS`;
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


router.get('/getuser', loginRequired, (req, res) => {
   res.send(req.user);
})

module.exports = router;