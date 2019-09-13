let from = "Vasya";
let text = "Hello";
date = new Date();
counter = 0;
let id = 12;
//fetch
function sendMessageFetch(msg,user) {
    fetch(firebaseConfig.databaseURL +"/"+ id + '/messages.json', {
        method: 'POST',
        body: JSON.stringify(
            {
                user: user,
                message: msg,
                date: new Date(),
            },
        ),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });
}
//XML Http Request
function sendMessageXHR(msg,user){
    let req = new XMLHttpRequest();
    req.open("POST",firebaseConfig.databaseURL +"/"+ id + '/messages.json',true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(
        JSON.stringify(
            {
                user: user,
                message: msg,
                date: new Date(),
            },
        )    
    );
}
//Store id of all new users on server to set new one in two operations
function setIdInDb(){
    fetch(firebaseConfig.databaseURL +"/"+ id + '/id.json', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
        .then(console.log(response));
}




function sendUser(user) {
    fetch(firebaseConfig.databaseURL  +"/"+ id + '/.json', {
        method: 'POST',
        body: JSON.stringify(
            {
                user: user,
                id: counter++,
            },
        ),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });
}

sendMessageXHR("Hello","Petya");
sendMessageXHR("Hi","Petya");
//sendUser("Vasya");
sendMessageXHR("Hi","Vasya");
//sendUser("Petya");

fetch(firebaseConfig.databaseURL +"/"+ id  + '/messages.json', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(function(response) {
      return response.json();
    })
    .then(console.log);

