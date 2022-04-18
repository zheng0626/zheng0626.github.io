const express = require('express');
const res = require('express/lib/response');
const app = express();
const path = require('path');
const cors= require('cors');
const mysql = require('mysql2/promise');
const router = express.Router();
const productController = require('./controllers/productController');
const db = require('./config/db');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
var indexRoutes = require('./route/index');
var adminRoutes = require('./route/user');
var manageProductRoutes = require('./route/manage_product');
var passport = require('passport');
var LocalStrategy = require('passport-local');
// socket.io
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
// const io = new Server(server);
// const bootstrap = require('bootstrap')

// jquery
const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );

app.set('view engine', 'pug');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

const options ={
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    createDatabaseTable: true
}

const pool = mysql.createPool(options);

const sessionStore = new MySQLStore(options, pool);

app.use(session({
    key: "hello.session.key",
    name: process.env.SESS_NAME,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    secret: process.env.SESS_SECRET,
    cookie: {
        maxAge: 1000*10000,
        sameSite: true,
        //secure: process.env.NODE_ENV === 'production'
    }
}))

// Passport js
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('new order',()=>{
    console.log("NEW ORDER COME IN!!!")
    setTimeout(()=>{
      io.emit('new order');
    },1000);
  })

  socket.on('cancel order request',(collectNum,order_id)=>{
    io.emit('cancel order request',collectNum,order_id);
  })

  socket.on('cancel order request reply',(order_id ,msg)=>{
    io.emit('cancel order request reply',order_id,msg);
  })
});



app.use('/',indexRoutes);
app.use('/user', adminRoutes,manageProductRoutes);



server.listen(5000, () => {
  console.log('server is listening on port 5000...');
});

module.exports = router; 