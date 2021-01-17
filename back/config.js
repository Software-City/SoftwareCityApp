const path = require("path")


exports.platform = process.platform === "win32" ? "win32" : "unix"
exports.icon_path = path.join(__dirname, "..", "static", "logo", "512x512" + (exports.platform === "win32" ? ".ico" : ".png"))

exports.settings_filename = "settings.json"
exports.settings_config =
    {
        general: {
            developer: {
                enabled: true,
                updates: false,
                framedWindow: false
            },
            theme: {
                dark: true
            },
            tray: {
                minimizeOnClose: true
            },
            notifications: {
                muteAll: false,
                update: true,
                types: {
                    info: true,
                    general: true,
                    chat: true,
                    important: true,
                    emergency: true
                },
                sound: true,
                stay: false
            },
            update: {
                enabled: true,
                autoCheck: true
            },
            debug: true,
            advanced: false
        },
        views: {
            dashboard: {
                panels: [
                    "News",
                    "Joke",
                    "Cloud"
                ],
                syncTime: null
            },
            cloud: {
                default: "MyCloud"
            },
            default: "dashboard"
        },
        account: {
            state: false,
            user: {
                name: null,
                password: null
            }
        }
    }
