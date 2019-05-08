
var path = require("path");
//
// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");
//
module.exports =  {
    getLoginPage: (req, res) => {
        if(req.user){
            res.redirect("/players");
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
        console.log(req.body.username + ' ' + req.body.password);

        let userQuery = "SELECT * FROM `Users` WHERE Username = '" + username + "' AND Password = '" + password+ "'" ;

        db.query(userQuery, (err, result) => {
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
                res.redirect('/players');

            }
        });
    }
};