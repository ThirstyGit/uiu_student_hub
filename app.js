// Imports
const express = require('express');
const app = require('express')();
const sessions = require('express-session');
const server = require('http').createServer(app);
const io = require("socket.io")(server);

// user defined modules.
const routes = require('./routes/routes.js')
const adminRoutes = require('./routes/adminRoutes.js');
const authRoutes = require('./routes/authRoutes.js');
const api = require('./routes/api.js');
const authenticate = require('./middlewares/verify').authenticate;

// Setting up app
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(sessions({
   secret: 'secret', // Need a better secret key.
   resave: true,
   saveUninitialized: true,
   cookie: {
      maxAge: 1000 * 60 * 60 * 1 // 1 hour
   }
}));
app.use(authenticate);

// Setting static
app.use(express.static('public'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/images', express.static(__dirname + '/public/images'));
app.set('view engine', 'ejs');

// Setting up routes.
app.use('/', routes);
app.use('/admin/', adminRoutes);
app.use('/', authRoutes);
app.use('/api', api);


// Socket.io connection
io.on('connection', socket => {
   socket.on('message', data => {
      socket.to(data.room).emit("chat", {message: data.message, user: data.user});
   })
   socket.on('join', room => {
      socket.join(room);
   })
})


const port = process.env.PORT || 3000;

server.listen(port, () => {
   console.log('Server is up and running.')
});


