var chat = (function () {
    let config = {};
    let id = 15;
    function setConfig(obj) {
        config = obj;
        config.userName="";
        setId();
    };

    function startChat() {
            let chatStyle = document.createElement("link");
            //chatStyle.href = "https://gitcdn.link/repo/VadimKominch/fdfa07dcf877fa5a388dc3a0c86771bd/raw/2a4b956bd511638e6a6ef6e316e2075b42b1720a/style.css";
            chatStyle.href="style.css";
            chatStyle.rel="stylesheet";
            document.head.appendChild(chatStyle);
            let state;
            if (localStorage.getItem("state") === undefined) {
                localStorage.setItem("state", false);
                state = false;
            }
            else {
                state = JSON.parse(localStorage.getItem("state"));
            }
            (function chat() {
                initializeChat(state);
                let text = document.getElementById("messagebox");
                let msg = document.getElementById("textbox");
                let sendButton = document.getElementById("send");
                let hideButton = document.getElementById("hide");
                sendButton.addEventListener("click", function () {
                    if(config.requireName){
                        while(config.userName===""){
                            config.userName=prompt("Enter your name","");
                        }
                    }
                    let message = msg.value;
                    msg.value = "";
                    addMessage(message, "Me", getTime(), text);
                    saveToLocalStorage(message, "Me", getTime());
                    savetoDb(message,config.userName||"User",getTime());
                    //set Timeout for emulating delay before answering
                    setTimeout(function () {
                        botAnswer(message, text);
                    }, 15000);
                });
                if(config.isMinimize){
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
                        localStorage.setItem("state", state);
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

    function restoreMsgHistory(HTMLElement) {
        let messages = JSON.parse(localStorage.getItem("messages"));
        messages.forEach(function (element) {
            addMessage(element.msg, element.role, element.date, HTMLElement);
        });
    }

    function saveToLocalStorage(msg, role, date) {
        let msgObj = {};
        let messages;
        msgObj.date = date;
        msgObj.msg = msg;
        msgObj.role = role;
        if (localStorage.messages) {
            messages = JSON.parse(localStorage.getItem("messages"));
        } else {
            messages = [];
        }
        messages.push(msgObj);
        localStorage.setItem("messages", JSON.stringify(messages));
    }
    
    function getTime() {
        let nowTime = new Date();
        let time = ("0" + nowTime.getHours()).slice(-2) + ":" + ("0" + nowTime.getMinutes()).slice(-2);
        return time;
    }

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
        if(config.position==="left"){
            chatWindow.style.right="";
            chatWindow.style.left="28px";
        } else {
            chatWindow.style.left="";
            chatWindow.style.right="28px";    
        }
        //header name
        chatHeader.innerHTML = config.chatTitle;
        sendButton.innerHTML = "Send";
        hideButton.innerHTML = "_";
        chatHeader.classList.add("no-select");
        if(config.isDraggable){
            dragElement(chatWindow);
        }
            
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
        if (localStorage.getItem("messages")) {
            messageBox.innerHTML = "";
            restoreMsgHistory(messageBox);
        }
        //check if set id as code below is good practice
    };
    
    
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
        if(config.displayingTime){
            mesBlock.appendChild(timeBlock);
        }
        mesBlock.appendChild(avatarBlock);
        mesBlock.appendChild(textMsgBlock);
        HTMLElement.appendChild(mesBlock);
    }
//bug with refreshing window
    function botAnswer(msg, htmlMsgBlock) {
        let botAnswerMessage = msg.toUpperCase();
        addMessage(botAnswerMessage, config.botName||"Bot", getTime(), htmlMsgBlock);
        saveToLocalStorage(botAnswerMessage, config.botName||"Bot", getTime());
        savetoDb(botAnswerMessage,config.botName||"Bot",getTime());
    }
    
//request for saving data to database
    function savetoDb(msg, role, date){
        if(config.network==="XHR"){
            let req = new XMLHttpRequest();
            req.open("POST",config.chatUrl +"/"+ config.userId + '/messages.json',true);
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
            fetch(config.chatUrl +"/"+ config.userId + '/messages.json', {
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

    function setId(){
        fetch(config.chatUrl + '/info.json', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
        .then(function(response){
            return response.json();
        })
        .then(function(value){
            console.log(value.id);
            config.userId = value.id;
            //updateUserId(value.id++);
            let newNum = value.id+1;
            return newNum;
        })
         .then(updateUserId)
    }


    function updateUserId(value){
        fetch(config.chatUrl + '/info.json', {
            method: 'PUT',
            body: JSON.stringify(
                {
                    id:value,
                },
            ),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
    }

    function initDbConnection(){
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