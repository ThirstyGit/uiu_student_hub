// Imports
const router = require('express').Router();
const path = require('path');

// User modules
const db = require('../database/database.js');
const loginRequired = require('../middlewares/verify.js').loginRequired;


// all routes start with /admin
// This is the main admin page.
router.get('/', loginRequired, (req, res) => {
   res.render(path.join(__dirname + '/../') + '/views/admin.ejs');
})

router.post('/addcourses', (req, res) => {
   const sql = `INSERT INTO courses VALUES(${db.escape(req.body.courseCode)}, ${db.escape(req.body.courseName)})`;
   db.query(sql, (err, result) => {
      if(err) {
         console.log(err);
      }
   })
})

router.post('/setsemester', (req, res) => {
   global.curSemester = req.body.semester
})

router.post('/deleteuser', (req, res) => {
   console.log('here');
   const sql = `DELETE FROM users WHERE id = ${db.escape(req.body.id)}`;
   db.query(sql, (err, result) => {
      if(err) {
         console.log(err);
      }
   })
})

module.exports = router;