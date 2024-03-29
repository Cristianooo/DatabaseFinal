var bcrypt = require("bcrypt-nodejs");
//
// Creating our User model
//Set it as export because we will need it required on the server
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    FirstName:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    LastName:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    Username:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

    
  // Creating a custom method for our User model. 
  //This will check if an unhashed password entered by the 
  //user can be compared to the hashed password stored in our database
  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
  // Hooks are automatic methods that run during various phases of the User Model lifecycle
  // In this case, before a User is created, we will automatically hash their password
  User.beforeCreate(user => {
    user.Password = bcrypt.hashSync(
      user.Password,
      bcrypt.genSaltSync(10),
      null
    );
  });
  return User;
};