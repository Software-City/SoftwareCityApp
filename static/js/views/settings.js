document.getElementById("debug-card").hidden = !settings.general.debug
document.getElementById("dev-settings").hidden = !settings.general.developer.enabled


///// GENERAL

// Startpage Select
for(let item of menu_btns){
    let val = item.getAttribute("data-loc")
    document.getElementById("startpage-sel").innerHTML += `<option value="${val}">${val.toUpperCase()}</option>`
}
document.getElementById("startpage-sel").value = settings.views.default
document.getElementById("startpage-sel").addEventListener("input", e => {
    settings.views.default = e.srcElement.value
    settings.commit()
})

//Tray Stuff
document.getElementById("tray-checkbox").checked = settings.general.tray.minimizeOnClose
document.getElementById("tray-checkbox").addEventListener("input", e => {
    settings.general.tray.minimizeOnClose = e.srcElement.checked
    settings.commit()
})

// Developer Stuff
document.getElementById("devmode-checkbox").checked = settings.general.developer.enabled
document.getElementById("devmode-checkbox").addEventListener("input", e => {
    settings.general.developer.enabled = e.srcElement.checked
    settings.commit()
    document.getElementById("dev-settings").hidden = !e.srcElement.checked
})
document.getElementById("dev-updates-checkbox").checked = settings.general.developer.updates
document.getElementById("dev-updates-checkbox").addEventListener("input", e => {
    settings.general.developer.updates = e.srcElement.checked
    settings.commit()
})
document.getElementById("dev-frame-checkbox").checked = settings.general.developer.framedWindow
document.getElementById("dev-frame-checkbox").addEventListener("input", e => {
    settings.general.developer.framedWindow = e.srcElement.checked
    settings.commit()
})

// Debug Stuff
document.getElementById("debugmode-checkbox").checked = settings.general.debug
document.getElementById("debugmode-checkbox").addEventListener("input", e => {
    settings.general.debug = e.srcElement.checked
    settings.commit()
    document.getElementById("debug-card").hidden = !e.srcElement.checked
})




function logout(){
    let ov = new Overlay("overlay", "logout-overlay", "Log Out?")
    ov.Text("Really logout?")
    ov.Button("logout-btn", "Yes", "btn-warning").addEventListener("click", ()=>{
        settings.account.state = false
        settings.commit()
        ipcRenderer.send("end-app", true, restart=true)
    })
    ov.modal()
}