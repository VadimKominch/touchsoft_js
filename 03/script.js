var chat = (function () {
    let config = {};
    let FETCH_DELAY=3000;
    let last_update_time;
    function setConfig(obj) {
        config = obj;
        //config.userName = "";
        setId();
    };

    function startChat() {
        let chatStyle = document.createElement("link");
        chatStyle.href = "style.css";
        chatStyle.rel = "stylesheet";
        document.head.appendChild(chatStyle);
        let state;
        if (sessionStorage.getItem("state") === undefined) {
            sessionStorage.setItem("state", false);
            state = false;
        }
        else {
            state = JSON.parse(sessionStorage.getItem("state"));
        }
        //setUserInDb(config.userName);
        (function chat() {
            initializeChat(state);
            let msg = document.getElementById("textbox");
            let text = document.getElementById("messagebox");
            let sendButton = document.getElementById("send");
            let hideButton = document.getElementById("hide");
            setInterval(function () {
                getOperatorMessages(text);
            }, FETCH_DELAY);
            sendButton.addEventListener("click", function () {
                let message = msg.value;
                msg.value = "";
                last_update_time = getTime();
                addMessage(message, "Me",last_update_time , text);
                saveToSessionStorage(message, "Me",last_update_time );
                savetoDb(message, config.userName, last_update_time);
                //set Timeout for emulating delay before answering
                setTimeout(function () {
                    botAnswer(message, text);
                }, 15000);
            });
            if (config.isMinimize) {
                hideButton.addEventListener("click", function () {
                    state = !state;
                    if (state) {
                        document.getElementById("wrapper").style.display = "block";
                    }
                    else {
                        document.getElementById("wrapper").style.display = "none";
                    }
                    document.getElementById("chatheader").classList.toggle("hide");
                    document.getElementById("hide").classList.toggle("hide");
                    document.getElementById("chatheader").classList.toggle("show");
                    document.getElementById("hide").classList.toggle("show");
                    sessionStorage.setItem("state", state);
                });
            }
        })();
    };
    return {
        startChat: startChat,
        initChat: setConfig
    };


    //drag'n'drop functions
    //z-index of chatheader must be higher than z-index of wrapper
    function dragElement(element) {
        let pos1, pos2, pos3, pos4;
        document.getElementById("chatheader").onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    //sessionStorage work functions
    //getting message history from session storage
    function restoreMsgHistory(HTMLElement) {
        let messages = JSON.parse(sessionStorage.getItem("messages"));
        messages.forEach(function (element) {
            addMessage(element.msg, element.role, element.date, HTMLElement);
        });
    }
    //save message history to session storage
    function saveToSessionStorage(msg, role, date) {
        let msgObj = {};
        let messages;
        msgObj.date = date;
        msgObj.msg = msg;
        msgObj.role = role;
        if (sessionStorage.messages) {
            messages = JSON.parse(sessionStorage.getItem("messages"));
        } else {
            messages = [];
        }
        messages.push(msgObj);
        sessionStorage.setItem("messages", JSON.stringify(messages));
    }
    //getting time function
    function getTime() {
        let nowTime = new Date();
        let time = ("0" + nowTime.getHours()).slice(-2) + ":" + ("0" + nowTime.getMinutes()).slice(-2);
        return time;
    }
    //function which create window for chat
    function initializeChat(state) {
        initDbConnection();
        let chatWindow = document.createElement("div");
        let newChatWindow = document.createElement("div");
        let chatHeader = document.createElement("div");
        let inputBox = document.createElement("textarea");
        //chatheader and hideButton must be on the same line not being removed
        let hideButton = document.createElement("button");
        let sendButton = document.createElement("button");
        let messageBox = document.createElement("div");
        chatWindow.appendChild(hideButton);
        chatWindow.appendChild(chatHeader);
        newChatWindow.appendChild(inputBox);
        newChatWindow.appendChild(sendButton);
        newChatWindow.appendChild(messageBox);
        chatWindow.appendChild(newChatWindow);
        document.body.appendChild(chatWindow);
        chatWindow.id = "main_block";
        newChatWindow.id = "wrapper";
        chatHeader.id = "chatheader";
        inputBox.id = "textbox";
        hideButton.id = "hide";
        sendButton.id = "send";
        messageBox.id = "messagebox";
        chatWindow.classList.add(config.cssClass);
        if (config.position === "left") {
            chatWindow.style.right = "";
            chatWindow.style.left = "28px";
        } else {
            chatWindow.style.left = "";
            chatWindow.style.right = "28px";
        }
        //header name
        chatHeader.innerHTML = config.chatTitle;
        sendButton.innerHTML = "Send";
        hideButton.innerHTML = "_";
        chatHeader.classList.add("no-select");
        if (config.isDraggable) {
            dragElement(chatWindow);
        }
        //check window state
        if (state) {
            newChatWindow.style.display = "block";
            chatHeader.classList.add("show");
            hideButton.classList.add("show");
        }
        else {
            newChatWindow.style.display = "none";
            chatHeader.classList.add("hide");
            hideButton.classList.add("hide");
        }
        if (sessionStorage.getItem("messages")) {
            messageBox.innerHTML = "";
            restoreMsgHistory(messageBox);
        }
        //check if set id as code below is good practice
    };

    //add message to HTML block element to represent
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
        if (config.displayingTime) {
            mesBlock.appendChild(timeBlock);
        }
        mesBlock.appendChild(avatarBlock);
        mesBlock.appendChild(textMsgBlock);
        HTMLElement.appendChild(mesBlock);
    }
    //bug with refreshing window
    function botAnswer(msg, htmlMsgBlock) {
        let botAnswerMessage = msg.toUpperCase();
        addMessage(botAnswerMessage, config.botName || "Bot", getTime(), htmlMsgBlock);
        saveToSessionStorage(botAnswerMessage, config.botName || "Bot", getTime());
        savetoDb(botAnswerMessage, config.botName || "Bot", getTime());
    }


    //firebase db work functions
    //request for saving data to database(two methods to send request(XHR and fetch))
    function savetoDb(msg, role, date) {
        if (config.network === "XHR") {
            let req = new XMLHttpRequest();
            req.open("POST", config.chatUrl + "/" + config.userId + '/messages.json', true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.send(
                JSON.stringify(
                    {
                        user: role,
                        message: msg,
                        date: date,
                    },
                )
            );
        } else {
            fetch(config.chatUrl + "/" + config.userId + '/messages.json', {
                method: 'POST',
                body: JSON.stringify(
                    {
                        user: role,
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
    }
    //set id function(should be replace by set new user in db)
    function setId() {
        fetch(config.chatUrl + '/info.json', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (value) {
                config.userId = value.id;
                return value.id + 1;
            })
            .then(updateUserId)
            .then(function () {
                //request for getting name in requreName case
                if (config.requireName) {
                    //create own prompt window
                    config.userName = sessionStorage.getItem('name')?sessionStorage.getItem('name'):"";
                    while (config.userName === "") {
                        let tempName = prompt("Enter your name", "");
                        config.userName = tempName?tempName:"";
                    }
                    sessionStorage.setItem('name',config.userName);
                }
                else {
                    config.userName = "User" + config.userId;
                    sessionStorage.setItem('name',config.userName);
                }
            }).then(setUserInDb);
    }

    //update user id function
    function updateUserId(value) {
        fetch(config.chatUrl + '/info.json', {
            method: 'PUT',
            body: JSON.stringify(
                {
                    id: value,
                },
            ),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
    }
    //three parameters for mesuring user online and chat state
    function setUserInDb() {
        fetch(config.chatUrl + "/users/" + config.userId + '.json', {
            method: 'PUT',
            body: JSON.stringify(
                {
                    id:config.userId,
                    name: config.userName,
                    windowState:sessionStorage.getItem('state'),
                    //lastOnline:
                },
            ),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
    }
    function updateWindowState(state) {
        fetch(config.chatUrl + "/users/" + config.userId + '.json', {
            method: 'PUT',
            body: JSON.stringify(
                {
                    windowState:sessionStorage.getItem('state'),
                    //lastOnline:
                },
            ),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
    }

    function getOperatorMessages(HTMLElement){
        fetch(config.chatUrl + "/" + config.userId + '/messages.json', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then(function (response) {
                return response.json();
            })
            .then(function(response){
                for(prop in response){
                    if(response[prop].user==="Operator" && last_update_time<=response[prop].date){
                        addMessage(response[prop].message, response[prop].user, getTime(), HTMLElement);
                    }                      
                  }
            });
    }

    function changeWindowState() {
        fetch(config.chatUrl + "/users/" + config.userId + '/windowState.json', {
            method: 'PUT',
            body: JSON.stringify(
                {
                    id:config.userId,
                    name: config.userName,
                    windowState:sessionStorage.getItem('state'),
                    //lastOnline:
                },
            ),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
    }

    function initDbConnection() {
        var firebaseConfig = {
            apiKey: "AIzaSyCgFgMYLljkcHcXFATzdLNF5592aEYWRLY",
            authDomain: "chat-be318.firebaseapp.com",
            databaseURL: config.chatUrl,
            projectId: "chat-be318",
            storageBucket: "chat-be318.appspot.com",
            messagingSenderId: "857426828664",
            appId: "1:857426828664:web:2d120603d48ce514"
        };
        firebase.initializeApp(firebaseConfig);
    }
}());