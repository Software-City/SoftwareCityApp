const { app } = require("electron")
const config = require("./config")
const fs = require("fs")
const path = require("path")


class Settings{
    constructor(){
        this.appdata = app.getPath("userData")
        this.settingsFile = path.join(this.appdata, config.settings_filename)

        if(!fs.existsSync(this.settingsFile)){
            fs.writeFileSync(this.settingsFile, JSON.stringify(config.settings_config, null, 4))
        }

        this.settings_data = JSON.parse(fs.readFileSync(this.settingsFile, "utf8"))

        this.settings_data = Object.assign({}, config.settings_config, this.settings_data)
        // for(let val in config.settings_config){
        //     if(!checkForKey(this.settings_data, val)){
        //         this.settings_data[val] = config.settings_config[val]
        //         this.commit()
        //     }
        // }
        this.commit()

        fs.watchFile(this.settingsFile, {
            persistent: true,
            interval: 500
        }, this.load)

        this.load()
    }
    load(){
        for(let val in this.settings_data){
            this[val] = this.settings_data[val]
        }
    }
    reset(){
        this.settings_data = config.settings_config
        for(let val in this.settings_data){
            this[val] = this.settings_data[val]
        }
        this.commit()
    }
    commit(){
        fs.writeFileSync(this.settingsFile, JSON.stringify(this.settings_data, null, 4))
    }
}
function checkForKey(json, key) {
    return typeof (json[key]) !== "undefined";
}

module.exports.Settings = Settings