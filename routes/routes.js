// Imports.
const router = require('express').Router();
const path = require('path');
const db = require('../database/database.js');
const loginRequired = require('../middlewares/verify').loginRequired;


// Setting a current Semester for testing which the admin can change in the future.
const curSemester = 211;

// Stundet Hub.
router.get('/', (req, res)=> {
   const sql = `SELECT * FROM courses`;
   db.query(sql, (err, result) => {
      if(err) {
         console.log(err);
      }
      res.render(path.join(__dirname + '/../') + 'views/index.ejs', {result});
   })
});

// To create a post.
router.get('/createpost', loginRequired, (req, res)=> {
   const sql = `SELECT * FROM courses`
   db.query(sql, (err, result) => {
      if(err) {
         console.log(err)
         res.redirect('/');
      }
      else {
         res.render(path.join(__dirname + '/../') + '/views/createPost.ejs', {courses: result});
      }
   })
});

router.post('/createpost', (req, res) => {
   let sql = `INSERT INTO posts(user_id, course_code, title, content, semester, time)
                           VALUES(${user.id}, ${db.escape(req.body.course_code)}, ${db.escape(req.body.title)}, ${db.escape(req.body.post)}, ${curSemester}, NOW())`;
   db.query(sql, (err, result) => {
      if(err) {
         console.log(err);
         res.redirect(`/createpost`)
      }
      else {
         res.redirect(`/`);
      }
   })
});

// view all posts.
router.get('/posts', (req, res) => {
   const sql = `SELECT * FROM posts`;
   db.query(sql, (err, result) => {
      if(err) {
         console.log(err);
         res.redirect('/');
      }
      else {
         let semesters = [];
         result.forEach(res => {
            if(!semesters.includes(res.semester)) {
               semesters.push(res.semester);
            }
         })
         const sql = `SELECT * FROM courses`;
         db.query(sql, (err, courses) => {
            if(err) {
               console.log(err);
               res.redirect('/');
            }
            else {
               res.render(path.join(__dirname + '/../') + '/views/posts.ejs', {posts: result, semesters, courses});
            }
         })
      }
   })
})



// viewing a sepcific post.
router.get('/posts/:id', (req, res) => {
   const sqlComments = `SELECT content, time, (
      SELECT name FROM users AS us WHERE us.id = co.user_id
   ) AS name
   FROM posts_comments AS co
   WHERE post_id = ${db.escape(req.params.id)}`;
   let comments = [];
   db.query(sqlComments, (err, result) => {
      if(err) {
         console.log(err);
         res.redirect('/posts');
      }
      else {
         result.forEach((data) => {
            comments.push({content : data.content, name: data.name, time: data.time});
         })
      }
   })
   const sqlPost = `SELECT content, id, title, time, user_id FROM posts WHERE id = ${db.escape(req.params.id)}`;
   db.query(sqlPost, (err, result) => {
      if(err) {
         console.log(err);
         res.redirect('/');
      }
      else {
         res.render(path.join(__dirname + '/../' + '/views/post.ejs'), {post: result[0], comments});
      }
   })
});


// creating a comment.
router.post('/posts/:id/createcomment', (req, res) => {
   if(user) {
      const sql = `INSERT INTO posts_comments(content, user_id, post_id, time)
            VALUES(${db.escape(req.body.comment_content)}, ${user.id}, ${db.escape(req.body.post_id)}, NOW())`;
      db.query(sql, (err, result) => {
         if(err) {
            console.log(err);
            res.send('Error creating a comment.');
         }
      })
      res.redirect(`/posts/${req.body.post_id}`);
   }
   else {
      res.redirect('/login');
   }
});


router.get('/course/:id', loginRequired, (req, res) => {
   const sql = `SELECT * FROM room_posts WHERE course_code = ${db.escape(req.params.id.replace(/_/g, ' '))}`;
   db.query(sql, (err, result) => {
      if(err) {
         console.log(err);
         res.send('/');
      }
      else {
         res.render(path.join(__dirname + '/../' + '/views/courseRoom.ejs'), {posts: result, user: req.user});
      }
   })
})

module.exports = router;


