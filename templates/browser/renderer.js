var back = document.getElementById('back')
var forward = document.getElementById('forward')
var refresh = document.getElementById('refresh')
var omni = document.getElementById('url')
var view = document.getElementById('view')
var home = document.getElementById("home")

var webview = document.querySelector('webview');
var webnav = document.getElementById("webnav")

webview.addEventListener("enter-html-full-screen", function(){
    webnav.hidden = true
    togglefullscreen(document.getElementById("togglefullscreen"), true)
})
webview.addEventListener("leave-html-full-screen", function(){
    webnav.hidden = false
    togglefullscreen(document.getElementById("togglefullscreen"), false)
});

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
            if(val == "swc:start"){
                view.loadURL("file:///" + __dirname.replaceAll("\\", "/") + "/browser/index.html");
            }else if(val == "swc:info"){
                view.loadURL("file:///" + __dirname.replaceAll("\\", "/") + "/browser/info.html");
            }else{
                if(val.includes(".com") || val.includes(".de") || val.includes(".org") || val.includes(".net") || val.includes(".io")){
                    view.loadURL(`http://${val}`);
                }else{
                    view.loadURL(`http://www.ecosia.org/search?q=${val.replace(" ", "+")}`);
                }
            }
        }
    }
}
function updateNav (event) {
    var src = view.src;
    if(src.replaceAll("%20", " ") == "file:///" + __dirname.replaceAll("\\", "/") + "/browser/index.html"){
        src = "swc:start";
    }else if(src.replaceAll("%20", " ") == "file:///" + __dirname.replaceAll("\\", "/") + "/browser/info.html"){
        src = "swc:info";
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

function togglefullscreen(btn, onoff=undefined){
    var navbar = document.getElementById("navbar")
    var sidebar = document.getElementById("sidebar")
    var mainpage = document.getElementById("mainpage")

    if(onoff != undefined){
        var win = require("electron").remote.getCurrentWindow()
        if(!onoff){
            win.setMenuBarVisibility(true)

            navbar.hidden = false
            sidebar.hidden = false
    
            mainpage.classList.remove("mainpage-expand")
            mainpage.classList.add("mainpage-norm")
    
            view.classList.remove("view-vfs")
            view.classList.add("view")
    
            btn.innerText = "fullscreen"
        }else{
            win.setMenuBarVisibility(false)

            navbar.hidden = true
            sidebar.hidden = true
    
            mainpage.classList.add("mainpage-expand")
            mainpage.classList.remove("mainpage-norm")
    
            view.classList.add("view-vfs")
            view.classList.remove("view")
    
            btn.innerText = "fullscreen_exit"
        }
    }else{
        if(navbar.hidden){
            navbar.hidden = false
            sidebar.hidden = false
    
            mainpage.classList.remove("mainpage-expand")
            mainpage.classList.add("mainpage-norm")
    
            view.classList.remove("view-fs")
            view.classList.add("view")
    
            btn.innerText = "fullscreen"
        }else{
            navbar.hidden = true
            sidebar.hidden = true
    
            mainpage.classList.add("mainpage-expand")
            mainpage.classList.remove("mainpage-norm")
    
            view.classList.add("view-fs")
            view.classList.remove("view")
    
            btn.innerText = "fullscreen_exit"
        }
    }
}
