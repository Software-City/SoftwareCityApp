const { app, Menu, Tray } = require('electron')
const iswin32 = process.platform === "win32"

const template = [
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forcereload' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'toggledevtools' }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://projects.software-city.org/resources/electron/interfaceapp')
        }
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

if(iswin32){
  app.setUserTasks([])
}