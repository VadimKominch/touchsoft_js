window.onload = function () {
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
            let message = msg.value;
            msg.value = "";
            addMessage(message, "Me", getTime(), text);
            saveToLocalStorage(message, "Me", getTime());
            //set Timeout for emulating delay before answering
            setTimeout(function () {
                botAnswer(message, text);
            }, 15000);
        });
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
    })();
}


function initializeChat(state) {
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
    //chatWindow.appendChild(hideChatWindow);
    document.body.appendChild(chatWindow);
    //document.body.appendChild(hideChatWindow);
    chatWindow.id = "main_block";
    newChatWindow.id = "wrapper";
    chatHeader.id = "chatheader";
    inputBox.id = "textbox";
    hideButton.id = "hide";
    sendButton.id = "send";
    messageBox.id = "messagebox";
    chatHeader.innerHTML = "ChatName";
    sendButton.innerHTML = "Send";
    hideButton.innerHTML = "_";
    chatHeader.classList.add("no-select");
        dragElement(chatWindow);
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
    //dragElement(newChatWindow);
    //check if set id as code below is good practice
};

function botAnswer(msg, htmlMsgBlock) {
    let botAnswerMessage = msg.toUpperCase();
    addMessage(botAnswerMessage, "Bot", getTime(), htmlMsgBlock);
    saveToLocalStorage(botAnswerMessage, "Bot", getTime());
}

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


function restoreMsgHistory(HTMLElement) {
    let messages = JSON.parse(localStorage.getItem("messages"));
    messages.forEach(function (element) {
        addMessage(element.msg, element.role, element.date, HTMLElement);
    });
}

function getTime() {
    let nowTime = new Date();
    let time = ("0" + nowTime.getHours()).slice(-2) + ":" + ("0" + nowTime.getMinutes()).slice(-2);
    return time;
}



//drag'n'drop functions
//z-index of chatheader must be higher than z-index of wrapper
function dragElement(element) {
    let pos1, pos2, pos3, pos4;
    document.getElementById("chatheader").onmousedown = dragMouseDown;

    function dragMouseDown(e){
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
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
      }
}