

function upvote(elem) {
  var parentID = elem.parentNode.id;
  console.log('Upvote button was clicked' + parentID);

  fetch('/upvote', {
    method: 'POST',
    body: JSON.stringify({id: parentID }),
    headers: {
            "Content-Type": "application/json",
    }
  })
  .then(function(res) {
    if(res.ok) {
      console.log('Click was recorded');
      return;
    }
    throw new Error('Request failed.');
  })
  .catch(function(error) {
    console.log(error);
  });
}

function downvote(elem){
  var parentID = elem.parentNode.id;
  console.log('Downvote button was clicked' + parentID);

  fetch('/downvote', {
    method: 'POST',
    body: JSON.stringify({id: parentID }),
    headers: {
            "Content-Type": "application/json",
    }
  })
  .then(function(res) {
    if(res.ok) {
      console.log('Click was recorded');
      return;
    }
    throw new Error('Request failed.');
  })
  .catch(function(error) {
    console.log(error);
  });
}

function show2ndResponse(){
  const secondResponse = document.getElementById('2ndResponse');
  const firstButton = document.getElementById('firstBtn');
  const secondButton = document.getElementById('secondBtn');

  secondResponse.style.display = "block";
  firstButton.style.display = "none";
  secondButton.style.display = "block";
}

function show3rdResponse(){
  const thirdResponse = document.getElementById('3rdResponse');
  const secondButton = document.getElementById('secondBtn');

  thirdResponse.style.display = "block";
  secondButton.style.display = "none";
}

setInterval(function() {
  fetch('/ranking', {method: 'GET'})
    .then(function(response) {
      if(response.ok) return response.json();
      throw new Error('Request failed.');
    })
    .then(function(data) {
      
    })
    .catch(function(error) {
      console.log(error);
    });
}, 1000);