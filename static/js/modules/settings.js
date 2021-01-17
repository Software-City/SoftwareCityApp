var { ipcRenderer } = require("electron")


class Settings{
    constructor(ipcChannel="settings_cmd"){
        this.ipcChannel = ipcChannel
        this.load()
    }
    load(){
        this.settings_data = ipcRenderer.sendSync(this.ipcChannel, "get")
        for(let val in this.settings_data){
            this[val] = this.settings_data[val]
        }
    }
    reset(){
        ipcRenderer.sendSync(this.ipcChannel, "reset")
    }
    commit(){
        ipcRenderer.sendSync(this.ipcChannel, "commit", this.settings_data)
    }
}