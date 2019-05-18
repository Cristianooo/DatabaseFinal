
var path = require("path");
//
// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports =  {
    getLoginPage: (req, res) => {
        if(req.user){
            res.redirect("/questions");
        }
        else{
            res.render('index.ejs', {
                title: "Login", 
                message: ''
            });
        }
    },
    login: (req, res) => {
        let message = '';
        let username = req.body.username;
        let password = req.body.password;

        let userQuery = "SELECT * FROM `Users` WHERE Username = ? AND Password = ?" ;

        db.query(userQuery,
            [
                username,
                password
            ],
             (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length !=1) {
                message = 'Account not found';
                res.render('index.ejs', {
                    message,
                    title: "JustAsk!"
                });
            } else {
                res.redirect('/questions');

            }
        });
    },
    getSignUpPage: (req, res)=> {
        res.render('signUp.ejs', {
            title: "Sign Up!",
        })
    },
    signUp: (req, res)=> {
        let message = '';
        let firstname = req.body.firstName;
        let lastname = req.body.lastName;
        let email = req.body.email;
        let username = req.body.username;
        let password = req.body.password;

        let signupQuery = "INSERT INTO USERS(FirstName, LastName, Username, Email, Password, createdAt, updatedAt) VALUES(?,?,?,?,?,NOW(),NOW());";

        db.query(signupQuery,
            [
                firstname,
                lastname,
                email,
                username,
                password

            ],
            
            (err, result) => {
            if (err) {
                return res.status(500).send('User already found. Please login');
            }
            res.redirect('/questions');

            
        });
    }
    
};