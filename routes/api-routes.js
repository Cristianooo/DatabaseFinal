var db = require("../models");
var path = require("path");
//
module.exports= {

  APIlogin:(req, res)=> {
    res.json("/questions");
  },
  signup: (req, res)=>{
    db.User.create({                          //Creates new user after signup button is clicked. All passwords are hashed thanks to our sequelize model
      FirstName: req.body.firstName,
      LastName: req.body.lastName,
      Username: req.body.username,
      Email: req.body.email,
      Password: req.body.password
    }).then(function() {
      res.redirect(307, '/APIlogin');
    }).catch(function(err) {
      console.log(err);
      res.json(err);
    });
  },
  logout: (req, res)=> {
    req.logout();
    res.redirect("/");
  },
  getUserData: (req, res)=>{
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    }
    else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  }
} 
