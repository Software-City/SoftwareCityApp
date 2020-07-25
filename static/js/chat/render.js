var message_sent = `
<div class="media p-3 sent">
    <div class="media-body">
        <h6>{{name}}</h6>
        <p>{{message}}</p>
    </div>
</div>
`
var message_recv = `
<div class="media p-3">
    <div class="media-body">
        <h6>{{name}}</h6>
        <p>{{message}}</p>
    </div>
</div>
`

var messages = {
    "messages": [
        {"sender": "1", "text": "lol"},
        {"sender": "2", "text": "lal"},
        {"sender": "1", "text": "lol"},
        {"sender": "2", "text": "lal"},
        {"sender": "1", "text": "lol"},
        {"sender": "2", "text": "lal"}
    ]
}


var remote = require("electron").remote
var win = remote.getCurrentWindow()


var navbar = document.getElementById("navbar")
var custom_navbar = document.getElementById("custom-navbar")
var navbarlayout = document.getElementById("navbarlayout")
var sidebar = document.getElementById("sidebar")
var custom_sidebar = document.getElementById("custom-sidebar")
var sidebarlayout = document.getElementById("sidebarlayout")

var chatarea = document.getElementById("chatwin-main")
var inputtext = document.getElementById("inputtext")

custom_navbar.innerHTML = navbarlayout.innerHTML
navbar.hidden = true;
custom_navbar.hidden = false;

custom_sidebar.innerHTML = sidebarlayout.innerHTML
sidebar.hidden = true;
custom_sidebar.hidden = false;

function goback(){
    navbar.hidden = false;
    custom_navbar.hidden = true;
    sidebar.hidden = false;
    custom_sidebar.hidden = true;
    var elem = document.getElementsByClassName("sidebarclass")
    loadpage(elem[3], "dash.asp")
}

function showEmojiSelector(){
    var { app } = require("electron").remote
    app.showEmojiPanel()
}

var buts = document.getElementsByClassName("custom-sidebarclass");
function setConfig(){
    document.documentElement.style.setProperty("--chatconfig-personal_namecolor", getSubVal("chatsettings", "personal_namecolor"))
    document.documentElement.style.setProperty("--chatconfig-personal_textcolor", getSubVal("chatsettings", "personal_textcolor"))
    document.documentElement.style.setProperty("--chatconfig-other_namecolor", getSubVal("chatsettings", "other_namecolor"))
    document.documentElement.style.setProperty("--chatconfig-other_textcolor", getSubVal("chatsettings", "other_textcolor"))
}


function sendtoscreen(msg, usr){
    if(usr == getVal("credentials")[0]){
        chatarea.innerHTML += message_sent.replace("{{name}}", getVal("credentials")[0]).replace("{{message}}", msg)
    }else{
        chatarea.innerHTML += message_recv.replace("{{name}}", usr).replace("{{message}}", msg)
    }
    $(document).scrollTop($(document).height());
}

inputtext.addEventListener("keydown", function(ev){
    if(ev.keyCode===13 && getSubVal("chatsettings", "sendonreturn")){
        send()
    }
});

function set_chatwin(msgs){
    if(CurrPage != "chat.asp"){return}
    if(msgs.user==getVal("credentials")[0]){
        chatarea.innerHTML = ""
        for (x of msgs.li){
            sendtoscreen(x.message, x.user)
        }
        $("html, body").animate({scrollTop: $('html, body').get(0).scrollHeight}, 500);
    }
}

function loadchat(btn){
    for(let e of buts){e.classList.remove("active")}
    var chat = btn.getAttribute("chat")
    btn.classList.add("active")
    document.getElementById("chatwin-nav-chatname").innerText = btn.innerText
    askformsgs(getVal("credentials")[0])
}

setTimeout(function(){
    setConfig();
    loadchat(buts[0])
}, 500)