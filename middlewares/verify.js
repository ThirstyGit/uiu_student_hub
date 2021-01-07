const db = require('../database/database.js');

// storing the data if logged in.
module.exports.authenticate = (req, res, next) => {
   global.user = undefined;
   if(!(req.session && req.session.userId)) {
      return next();
   }
   const sql = `SELECT * FROM users WHERE id = ${req.session.userId}`;
   db.query(sql, (error, result) => {
      if(error) {
         console.log(error);
         next();
      }
      if(result.length) {
         result[0].password = undefined;
         req.user = result[0];
         res.locals.user = result[0];
      }
      return next();
   })
}

// Making sure that there is a data stored for user.
module.exports.loginRequired = (req, res, next) => {
   if(!req.user) {
      return res.redirect('/login')
   }
   else {
      next();
   }
}

// Making sure that the logged in user is an admin.
module.exports.admin = (req, res, next) => {
   if(req.user && req.user.type === 'admin') {
      next();
   }
   else {
      res.redirect('/');
   }
}

module.exports.moderator = (req, res, next) => {
   if(req.user && (req.user.type === 'admin')) {
      next();
   }
   else {
      const sql = `SELECT * FROM courses_moderators WHERE course_code = ${db.escape(req.params.id)} && user_id = ${req.user.id}`;
      db.query(sql, (err, result) => {
         if(result.length) {
            next();
         }
         else {
            res.redirect('/');
         }
      })
   }
}

module.exports.enrolled = (req, res, next) => {
   const sql = `SELECT * FROM users_courses WHERE user_id = ${req.user.id} && course_code = ${db.escape(req.params.id.replace(/_/g, ' '))}`;
   db.query(sql, (err, result) => {
      if(result.length && result[0].status == "enrolled") {
         res.locals.status = true;
      }
      else if(result.length) {
         res.locals.status = "applied"
      }
      else {
         res.locals.status = false;
      }
      const sql = `SELECT * FROM courses_moderators WHERE course_code = ${db.escape(req.params.id).replace(/_/g, ' ')} && user_id = ${req.user.id}`;
      // console.log(db.escape(req.params.id));
      // console.log(req.user.id);
      res.locals.moderator = false;
      db.query(sql, (err, result) => {
         if(err) {
            console.log(err);
         }
         if(result.length) {
            res.locals.moderator = true;
            // console.log("HERE");
         }
         // else {
         //    console.log("NOPE");
         // }
      })
      next();
   })
}
