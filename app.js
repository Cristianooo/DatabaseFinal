
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const session = require("express-session");
const passport = require("./config/passport");
const userDB = require("./models");

const app = express();

const {getLoginPage, login} = require('./routes/index');    
const {players, playersPage, upvoteQues, downvoteQues, ranking, addPlayerPage, addPlayer, deletePlayer, editPlayer, editPlayerPage} = require('./routes/player');
const {profilePage, myQuestionsPage} = require('./routes/profile');
const port = 5000;

require("./routes/api-routes.js")(app);

// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: '4a4ZDLy{3p',
    database: 'JustAsk'
});

// connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;

// configure middleware
app.set('port', process.env.port || port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/assets/pics'));

app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// routes for the app



app.get('/players', playersPage);
app.get('/add', addPlayerPage);
app.get('/edit/:id', editPlayerPage);
app.get('/delete/:id', deletePlayer);
app.get('/ranking', ranking);
app.post('/upvote', upvoteQues);
app.post('/downvote', downvoteQues);
app.post('/add', addPlayer);
app.post('/edit/:id', editPlayer);

app.get('/', getLoginPage);
app.post('/', login);


app.get('/profile', profilePage);
app.get('/myQuestions', myQuestionsPage);


userDB.sequelize.sync().then(function() {
    app.listen(port, () => {
        console.log(`Server running on port: ${port}`);
    });
  });

