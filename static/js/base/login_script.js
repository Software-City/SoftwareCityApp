var { ipcRenderer, remote } = require("electron")
const crypto = require("crypto")


function hash(str){
    function buf2hex(buffer){
        return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('')
    }
    return buf2hex(crypto.createHash("sha512").update(str, "utf-8").digest())
}

function login(e){
    e.preventDefault()

    let username = document.getElementById("enter-username").value
    let password_unencrypted = document.getElementById("password").value
    let info = document.getElementById("info")

    info.innerText = ""

    if(username!=="" && password_unencrypted!==""){
        let password = hash(password_unencrypted)
        ipcRenderer.invoke("check_login", username, password).then((resp) => {
            if(!resp){return}
            ipcRenderer.invoke("write_login", username, password).then(()=>{remote.app.relaunch(); remote.getCurrentWindow().close()})
        })
    }
}
document.getElementById("login-confirm-button").addEventListener("click", login)