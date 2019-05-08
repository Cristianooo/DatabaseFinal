


  /*window.onload=function(){
  const upvoteBtn = document.getElementById('upvote');
  const downvoteBtn = document.getElementById('downvote');

  parentID = upvoteBtn.parentNode.id;


  upvoteBtn.addEventListener('click', function(e) {
    console.log('Upvote button was clicked' + parentID);
  });

  downvoteBtn.addEventListener('click', function(e) {
      console.log('Downvote button was clicked' + parentID);
    });
}*/

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