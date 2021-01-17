var { remote, ipcRenderer } = require('electron')
var win = remote.getCurrentWindow()
var settings = new Settings()

function window_minimize(){
    win.minimize()
}
function window_maximize(){
    if(win.isMaximized()){
        win.restore()
    }else{
        win.maximize()
    }
}
win.on("maximize", () => {
    document.getElementById("win_max").hidden = true
    document.getElementById("win_res").hidden = false
})
win.on("unmaximize", () => {
    document.getElementById("win_max").hidden = false
    document.getElementById("win_res").hidden = true
})
function window_close(){
    win.close()
}




for(let x of document.getElementsByClassName("avatar")){
    x.src = `https://api.software-city.org/avatar/${settings.account.user.name}`
}
for(let x of document.getElementsByClassName("username")){
    x.innerText = settings.account.user.name
}


function loadHTML(page){
    // $("#main").fadeOut(100,() => {
    //     $(this).load(page).fadeIn(100);
    // })
    $("#main").load(page)
}
function loadPage(btn){
    loadHTML(`./views/${btn.getAttribute("data-loc")}.html`)
}





ipcRenderer.send("ready-tray")
