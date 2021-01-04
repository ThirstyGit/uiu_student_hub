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
         global.user = req.user;
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
   if(req.user && (req.user.type === 'admin' || req.user.type === 'moderator')) {
      next();
   }
   else {
      res.redirect('/');
   }
}

module.exports.enrolled = (req, res, next) => {
   const sql = `SELECT * FROM users_courses WHERE user_id = ${req.user.id} && course_code = ${db.escape(req.params.id.replace(/_/g, ' '))}`;
   db.query(sql, (err, result) => {
      if(result.length) {
         res.locals.enrolled = true;
      }
      else {
         res.locals.enrolled = false;
      }
      next();
   })
}
