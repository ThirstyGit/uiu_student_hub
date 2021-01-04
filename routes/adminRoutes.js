// Imports
const router = require('express').Router();
const path = require('path');
const db = require('../database/database.js');
const admin = require('../middlewares/verify.js').admin;


// all routes start with /admin
// This is the main admin page.
router.get('/', admin, (req, res) => {
   res.render(path.join(__dirname + '/../') + '/views/admin.ejs');
})


router.get('/moderator')


router.post('/addcourses', admin, (req, res) => {
   const sql = `INSERT INTO courses VALUES(${db.escape(req.body.courseCode)}, ${db.escape(req.body.courseName)})`;
   db.query(sql, (err, result) => {
      if(err) {
         console.log(err);
      }
   })
   // console.log(req.body);
   res.send(
      `<p>Course added!</p>
       <a href='/admin/addcourses'><button>Add more.</button></a>
      `
   )
})


module.exports = router;

