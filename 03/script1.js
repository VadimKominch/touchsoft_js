var chat = (function () {
    //config to customize message window
    let config = {};
    //delay for refetching requests from firebase db
    let FETCH_DELAY = 3000;

    let last_update_time;
    //set config function
    function setConfig(obj) {
        config = obj;
        //config.userName = "";
        setId();
    };

    //sessionStorage work functions
    //getting message history from local storage
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
});