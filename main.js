const { app, BrowserWindow, Menu, Tray, ipcMain, Notification } = require("electron")
const { autoUpdater } = require('electron-updater')

const menu_handle = require("./back/menu")
const auth = require("./back/auth")
const config = require("./back/config")
const requests = require("./back/requests")
const sett_handle = require("./back/settings")

let settings = new sett_handle.Settings()
require("./back/ipcListeners")()

if(settings.general.developer.enabled){
    app.setAppUserModelId(process.execPath);
}


app.allowRendererProcessReuse = true


let win

let closing = false
function end(force=false){
    if(force){
        closing = true
        app.quit()
    }else{
        win.hide()
    }
}

async function startMain(){
    if(app.requestSingleInstanceLock()){
        let loader = LoadWindow()
        if(settings.general.update.enabled){
            if(settings.general.developer.enabled){
                if(settings.general.developer.updates){
                    console.log("warning updates are activated in dev-mode! this can cause problems!")
                    autoUpdater.checkForUpdates().then(()=>{
                        console.log("update check logged and finished!")
                    })
                }
            }else{
                autoUpdater.checkForUpdates().then()
            }
        }

        if(await requests.ping("https://api.software-city.org/status")) {
            if (settings.account.state) {
                auth.check_login(
                    settings.account.user.name,
                    settings.account.user.password
                ).then(() => {
                    MainWindow()
                    loader.close()
                }).catch((err) => {
                    if (err.response.status === 401) {
                        LoginWindow()
                    } else {
                        console.log("Critical error! Please contact support.")
                        end(true)
                    }
                    loader.close()
                })
            } else {
                LoginWindow()
                loader.close()
            }
        }else{
            let err_win = ErrorWindow()
            err_win.loadFile("./templates/offline.html").then(()=>{
                loader.close()
            })

        }
    }
}

function MainWindow () {
    win = new BrowserWindow({
        width: 1280,
        height: 720,
        minWidth: 1280,
        minHeight: 720,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            webviewTag: true,
        },
        darkTheme: settings.general.theme.dark,
        frame: settings.general.developer.framedWindow
    })

    win.once('focus', () => win.flashFrame(false))

    menu_handle.buildMenu(settings.general.developer.enabled)
    win.setIcon(config.icon_path)

    win.loadFile("./templates/index.html").then()

    win.on("close", (e)=>{
        if(!closing){
            e.preventDefault()
            end(!settings.general.tray.minimizeOnClose)
        }
    })
    // win.webContents.once("dom-ready", makeTray)
}
function LoadWindow(){
    let load_win = new BrowserWindow({
        width: 300,
        height: 350,
        webPreferences: {nodeIntegration: true},
        darkTheme: settings.general.theme.dark,
        frame: false,
        resizable: false
    })
    load_win.setIcon(config.icon_path)
    load_win.loadFile("./templates/load.html").then()
    return load_win
}
function LoginWindow(){
    let log_win = new BrowserWindow({
        width: 300,
        height: 350,
        webPreferences: {nodeIntegration: true},
        darkTheme: settings.general.theme.dark,
        frame: false,
        resizable: false
    })
    log_win.setIcon(config.icon_path)
    log_win.loadFile("./templates/login.html").then()
}
function ErrorWindow(){
    let err_win = new BrowserWindow({
        width: 300,
        height: 350,
        webPreferences: {nodeIntegration: true},
        darkTheme: settings.general.theme.dark,
        frame: false,
        resizable: false
    })
    err_win.setIcon(config.icon_path)
    return err_win
}
app.whenReady().then(startMain)
app.once("ready", ()=>{
    console.log("Initializing", "org.software-city.app.swc_desktopapp")
    app.setAppUserModelId("org.software-city.app.swc_desktopapp")
    app.setAsDefaultProtocolClient("swc_desktopapp")
})

app.on('window-all-closed', () => {
    app.quit()
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        MainWindow()
    }
})

let tray;
function makeTray(iconType="default"){
    tray = new Tray(config.icon_path)

    tray.setToolTip('Software City App')
    tray.setContextMenu(Menu.buildFromTemplate([
        {
            label: 'Hide/Show Window',
            click: () => {
                if(win.hidden){win.show();win.focus();win.hidden=false}
                else{win.hide();win.hidden=true}
            }
        },
        {
            type: 'separator'
        },
        {
            label: 'Exit',
            click: () => {
                end(true)
            }
        }
    ]))
    tray.on('double-click', () => {
        win.hidden = false
        win.show()
        win.focus()
    })
}
ipcMain.on("ready-tray", makeTray)
ipcMain.on("end-app", (_, force, restart=false)=>{
    if(restart){
        app.relaunch()
    }
    end(force)
})


// Single Instance lock
function openedByUrl(url) {
    if (url) {
        win.webContents.send('openedByUrl', url)
    }
}
if (app.requestSingleInstanceLock()) {
    app.on('second-instance', (e, argv) => {
        if (config.platform === 'win32') {
            openedByUrl(argv.find((arg) => arg.startsWith('swc_desktopapp:')))
        }
        if (win) {
            if (win.isMinimized()) win.restore()
            win.show()
            win.focus()
        }
    }
)}

if (!app.isDefaultProtocolClient('swc_desktopapp')) {
    app.setAsDefaultProtocolClient('swc_desktopapp');
}


//-------------------------------------------------------------------
// Auto updates
//-------------------------------------------------------------------
