const router = require('express').Router();
const path = require('path');
const db = require('../database/database.js');
const bcrypt = require('bcrypt');



router.get('/login', (req, res) => {
   res.render(path.join(__dirname + '/../' + '/views/login.ejs'));
})

router.post('/login', (req, res) => {
   const sql = `SELECT * FROM USERS WHERE email =  ${db.escape(req.body.email)}`;
   db.query(sql, (error, result) => {
      if(error) {
         console.log(error);
         res.redirect('/login');
      }
      else {
         if(result.length && bcrypt.compareSync(req.body.password, result[0].password)) {
            req.session.userId = result[0].id;
            res.redirect('/');
         }
         else {
            res.redirect('/login');
         }
      }
   })
})

router.get('/logout', (req, res) => {
   req.session.destroy((err) => {
      if(err) {
         console.log(err);
      }
      res.redirect('/');
   })
})

router.get('/register', (req, res) => {
   res.render(path.join(__dirname + '/../' + '/views/register.ejs'));
})


router.post('/register', (req, res) => {
   const sql = `SELECT * FROM users WHERE email = ${db.escape(req.body.email)}`;
   db.query(sql, (err, result) => {
      if(err) {
         console.log(err);
         res.redirect('/register');
      }
      else {
         if(result.length) {
            console.log('User Exists!');
            res.redirect('/register')
         }
         else {
            req.body.password = bcrypt.hashSync(req.body.password, 14);
            // Explicitly type is set to admin for testing. Should let the default value handle user type.
            const sql = `INSERT INTO users(department, DOB, email, name, university_id,  password, phone)
                              VALUES('${req.body.department}', ${db.escape(req.body.date)}, ${db.escape(req.body.email)}, ${db.escape(req.body.name)}, ${db.escape(req.body.id)}, ${db.escape(req.body.password)}, ${db.escape(req.body.phone)})`;
            db.query(sql, (error, result) => {
               if(error) {
                  console.log(error);
                  res.redirect('/register');
               }
               else {
                  res.redirect('/login');
               }
            })
         }
      }
   })
})

module.exports = router;


