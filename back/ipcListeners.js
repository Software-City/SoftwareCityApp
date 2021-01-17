const { ipcMain, app } = require("electron")
const sett_handle = require("./settings")
const config = require("./config")
const notifications = require("./notifications")


let settings = new sett_handle.Settings()


class SettingsListeners{
    constructor(cmd, ...args){
        this.returnValue = this[cmd](...args)
    }
    get(){
        return settings
    }
    reset(){
        settings.reset()
    }
    commit(data){
        settings.settings_data = data
        settings.commit()
    }
}



module.exports = () => {
    ipcMain.on("settings_cmd", (e, ...args)=>{
        e.returnValue = new SettingsListeners(...args).returnValue
    })
    ipcMain.on("notify", (e, ...args)=>{
        e.returnValue = new notifications.Notify(...args).show()
    })
}