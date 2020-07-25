const { app, BrowserWindow, Menu, Tray, ipcMain, Notification } = require("electron")
const {autoUpdater} = require('electron-updater');
const sethandle = require("./settingshandler.js");
const menuhandle = require("./renderer/menu.js");

sethandle.init_settings()

app.allowRendererProcessReuse = true;

if(sethandle.getVal("devMode")){
    app.setAppUserModelId(process.execPath);
}

var quit = false
const iswin32 = process.platform === "win32"

let win

function endApp() {
    function end() {
        win.webContents.send("ss-endconn")
        ipcMain.on("ss-ended", ()=>{
            app.exit(0)
        })
    }
    if(sethandle.getVal("systemtray")){
        if(!quit){
            win.hide()
        }else{
            end()
        }
    }else{
        end()
    }
}

function createWindow () {
    if(app.requestSingleInstanceLock()){
        win = new BrowserWindow({
            width: 1280,
            height: 720,
            minWidth: 1280,
            minHeight: 720,
            webPreferences: {
                nodeIntegration: true,
                webviewTag: true
            }
        });

        menuhandle.buildMenu();
        win.once('focus', () => win.flashFrame(false))
        if(iswin32){
            makeTray("win32");
            win.setIcon(__dirname + '/static/logos/logo.ico');
        }else{
            makeTray("unix");
            win.setIcon(__dirname + '/static/logos/logo.png')
        }
        require("dns").lookup("software-city.org", function(err, addr) {
            if (err) {
                win.loadFile('templates/offline.html');
            } else {
                require('dns').lookupService(addr, 80, function(err) {
                if (err) {
                    win.loadFile('templates/offline.html');
                } else {
                    win.loadFile("templates/login.html");
                }
                });
            }
        });

        win.on("close", (ev)=>{
            ev.preventDefault()
            endApp()
        })

        win.loadFile('templates/pageload.html');
        try {
            autoUpdater.checkForUpdates();
        } catch (error) {
            alert(error)
        }
    }
}
app.whenReady().then(createWindow)


app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

var hidden = false;
function makeTray(dist){
    if(dist=="win32"){
        tray = new Tray(__dirname + '/static/logos/logo.ico')
    }else{
        tray = new Tray(__dirname + '/static/logos/logo.png')
    }
    tray.setToolTip('Software City App')
    tray.setContextMenu(Menu.buildFromTemplate([
        {
            label: 'Hide/Show Window',
            click: () => {
                if(hidden){win.show(); hidden=false;}
                else{win.hide(); hidden=true;}
            }
        },
        {
            type: 'separator'
        },
        {
            label: 'Exit',
            click: () => {
                quit = true
                endApp()
            }
        }
    ]))
    tray.on('double-click', () => {
        win.show()
    })
}


function openedByUrl(url) {
    if (url) {
        win.webContents.send('openedByUrl', url);
    }
}

if (app.requestSingleInstanceLock()) {
    app.on('second-instance', (e, argv) => {
        if (process.platform === 'win32') {
            openedByUrl(argv.find((arg) => arg.startsWith('swc_desktopapp:')));
        }
        if (win) {
            if (win.isMinimized()) win.restore();
            win.show()
            win.focus()
        }
    }
)};

if (!app.isDefaultProtocolClient('swc_desktopapp')) {
    app.setAsDefaultProtocolClient('swc_desktopapp');
}


//-------------------------------------------------------------------
// Auto updates
//-------------------------------------------------------------------
const sendStatusToWindow = (text) => {
    if (win) {
        win.webContents.send('updatemessage', text);
    }
};

autoUpdater.on('update-available', info => {
    if (sethandle.getVal("autoupdate")){
        win.loadFile('templates/update.html');
    }else{
        if(confirm("Do you want to install the latest update?")){
        win.loadFile('templates/update.html');
        autoUpdater.downloadUpdate();
        }
    }
});
autoUpdater.on('error', err => {
    sendStatusToWindow(["error", `Error in auto-updater: ${err.toString()}`]);
});
autoUpdater.on('download-progress', progressObj => {
    sendStatusToWindow(
        ["downloading", {"speed": progressObj.bytesPerSecond, "progress": progressObj.percent, "transferred": progressObj.transferred, "total": progressObj.total}]
    );
});

autoUpdater.on('update-downloaded', info => {
    if (sethandle.getVal("autoupdate")){
        autoUpdater.quitAndInstall();
    }else{
        if(confirm("Do you want to install the latest update?")){
            autoUpdater.quitAndInstall();
        }else{
            win.loadFile('templates/login.html');
        }
    }
});

app.requestSingleInstanceLock()

ipcMain.on("notify", (title, body="Click to view")=>{
    var notification = new Notification({
        icon: process.platform === "win32" ? "./static/logos/logo.ico" : "./static/logos/logo.png",
        title: title,
        body: body
    })
    notification.on("click", ()=>{
        notification.removeAllListeners()
        if(win.isMinimized()){
            win.restore()
        }
        win.show()
        win.focus()
    })
    notification.show()
})