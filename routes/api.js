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
   const sql = `SELECT * FROM users WHERE id = ${req.params.id}`;
   db.query(sql, (err,result) => {
      res.send(result);
   })
})

router.get('/getusersuggestion/:suggest', loginRequired, admin, (req, res) => {
   const suggest = `%${db.escape(req.params.suggest).slice(1, req.params.suggest.length + 1)}%`;
   const sql = `SELECT * FROM users WHERE name LIKE '${suggest}'`;
   db.query(sql, (err, result) => {
      res.send(result);
   })
})

router.get('/moderate/:id/:user', loginRequired, (req, res) => {
   const user = `%${db.escape(req.params.user).slice(1, req.params.user.length + 1)}%`;
   const sql = `SELECT *, IF(
      u.id IN (
         SELECT user_id FROM courses_moderators AS cm
         WHERE cm.course_code = uc.course_code
      ), 'true', 'false'
   )
   AS moderator
   FROM users_courses AS uc
   JOIN users AS u
   ON uc.user_id = u.id
   WHERE uc.course_code = ${db.escape(req.params.id).replace(/_/g, ' ')}
   AND u.name LIKE '${user}'`;
   db.query(sql, (err, result) => {
      if(err) {
         console.log(err);
         res.send(err);
      }
      else {
         res.send(result);
      }
   })
})

module.exports = router;