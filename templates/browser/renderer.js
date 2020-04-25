var back = document.getElementById('back')
var forward = document.getElementById('forward')
var refresh = document.getElementById('refresh')
var omni = document.getElementById('url')
var view = document.getElementById('view')
var home = document.getElementById("home")

function reloadView () {
    view.reload();
}

function backView () {
    view.goBack();
}

function forwardView () {
    view.goForward();
}

function updateURL (event) {
    if (event.keyCode == 13) {
        omni.blur();
        let val = omni.value;
        let https = val.slice(0, 8).toLowerCase();
        let http = val.slice(0, 7).toLowerCase();
        if (https === 'https://') {
            view.loadURL(val);
        } else if (http === 'http://') {
            view.loadURL(val);
        } else {
            if(val == "about:swcstart"){
                view.loadURL("file:///" + __dirname.replaceAll("\\", "/") + "/browser/index.html");
            }else{
                if(val.includes(".com") || val.includes(".de") || val.includes(".org") || val.includes(".net") || val.includes(".io")){
                    view.loadURL(`http://${val}`);
                }else{
                    view.loadURL(`http://www.google.com/search?q=${val}`);
                }
            }
        }
    }
}
function updateNav (event) {
    var src = view.src;
    if(src == "file:///" + __dirname.replaceAll("\\", "/") + "/browser/index.html"){
        src = "about:swcstart";
    }
    omni.value = src;
}

function toggledevtools() {
    if (view.isDevToolsOpened()) {
        view.closeDevTools();
    } else {
        view.openDevTools();
    }
}

function gohome(ev){
    view.loadURL("file:///" + __dirname.replaceAll("\\", "/") + "/browser/index.html");
}

function set_listeners(){
    try {
        omni.addEventListener('keydown', updateURL);
        view.addEventListener('did-finish-load', updateNav);
    } catch (error) {
        console.log(error)
        alert(error)
    }
}

try {
    set_listeners();
    updateNav();
} catch (error) {
    console.log(error);
    alert(error)
}
