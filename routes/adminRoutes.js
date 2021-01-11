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
   // console.log(req.body);
   res.send(
      `<p>Course added!</p>
       <a href='/admin/addcourses'><button>Add more.</button></a>
      `
   )
})

module.exports = router;