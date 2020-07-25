var { ipcRenderer } = require("electron")
var softwareLogo = process.platform === "win32" ? "./../static/logos/logo.ico" : "./../static/logos/logo.png"

if(socket===undefined){
    // var socket = io("http://software-city.org:8080")
    var socket = io("http://localhost:8080")
    console.log("newconn")
}

socket.on('connect', function(){
    socket.emit('connected', {
        data: 'Connected',
        user: getVal("credentials")[0]
    });
});
ipcRenderer.on("ss-endconn", function(){
    socket.emit("disconnected", {
        data: 'Disconnected',
        user: getVal("credentials")[0]
    })
    socket.close()
    socket = undefined;
    ipcRenderer.send("ss-ended")
})


socket.on("error", function(er){
    alert(`Socket alert: ${er}`)
})


socket.on("user-conn", (user)=>{
    if(user != getVal("credentials")[0]){
        ipcRenderer.send("notify", `${user} is online`)
    }
})
socket.on("user-disconn", (user)=>{
    if(user != getVal("credentials")[0]){
        ipcRenderer.send("notify", `${user} is offline`)
    }
})




//chat section
socket.on('recx', function(msg){
    notifyer(msg.user, `New message from: ${msg.user}`, msg.message)
    if(CurrPage != "chat.asp"){return}
    sendtoscreen(msg.message, msg.user)
})
socket.on("recx-msgs", (msgs)=>{
    if(CurrPage != "chat.asp"){return}
    set_chatwin(msgs)
})