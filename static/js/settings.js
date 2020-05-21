var remote = require('electron').remote;
var win = remote.getCurrentWindow();
var operator = win.webContents.session;

var updatecheck = document.getElementById("updatecheck");
var systrayobj = document.getElementById("systraycheck");
var devmodecheck = document.getElementById("devmodecheck");

var chat_sendonreturn = document.getElementById("chat-sendonreturn");
var chat_colorobjs = document.getElementsByClassName("applychatcolor");

function switchupdate(){
    setVal("autoupdate", !getVal("autoupdate"));
    var autoUpdater = require('electron-updater');
    autoUpdater.autoDownload = getVal("autoupdate");
}
function switchtray(){
    setVal("systemtray", !getVal("systemtray"));
}
function switchdevmode(){
    setVal("devMode", !getVal("devMode"));
    if(confirm("You have to restart for this to take effect!")){remote.app.relaunch();remote.app.exit()}
}
function switchsendonreturn(){
    setSubVal("chatsettings", "sendonreturn", !getSubVal("chatsettings", "sendonreturn"))
}

function update(){
    operator.getCacheSize().then(function(result){document.getElementById("cachesize").innerText = Math.round(result/(1024)) + " KB"})
    document.getElementById("currtheme").innerHTML = getVal("theme")
    document.getElementById("serverdefaultpage").innerHTML = getVal('serverstartpage')
    document.getElementById("gendefpage").innerHTML = getVal("defstartpage")
    document.getElementById("clouddefaultpage").innerHTML = getVal("cloudstartpage")
}


function openexplorer(exp){
    const {shell} = require('electron')
    if(exp == "cachedir"){
        shell.openItem(cachedir)
    }else{

    }
}

function clearCache(){
    operator.clearCache().then(()=>{
        operator.clearAuthCache().then(()=>{
        operator.clearHostResolverCache().then(()=>{
            operator.clearStorageData().then(()=>{
            win.webContents.clearHistory()
            window.location.href = "login.html";
            });
        });
        });
    });
}

function setChatColor(key){
    var picker = document.getElementById(`colorholder-${key}`);
    picker.click()
    picker.addEventListener("input", function(){
        document.getElementById(key).style.backgroundColor = picker.value
        setSubVal("chatsettings", key, picker.value)
    });
}

try {
    document.getElementById("version").innerText = remote.app.getVersion()
    updatecheck.checked = getVal("autoupdate");
    systrayobj.checked = getVal("systemtray");
    devmodecheck.checked = getVal("devMode")

    chat_sendonreturn.checked = getSubVal("chatsettings", "sendonreturn")
    for(e of chat_colorobjs){
        e.style.backgroundColor = getSubVal("chatsettings", e.id)
    }

    update()
} catch (error) {
    setTimeout(function(){
        re_init_settings();
        window.location.href = "login.html"
    }, 5000);
    document.getElementById("mainpage").innerText = `Error occured: ${error} || Reseting settings... || Please wait for 5 seconds!`
    
}