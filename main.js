const electron = require('electron')
const {autoUpdater} = require('electron-updater');
const sethandle = require("./settingshandler.js");
const menuhandle = require("./renderer/menu.js");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const Tray = electron.Tray

sethandle.init_settings()

var quit = false;
const iswin32 = process.platform === "win32"

let win

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
    win.addListener("close", (ev)=>{
      if(sethandle.getVal("systemtray")){
        if(!quit){ev.preventDefault();win.hide()}else{app.quit()}
      }else{
        app.quit()
      }
    });
    win.loadFile('templates/pageload.html');
    try {
      autoUpdater.checkForUpdates();
    } catch (error) {
      alert(error)
    }
  }else{
    win.flashFrame(true)
    app.quit()
  }
}
app.whenReady().then(createWindow)

app.on('window-all-closed', (ev) => {
  app.quit();
});

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
        win.destroy()
        quit = true;
        app.quit()
      }
    }
  ]))
  tray.on('double-click', () => {
      win.show()
  })
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