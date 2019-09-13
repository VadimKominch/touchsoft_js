let userWindow = document.getElementsByClassName("wind")[0];
let list = document.querySelector("#myMenu");
let messageBox = document.getElementById("user_messages");
let users = [];
let REQUEST_DELAY = 3000;
let OPERATOR_ROLE = "Operator";
let targetId;
let intervalRequest;

document.getElementsByClassName("button")[0].addEventListener("click", function () {
  messageBox.innerHTML = "";
  userWindow.style.display = "none";
  let childrenList = list.children;
  for (let i = 0; i < childrenList.length; i++) {
    childrenList[i].classList.remove("active");
  }
});

document.querySelector('#myFilter').addEventListener('keyup', filterUsers);
document.querySelector('#mySelect').addEventListener('change',sortUsers);

function getUsersList() {
  fetch(firebaseConfig.databaseURL + '/users.json', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(function (response) {
      return response.json();
    }).then(function (response) {
      if (users.length === response.length) {
        return [];
      } else {
        let old_length = users.length;
        users = response.slice();
        return users.slice(old_length);
      }
    })
    .then(function (value) {
      value.forEach(function (element) {
        createListElement(element.name, element.id);
      });
    });
}

//get messages from db and set it into message box area. Before inserting function clears space
function getMessagesList(userId) {
  fetch(firebaseConfig.databaseURL + '/' + userId + '/messages.json', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (value) {
      clearWindow(messageBox);
      return value;
    })
    .then(function (value) {
      for (prop in value) {
        addMessage(value[prop].message, value[prop].user, value[prop].date, messageBox);
      }
    });
}

//create li element in users list. Add click listener which set clicked li element as active
function createListElement(text, id) {
  let li = document.createElement("li");
  li.appendChild(document.createTextNode(text));
  //li.innerHTML = text;
  li.className = 'user-list-item';
  li.addEventListener("click", function () {
    targetId = id;
    let childrenList = list.children;
    for (let i = 0; i < childrenList.length; i++) {
      childrenList[i].classList.remove("active");
    }
    li.classList.toggle("active");
    document.getElementsByClassName("sendButton")[0].addEventListener("click", function () {
      let message = document.getElementById("operator_input").value;
      document.getElementById("operator_input").value = "";
      let time = getTime();
      sendMessageToDb(targetId, message, time);
      addMessage(message, OPERATOR_ROLE, time, messageBox);
    });
    clearInterval(intervalRequest);
    onclickList(targetId);
  });
  list.appendChild(li);

}

//function restore active window and set interval of getting requests to db to get new messages
function onclickList(id) {
  userWindow.style.display = "flex";
  intervalRequest = setInterval(function () {
    getMessagesList(id);
  }, REQUEST_DELAY);

}
//add new message to HTMLElement
function addMessage(msg, role, time, HTMLElement) {
  let mesBlock = document.createElement("div");
  mesBlock.classList.add("msg-block");
  let timeBlock = document.createElement("div");
  let avatarBlock = document.createElement("div");
  let textMsgBlock = document.createElement("div");
  timeBlock.classList.add("time");
  avatarBlock.classList.add("avatar");
  textMsgBlock.classList.add("message");
  let timeNode = document.createTextNode(time);
  let avatarNode = document.createTextNode(role + ":");
  let messageNode = document.createTextNode(msg);
  timeBlock.appendChild(timeNode);
  avatarBlock.appendChild(avatarNode);
  textMsgBlock.appendChild(messageNode);
  mesBlock.appendChild(timeBlock);
  mesBlock.appendChild(avatarBlock);
  mesBlock.appendChild(textMsgBlock);
  HTMLElement.appendChild(mesBlock);
}
//clear message box
function clearWindow(element) {
  element.innerHTML = "";
}
//get time
function getTime() {
  let nowTime = new Date();
  let time = ("0" + nowTime.getHours()).slice(-2) + ":" + ("0" + nowTime.getMinutes()).slice(-2);
  return time;
}

//save message in database
function sendMessageToDb(userId, msg, date) {
  fetch(firebaseConfig.databaseURL + "/" + userId + '/messages.json', {
    method: 'POST',
    body: JSON.stringify(
      {
        user: OPERATOR_ROLE,
        message: msg,
        date: date,
      },
    ),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
}


function filterUsers(e) {
  const text = e.target.value.toLowerCase();
  document.querySelectorAll('.user-list-item').forEach(function (user) {
      const item = user.firstChild.textContent;
      if (item.toLowerCase().indexOf(text) != -1) {
        user.style.display = 'block';
      } else {
        user.style.display = 'none';
      }
  });
}

function sortUsers(){
  Array.from(list.getElementsByTagName("LI"))
  .sort((a, b) => a.textContent.localeCompare(b.textContent))
  .forEach(li => list.appendChild(li));
}


setInterval(function () {
  getUsersList();
}, REQUEST_DELAY);
