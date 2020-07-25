function re_init(error){
    setTimeout(function(){
        re_init_settings();
        window.location.href = "login.html"
    }, 5000);
    document.getElementById("mainpage").innerText = `Error occured: ${error} || Reseting settings... || Please wait for 5 seconds!`
}

var remote = require('electron').remote;
var win = remote.getCurrentWindow();
var operator = win.webContents.session;

var updatecheck = document.getElementById("updatecheck");
var systrayobj = document.getElementById("systraycheck");
var devmodecheck = document.getElementById("devmodecheck");

var chat_notify = document.getElementById("chat-notify")
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
function switchchatnotify(){
    setSubVal("chatsettings", "notify", !getSubVal("chatsettings", "notify"))
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

    chat_notify.checked = getSubVal("chatsettings", "notify")
    chat_sendonreturn.checked = getSubVal("chatsettings", "sendonreturn")
    for(e of chat_colorobjs){
        e.style.backgroundColor = getSubVal("chatsettings", e.id)
    }

    update()
} catch (error) {
    re_init();
}

// Chat sound -------------------------------------------

var sound_switch = document.getElementById("chat-custsound");
var curr_sound = document.getElementById("chat-notifysound");
var sound_sel = document.getElementById("chat-notifysoundsel");
var curr_sel_sound = sound_sel.options[sound_sel.selectedIndex].value;

var norm_sound_div = document.getElementById("non-custsound");
var cust_sound_div = document.getElementById("cust-sound");

var cust_path_inp = document.getElementById("chat-customsoundin");
var cust_path_btn = document.getElementById("change_cust-sound");


sound_sel.addEventListener("change", function(){
    curr_sel_sound = sound_sel.options[sound_sel.selectedIndex].value;
});


try {
    sound_switch.checked = getSubVal("chatsettings", "sound_custom")
    norm_sound_div.hidden = sound_switch.checked
    cust_sound_div.hidden = !sound_switch.checked

    curr_sound.innerText = getSubVal("chatsettings", "sound_notify")
} catch (error) {
    re_init(error);
}

function switch_customsound(){
    setSubVal("chatsettings", "sound_custom", sound_switch.checked)
    norm_sound_div.hidden = sound_switch.checked
    cust_sound_div.hidden = !sound_switch.checked
}

function playselsound(){
    var audio = document.createElement('audio');
    audio.style.display = "none";
    audio.src = "./../static/audio/notifications/" + curr_sel_sound + ".mp3";
    audio.autoplay = true;
    audio.onended = function(){
        audio.remove()
    };
    document.body.appendChild(audio);
}

function applystandsound(){
    setSubVal("chatsettings", "sound_notify", curr_sel_sound)
    curr_sound.innerText = curr_sel_sound;
}