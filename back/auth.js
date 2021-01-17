const { ipcMain } = require("electron")
const requests = require("./requests")
const sett_handle = require("./settings")

let settings = new sett_handle.Settings()


exports.check_login = async (username, password) => {
    return await requests.post("https://api.software-city.org/app/check_login", {
        username: username,
        password: password
    })
}
exports.write_login = async (username, password) => {
    settings.account.state = true
    settings.account.user.name = username
    settings.account.user.password = password
    settings.commit()
    return true
}


ipcMain.handle("check_login", (_, ...args)=>{return exports.check_login(...args)})
ipcMain.handle("write_login", (_, ...args)=>{return exports.write_login(...args)})