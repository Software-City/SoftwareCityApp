String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

// Array.prototype.length

function show_alert(message, alert) {
    var alert_wrapper = document.getElementById("alert_wrapper");
    function destroy(){alert_wrapper.innerHTML=""}
    alert_wrapper.innerHTML = `
    <div id="alert" class="alert alert-${alert} alert-dismissible fade show" role="alert">
        <span>${message}</span>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close" onclick="reset_alert()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>`
}

function reset_alert(){
    var alert_wrapper = document.getElementById("alert_wrapper");
    alert_wrapper.innerHTML="";
}

function openExplorer(path){
    shell.openItem('folderpath')
}

function openwebpage(page){
    shell.openExternal(page)
}

function openinternalbrowser(url){
    tempdata.browserurloverride = url;
    loadpage(this, 'browser.asp')
}

function playSound(){
    var audio = document.createElement('audio');
    audio.style.display = "none";
    audio.src = `./../static/audio/notifications/${getSubVal("chatsettings", "sound_notify")}.mp3`;
    audio.autoplay = true;
    audio.onended = function(){
        audio.remove()
    };
    document.body.appendChild(audio);
}

function notifyer(user, title, body){
    var win = require("electron").remote.getCurrentWindow()
    var {ipcRenderer} = require("electron")
    if(user!=getVal("credentials")[0] && getSubVal("chatsettings", "notify")){
        if(!win.isFocused() || CurrPage != "chat.asp"){
            ipcRenderer.send("notify", title, body)
        }else{
            playSound()
        }
    }
}