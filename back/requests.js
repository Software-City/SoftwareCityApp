const { ipcMain } = require("electron")
const axios = require("axios")
const qs = require("querystring")


exports.get = async (url, data) => {
    if(!data) data = {}
    return await axios.get(url, {
        params: data
    })
}
exports.post = async (url, data) => {
    return await axios.post(url, qs.stringify(data))
}

exports.ping = async (url) => {
    return !!(await axios.get(url))
}


ipcMain.handle("get", (_, ...args) => {return exports.get(...args)})
ipcMain.handle("post", (_, ...args) => {return exports.post(...args)})
ipcMain.handle("ping", (_, ...args) => {return exports.ping(...args)})


