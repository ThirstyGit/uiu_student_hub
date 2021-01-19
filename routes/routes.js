// Imports.
const router = require('express').Router();
const path = require('path');
const db = require('../database/database.js');
const {loginRequired, enrolled, authorizedUpdate} = require('../middlewares/verify');
const bcrypt = require('bcrypt');
const multer = require('multer');

// Storage Engine
const storage = multer.diskStorage({
   destination: function(req, file, cb) {
      cb(null, './public/images')
   },
   filename: function(req, file, cb) {
      cb(null, Date.now() + file.originalname);
   }
})
const upload = multer({storage});

// Setting a current Semester for testing which the admin can change in the future.
global.curSemester = 211;

// Stundet Hub.
router.get('/', (req, res)=> {
   const sql = `SELECT * FROM courses AS c`;
   const sql2 = `SELECT * FROM blogs ORDER BY time DESC LIMIT 10`;
   const sql3 = `SELECT * FROM posts ORDER BY time DESC LIMIT 10`;
   db.query(sql, (err, courses) => {
      if(err) {
         console.log(err);
      }
      else {
         db.query(sql2, (err, blogs) => {
            if(err) {
               console.log(err);
            }
            db.query(sql3, (err, posts) => {
               if(err) {
                  console.log(err);
               }
               let user = undefined;
               if((req.session && req.session.userId)) {
                  user = req.user;
               }
               res.render(path.join(__dirname + '/../') + 'views/index.ejs', {courses, blogs, posts, user});
            })
         })
      }
   })
});


// User Panel
router.get('/user/:id', loginRequired, (req, res) => {
   // const sql = `SELECT * FROM users WHERE id = ${db.escape(req.params.id)}`;
   const sql = `SELECT * FROM users AS u
               LEFT JOIN users_courses AS uc
               ON u.id = uc.user_id
               LEFT JOIN courses AS c
               ON uc.course_code = c.course_code
               WHERE u.id = ${db.escape(req.params.id)}`;
   const sql2 = `SELECT * FROM posts WHERE user_id = ${db.escape(req.params.id)}`;
   db.query(sql, (err, result) => {
      db.query(sql2, (err, result2) => {
         res.render(path.join(__dirname + '/../') + 'views/user.ejs', {user: result[0], userInfo: result, posts: result2});
      })
   })
});

// Change user information
router.put('/user', loginRequired, (req, rers) => {
   const sql = `UPDATE users SET
               name = ${db.escape(req.body.name)}, email = ${db.escape(req.body.email)},
               phone = ${db.escape(req.body.phone)}, dob = ${db.escape(req.body.dob)}
               WHERE id = ${db.escape(req.user.id)}`;
   db.query(sql, (err, result) => {
      if(err) {
         console.error(err);
      }
   })
})

router.put('/changepassword', loginRequired, (req, rers) => {
   const sql = `UPDATE users SET
               password = ${db.escape(bcrypt.hashSync(req.body.password, 14))}
               WHERE id = ${db.escape(req.user.id)}`;
   db.query(sql, (err, result) => {
      if(err) {
         console.error(err);
      }
   })
})

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

router.post('/createpost', loginRequired, (req, res) => {
   let sql = `INSERT INTO posts(user_id, course_code, title, content, semester, time)
                           VALUES(${req.user.id}, ${db.escape(req.body.course_code)}, ${db.escape(req.body.title)}, ${db.escape(req.body.post)}, ${curSemester}, NOW())`;
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

// creating a comment on a specific post.
router.post('/posts/:id/createcomment', loginRequired, (req, res) => {
   if(req.user) {
      const sql = `INSERT INTO posts_comments(content, user_id, post_id, time)
            VALUES(${db.escape(req.body.comment_content)}, ${req.user.id}, ${db.escape(req.body.post_id)}, NOW())`;
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

router.get('/posts/:id/update', authorizedUpdate, (req, res) => {
   const sql = `SELECT * FROM posts WHERE id = ${db.escape(req.params.id)}`;
   db.query(sql, (err, result) => {
      res.render(path.join(__dirname + '/../' + '/views/postsUpdate.ejs'), {post: result[0]});
   })
})

router.post('/posts/:id/update', authorizedUpdate, (req, res) => {
   const sql = `UPDATE posts SET title = ${db.escape(req.body.title)}, content = ${db.escape(req.body.post)} WHERE id = ${db.escape(req.params.id)}`;
   db.query(sql, (err, result) => {
      if(err) {
         console.log(err);
      }
      res.redirect('/');
   })
})

// Delete a specific post
router.post('/post/delete', (req, res) => {
   const sql = `DELETE FROM posts_comments where post_id = ${db.escape(req.body.id)}`;
   db.query(sql, (err, result) => {
      if(err) {
         console.log(err);
      }
      else {
         const sql2 = `DELETE FROM posts WHERE id = ${db.escape(req.body.id)}`;
         db.query(sql2, (err, result) => {
            if(err) {
               console.log(err);
            }
         })
      }
   })
})

// To create a blog.
router.get('/createblog', loginRequired, (req, res)=> {
   const sql = `SELECT DISTINCT tag FROM blogs`;
   db.query(sql, (err, result) => {
      res.render(path.join(__dirname + '/../') + '/views/createBlog.ejs', {tags: result});
   })
});

router.post('/createblog', (req, res) => {
   const sql = `INSERT INTO blogs(user_id, content, time, title, tag)
   VALUES(${req.user.id}, ${db.escape(req.body.post)}, now(), ${db.escape(req.body.title)}, ${db.escape(req.body.tag)})`
   db.query(sql, (err, result) => {
      if(err) {
         console.log(err);
      }
   })
   res.redirect('/');
})

// view all blogs.
router.get('/blogs', (req, res) => {
   const sql = `SELECT * FROM blogs`;
   db.query(sql, (err, result) => {
      if(err) {
         console.log(err);
         res.redirect('/');
      }
      else {
         let tags = [];
         result.forEach(res => {
            if(!tags.includes(res.tag)) {
               tags.push(res.tag);
            }
         })
         res.render(path.join(__dirname + '/../') + '/views/blogs.ejs', {blogs: result, tags});
      }
   })
})


// viewing a sepcific blogs.
router.get('/blogs/:id', (req, res) => {
   const sqlComments = `SELECT content, time, (
      SELECT name FROM users AS us WHERE us.id = co.user_id
   ) AS name
   FROM blogs_comments AS co
   WHERE blog_id = ${db.escape(req.params.id)}`;
   let comments = [];
   db.query(sqlComments, (err, result) => {
      if(err) {
         console.log(err);
         res.redirect('/blogs');
      }
      else {
         result.forEach((data) => {
            comments.push({content : data.content, name: data.name, time: data.time});
         })
      }
   })
   const sqlBlog = `SELECT content, id, title, time, user_id FROM blogs WHERE id = ${db.escape(req.params.id)}`;
   db.query(sqlBlog, (err, result) => {
      if(err) {
         console.log(err);
         res.redirect('/');
      }
      else {
         res.render(path.join(__dirname + '/../' + '/views/blog.ejs'), {blog: result[0], comments});
      }
   })
});


// creating a comment on a specific post.
router.post('/blogs/:id/createcomment', loginRequired, (req, res) => {
   if(req.user) {
      const sql = `INSERT INTO blogs_comments(content, user_id, blog_id, time)
            VALUES(${db.escape(req.body.comment_content)}, ${req.user.id}, ${db.escape(req.body.blog_id)}, NOW())`;
      db.query(sql, (err, result) => {
         if(err) {
            console.log(err);
            res.send('Error creating a comment.');
         }
      })
      res.redirect(`/blogs/${req.body.blog_id}`);
   }
   else {
      res.redirect('/login');
   }
});

// Delete a specific blog
router.post('/blog/delete', (req, res) => {
   const sql = `DELETE FROM blogs_comments WHERE blog_id = ${db.escape(req.body.id)}`;
   db.query(sql, (err, result) => {
      if(err) {
         console.log(err);
      }
      else {
         const sql2 = `DELETE FROM blogs WHERE id = ${db.escape(req.body.id)}`;
         db.query(sql2, (err, result) => {
            if(err) {
               console.log(err);
            }
         })
      }
   })
})



router.get('/course/:id', loginRequired, enrolled, (req, res) => {
   const sql = `SELECT * FROM room_posts AS rp
               JOIN users AS u
               ON rp.user_id = u.id
               WHERE rp.course_code = ${db.escape(req.params.id.replace(/_/g, ' '))}
               ORDER BY rp.time`;
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

router.post('/course/:id', (req, res) => {
   const sql = `INSERT INTO room_posts(course_code, user_id, chat, time)
                  VALUES(${db.escape(req.params.id).replace(/_/g, ' ')}, ${db.escape(req.user.id)}, ${db.escape(req.body.chat)}, now())`;
   db.query(sql, (err, result) => {
      if(err) {
         console.log(err)
      }
      else {
         res.send(req.user.name);
      }
   })
});

router.get('/course/:id/enroll', loginRequired, (req, res) => {
   const sql = `INSERT INTO users_courses(user_id, course_code) VALUES(${req.user.id}, ${db.escape(req.params.id.replace(/_/g, ' '))})`;
   db.query(sql, (err, result) => {
      if(err) {
         console.log(err)
      }
      res.redirect('/');
   })
})

router.get('/course/:id/moderate', loginRequired, (req, res) => {
   const sql = `SELECT * FROM users_courses WHERE course_code = ${db.escape(req.params.id).replace(/_/g, ' ')} && status = "applied"`;
   db.query(sql, (err, result) => {
      if(err) {
         console.log(err)
      }
      res.render(path.join(__dirname + '/../' + '/views/moderate.ejs'), {request: result});
   })
})

router.get('/course/:id/files', loginRequired, (req, res) => {
   const sql = `SELECT * FROM courses_files WHERE course_code = ${db.escape(req.params.id).replace(/_/g, ' ')}`;
   db.query(sql, (err, files) => {
      res.render(path.join(__dirname + '/../' + '/views/coursefiles.ejs'), {files});
   })
})

router.post('/course/:id/files', loginRequired, upload.single('file'), (req, res) => {
   const sql = `INSERT INTO courses_files(user_id, file_type, file, course_code)
                                    VALUES(${req.user.id}, ${db.escape(req.file.mimetype)}, ${db.escape(req.file.filename)}, ${db.escape(req.params.id).replace(/_/g, ' ')})`;
   db.query(sql, (err, result) => {
      if(err) {
         console.log(err);
      }
   })
   res.redirect('/');
})

router.post("/moderate", (req, res) => {
   const sql = `UPDATE users_courses SET status = "enrolled" WHERE user_id = ${db.escape(req.body.user_id)} && course_code = ${db.escape(req.body.course_code)}`;
   db.query(sql, (err, result) => {
      if(err) {
         console.log(err);
      }
   });
   res.redirect(`/course/${req.body.course_code}/moderate`);
})

router.get("/course/:id/moderate/users", loginRequired, (req, res) => {
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
   WHERE uc.course_code = ${db.escape(req.params.id).replace(/_/g, ' ')}`;
   db.query(sql, (err, result) => {
      res.render(path.join(__dirname + '/../' + '/views/moderateUsers.ejs'), {users: result, course_id: req.params.id});
   })
})

router.get("/course/:id/moderate/moderators", loginRequired, (req, res) => {
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
   && uc.user_id IN (
      SELECT user_id FROM courses_moderators WHERE course_code = ${db.escape(req.params.id).replace(/_/g, ' ')}
   )`;
   db.query(sql, (err, result) => {
      if(err) {
         console.log(err);
         res.redirect('/');
      }
      else {
         res.render(path.join(__dirname + '/../' + '/views/moderateUsers.ejs'), {users: result, course_id: db.escape(req.params.id)});
      }
   })
})

router.post("/course/:id/moderate/addmoderate", (req, res) => {
   const sql = `INSERT INTO courses_moderators(course_code, user_id) VALUES(${db.escape(req.params.id).replace(/_/g, ' ')}, ${req.body.id})`;
   db.query(sql, (err, result) => {
      if(err) {
         console.log(err);
         res.send("ERROR!");
      }
      else {
         res.redirect(`/`)
      }
   })
})

router.post("/course/:id/moderate/removemoderate", (req, res) => {
   const sql = `DELETE FROM courses_moderators WHERE course_code = ${db.escape(req.params.id).replace(/_/g, ' ')} && user_id = ${req.body.id}`;
   db.query(sql, (err, result) => {
      if(err) {
         console.log(err);
         res.send("ERROR!");
      }
      else {
         res.redirect(`/`)
      }
   })
})

module.exports = router;


