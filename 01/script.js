(function chat(){
    initializeChat();
    let text = document.getElementById("messagebox");
    let msg = document.getElementById("textbox");
    let sendButton = document.getElementById("send");
    sendButton.addEventListener("click", function () {
        let message = msg.value;
        let nowTime = new Date();
        let time = ("0" + nowTime.getHours()).slice(-2) + ":" + ("0" + nowTime.getMinutes()).slice(-2);
        msg.value = "";
        let textNode = document.createTextNode(time + " Me: " + message);
        text.appendChild(textNode);
        let linebreak = document.createElement('br');
        text.appendChild(linebreak);
    });
})();



function initializeChat(){
    var newChatWindow = document.createElement("div");
    var chatHeader = document.createElement("div");
    var inputBox = document.createElement("textarea");
    //chatheader and hideButton must be on the same line not being removed
    var hideButton = document.createElement("button");
    var sendButton = document.createElement("button");
    var messageBox = document.createElement("div");

    newChatWindow.appendChild(chatHeader);
    newChatWindow.appendChild(inputBox);
    newChatWindow.appendChild(hideButton);
    newChatWindow.appendChild(sendButton);
    newChatWindow.appendChild(messageBox);
    document.body.appendChild(newChatWindow);
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