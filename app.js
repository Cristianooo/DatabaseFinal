
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const session = require("express-session");
const passport = require("./config/passport");
const userDB = require("./models");

const app = express();

const {getLoginPage, login, getSignUpPage} = require('./routes/index');    
const {questionsPage, upvoteQues, downvoteQues, ranking, addQuestionPage, addQuestion, deleteQuestion, editQuestion, editQuestionPage, addResponsePage, addResponse} = require('./routes/question');
const {profilePage, myQuestionsPage,editQuesPage,editQues, deleteQues, upVotedQuestionsPage, myResponsePage} = require('./routes/profile');
const port = 5000;

const {APIlogin, signup, logout, getUserData} = require("./routes/api-routes.js"); 


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



app.get('/questions', questionsPage);
app.get('/add', addQuestionPage);
app.get('/edit/:id', editQuestionPage);
app.get('/delete/:id', deleteQuestion);
app.get('/ranking', ranking);
app.get('/addResponse/:id', addResponsePage);
app.post('/addResponse/:id', addResponse);
app.post('/upvote', upvoteQues);
app.post('/downvote', downvoteQues);
app.post('/add', addQuestion);
app.post('/edit/:id', editQuestion);

app.get('/', getLoginPage);
app.get('/signup', getSignUpPage);
app.post('/', login);


app.post('/APIlogin', passport.authenticate("local"), APIlogin);
app.post('/signup', signup);
app.get('/logout', logout);
app.get('/UserData', getUserData);

app.get('/profile', profilePage);
app.get('/myQuestions', myQuestionsPage);
app.get('/editQues/:id', editQuesPage);
app.post('/editQues/:id', editQues);
app.get('/deleteQues/:id', deleteQues);
app.get('/myUpvotes', upVotedQuestionsPage);
app.get('/myResponses', myResponsePage)


userDB.sequelize.sync().then(function() {
    app.listen(port, () => {
        console.log(`Server running on port: ${port}`);
    });
  });

