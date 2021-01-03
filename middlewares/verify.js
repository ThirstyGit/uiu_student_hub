const db = require('../database/database.js');

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

module.exports.loginRequired = (req, res, next) => {
   if(!req.user) {
      return res.redirect('/login')
   }
   else {
      next();
   }
}