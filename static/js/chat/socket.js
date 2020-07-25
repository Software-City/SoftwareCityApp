if(socket != undefined){
    inputtext.disabled = false
}else{
    alert("Socket error; no socket present; try restarting")
}

function send(){
    var message = inputtext.value
    if(message == ""){return}
    var string = "";
    for(var x of message){
        if(x.charCodeAt(0)==10){
            x = "<br>"
        }
        string += x;
    }
    if(string.includes("http://")||string.includes("https://")){
        var arr = string.split(" ")
        string = ""
        for(var x of arr){
            if(x.includes("http://")||x.includes("https://")){
                x = `<a onclick="openwebpage(this.getAttribute('reference'))" href="#" reference="${x}">${x}</a>`
                string += x + " "
            }else{
                string += x
            }
        }
    }
    string.replace('"', "")
    try {
        socket.emit("xmit", {
            user: getVal("credentials")[0],
            message: string
        });
        inputtext.value = ""
    } catch (error) {
        throw error
    }
    
}

function askformsgs(user){
    socket.emit("xmit-msgs", user)
}