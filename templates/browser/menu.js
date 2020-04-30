var template = [
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
          var { shell } = require('electron')
          await shell.openExternal('https://projects.software-city.org/resources/electron/interfaceapp')
        }
      }
    ]
  }
]