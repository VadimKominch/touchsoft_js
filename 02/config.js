window.onchange = function () {
    let code_div = document.getElementById("paste_code");
    let radio_value = checkRadioButtons();
    let checkBoxValues = checkCheckBox();
    let inputObj = checkInputs();
    inputObj["network"] = radio_value;
    inputObj["isMinimize"] = checkBoxValues[0];
    inputObj["isDraggable"] = checkBoxValues[1];
    inputObj["requireName"] = checkBoxValues[2];
    inputObj["displayingTime"] = checkBoxValues[3];
    
    code_div.innerHTML = "<br>" + "&ltscript src=\"https://www.gstatic.com/firebasejs/6.3.1/firebase-app.js\"&gt&lt/script&gt" + 
    "<br>" + "&ltscript src=\"script.js\"&gt&lt/script&gt" + "<br>" +"&ltscript&gt"+ "<br>"
    +"chat.initChat({"+ "<br>" +
    "chatTitle: "+"\""+ inputObj["chatTitle"]+"\""+ ",<br>" +
    "botName: "+"\""+inputObj["botName"]+"\""+ ",<br>" +
    "chatUrl: "+"\""+inputObj["chatUrl"]+"\""+ ",<br>" +
    "position: "+"\""+inputObj["position"]+"\""+ ",<br>" +
    "cssClass: "+"\""+inputObj["cssClass"]+"\""+ ",<br>" +
    "isMinimize: "+inputObj["isMinimize"] + ",<br>" +
    "isDraggable: "+inputObj["isDraggable"]+ ",<br>" +
    "requireName: "+inputObj["requireName"]+ ",<br>" +
    "displayingTime: "+inputObj["displayingTime"]+ ",<br>" +
    "network: "+"\""+inputObj["network"]+"\""+ "<br>" +
    "});" + "<br>" + 
    "chat.startChat();" + "<br>" + "&lt/script&gt";
};

function checkRadioButtons() {
    let radioButton = document.getElementsByName("network");
    let network_value = "XHR";
    for (let i = 0; i < radioButton.length; i++) {
        if (radioButton[i].checked) {
            network_value = radioButton[i].value;
        }
    }
    return network_value;
}

function checkCheckBox() {
    let checkbox = document.getElementsByClassName("checkboxList");
    let value_arr = [];
    for (let i = 0; i < checkbox.length; i++) {
        if (checkbox[i].checked) {
            value_arr[i] = true;
        } else {
            value_arr[i] = false;
        }
    }
    return value_arr;
}

function checkInputs(){
    let configObj = {};
    configObj["chatTitle"] = document.getElementsByName("chatHeader")[0].value===""?"title":document.getElementsByName("chatHeader")[0].value;
    configObj["botName"] = document.getElementsByName("botName")[0].value===""?"bot":document.getElementsByName("botName")[0].value;
    configObj["chatUrl"]  = document.getElementsByName("url")[0].value===""?"https://example.firebase.com":document.getElementsByName("url")[0].value;
    configObj["cssClass"] = document.getElementsByName("cssClass")[0].value===""?"chat-class":document.getElementsByName("cssClass")[0].value;
    let e = document.getElementsByName("position")[0];
    configObj["position"] = e.options[e.selectedIndex].value;
    return configObj;
}