

 function submit() {

  var emailInput = document.getElementById("email").value;
  var passwordInput =document.getElementById("password").value;

  var userData = {
    email: emailInput.trim(),
    password: passwordInput.trim()
  };

  if (!userData.email || !userData.password) {
    return;
  }

  // If we have an email and password we run the loginUser function and clear the form
  loginUser(userData.email, userData.password);
  emailInput.val("");
  passwordInput.val("");
};

// loginUser does a post to our "APIlogin" route and if successful, redirects us the the members page
function loginUser(email, password) {
  fetch("/APIlogin", {
    method: 'POST',
    email: email,
    password: password
  }).then(function(data) {
    window.location.replace(data);
    // If there's an error, log the error
  }).catch(function(err) {
    console.log(err);
  });
}
