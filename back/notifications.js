const { Notification } = require("electron")
const config = require("./config")
const sett_handle = require("./settings")

let settings = new sett_handle.Settings()


exports.comatability = Notification.isSupported()


class Notify{
    constructor(title, body, type="general", silent=!settings.general.notifications.sound, timeout=(settings.general.notifications.stay ? "default" : "never")) {
        if(config.settings_config.general.notifications.types.hasOwnProperty(type)){
            this.notification = new Notification({
                title, body,
                icon: config.icon_path,
                silent,
                timeoutType: timeout
            })
            this.callable = !!settings.general.notifications.types[type];
        }else{
            throw new DOMException(`Notification type '${type}' not recognized.`, "Unknown Notification Type")
        }
    }
    ClickListener(listener){
        this.notification.once("click", listener)
        return this
    }
    CloseListener(listener){
        this.notification.once("close", listener)
        return this
    }
    show(){
        if(this.callable){
            this.notification.show()
        }
        return this.callable
    }
}

exports.Notify = Notify