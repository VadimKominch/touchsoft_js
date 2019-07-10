(function chat(){
    
})();



(function initializeChat(){
    var newChatWindow = document.createElement("div");
    var chatHeader = document.createElement("div");
    var inputBox = document.createElement("textarea");
    
    var hideButton = document.createElement("button");
    var sendButton = document.createElement("button");
    newChatWindow.appendChild(chatHeader);
    newChatWindow.appendChild(inputBox);
    newChatWindow.appendChild(hideButton);
    newChatWindow.appendChild(sendButton);
    document.body.appendChild(newChatWindow);
    newChatWindow.id = "wrapper";
})();