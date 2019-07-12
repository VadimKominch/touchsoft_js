(function chat(){
    initializeChat();
    let text = document.getElementById("messagebox");
    let msg = document.getElementById("textbox");
    let sendButton = document.getElementById("send");
    let hideButton = document.getElementById("hide");
    sendButton.addEventListener("click", function () {
        
        let message = msg.value;
        let nowTime = new Date();
        let mesBlock = document.createElement("div");
        mesBlock.classList.add("msg-block");
        let timeBlock = document.createElement("div");
        let avatarBlock = document.createElement("div");
        let textMsgBlock = document.createElement("div");
        timeBlock.classList.add("time");
        avatarBlock.classList.add("avatar");
        textMsgBlock.classList.add("message");
        let time = ("0" + nowTime.getHours()).slice(-2) + ":" + ("0" + nowTime.getMinutes()).slice(-2);
        msg.value = "";
        /*let textNode = document.createTextNode(time + " Me: " + message);
        text.appendChild(textNode);*/
        let timeNode = document.createTextNode(time);
        let avatarNode = document.createTextNode("Me:");
        let messageNode = document.createTextNode(message);
        timeBlock.appendChild(timeNode);
        avatarBlock.appendChild(avatarNode);
        textMsgBlock.appendChild(messageNode);
        mesBlock.appendChild(timeBlock);
        mesBlock.appendChild(avatarBlock);
        mesBlock.appendChild(textMsgBlock);
        text.appendChild(mesBlock);
        //add logic for sending message
    });
    hideButton.addEventListener("click",function(){
        document.getElementById("wrapper").style.display = "none";
        document.getElementById("chatheader").classList.add("hide");
        document.getElementById("chatheader").classList.remove("show");
        document.getElementById("hide").classList.add("hide");
        document.getElementById("hide").classList.remove("show");
    });

})();



function initializeChat(){
    console.log(1);
    var newChatWindow = document.createElement("div");
    var hideChatWindow = document.createElement("div");
    var chatHeader = document.createElement("div");
    var inputBox = document.createElement("textarea");
    //chatheader and hideButton must be on the same line not being removed
    var hideButton = document.createElement("button");
    var sendButton = document.createElement("button");
    var messageBox = document.createElement("div");
    hideChatWindow.appendChild(hideButton);
    hideChatWindow.appendChild(chatHeader);
    hideButton.classList.add("show");
    chatHeader.classList.add("show");
    newChatWindow.appendChild(inputBox);
    newChatWindow.appendChild(sendButton);
    newChatWindow.appendChild(messageBox);
    document.body.appendChild(newChatWindow);
    document.body.appendChild(hideChatWindow);
    hideChatWindow.id = "hidden-block";
    newChatWindow.id = "wrapper";
    chatHeader.id = "chatheader";
    inputBox.id = "textbox";
    hideButton.id = "hide";
    sendButton.id = "send";
    messageBox.id = "messagebox";
    chatHeader.innerHTML = "ChatName";
    sendButton.innerHTML = "Send";
    hideButton.innerHTML = "_";
    //check if set id as code below is good practice
};