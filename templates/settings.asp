<div class="modal" id="clearCaheModal">
  <div class="modal-dialog">
      <div class="modal-content">
          <div class="modal-header">
              <h4 class="modal-title">Do you really want to clear the app's cache?</h4>
              <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>
          <div class="modal-body">
              If you clear the cache, the page will reload and all temporary files and system cookies will be deleted! You may have to re-login.
          </div>
          <div class="modal-footer">
              <button type="button" class="btn btn-info" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-warning" data-dismiss="modal" onclick="clearCache()">Clear</button>
          </div>
      </div>
  </div>
</div>





<h3>General</h3>

<h5>Theme</h5>
<div class="dropdown">
  <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
    <span id="currtheme"></span>
  </button>
  <div class="dropdown-menu">
    <a class="dropdown-item" onclick="setTheme(theme='light');update()">Light</a>
    <a class="dropdown-item" onclick="setTheme(theme='dark');update()">Dark</a>
  </div>
</div><br>
Default Page to show on startup
<div class="dropdown">
  <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
    <span id="gendefpage"></span>
  </button>
  <div class="dropdown-menu">
    <a class="dropdown-item" onclick="setVal('defstartpage', 'Dashboard');update()">Dashboard</a>
    <a class="dropdown-item" onclick="setVal('defstartpage', 'Events');update()">Events</a>
    <a class="dropdown-item disabled" onclick="setVal('defstartpage', 'Chat');update()">Chat</a>
    <a class="dropdown-item" onclick="setVal('defstartpage', 'Servers');update()">Servers</a>
    <a class="dropdown-item" onclick="setVal('defstartpage', 'Cloud');update()">Cloud</a>
  </div>
</div><br>


<h5>Updates</h5>
Current Version: <span id="version"></span><br>
<div class="custom-control custom-switch">
  <input type="checkbox" class="custom-control-input" id="updatecheck" onclick="switchupdate()">
  <label class="custom-control-label" for="updatecheck">Autoupdate</label>
</div>
<br>


<h5>Cache</h5>
Cachesize: <span id="cachesize"></span><br>
Size when empty: <= 2029 KB <br>
<button onclick="$('#clearCaheModal').modal('show');" class="btn btn-warning">Clear</button> &nbsp; <button class="btn btn-primary" onclick="openexplorer('cachedir');">Open in Folder</button><br><br>

<h5>Behavior</h5>
<div class="custom-control custom-switch">
  <input type="checkbox" class="custom-control-input" id="systraycheck" onclick="switchtray()">
  <label class="custom-control-label" for="systraycheck">Minimize to Tray on close</label>
</div>
<span>(Only win32 and kubuntu, kde neon, deepin, some others)</span>
<br><br>


<h5>Developement</h5>
<div class="custom-control custom-switch">
  <input type="checkbox" class="custom-control-input" id="devmodecheck" onclick="switchdevmode()">
  <label class="custom-control-label" for="devmodecheck">Dev Mode</label>
</div>
<hr>
<br>


<h3>Dashboard</h3>
<hr>


<h3>Events</h3>
<hr>


<h3>Chat</h3>
<hr>


<h3>Servers</h3>
<div class="dropdown">
  <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
    Default page: <span id="serverdefaultpage"></span>
  </button>
  <div class="dropdown-menu">
    <a class="dropdown-item" onclick="setVal('serverstartpage', 'Teamspeak');update()">Teamspeak</a>
    <a class="dropdown-item" onclick="setVal('serverstartpage', 'Minecraft');update()">Minecraft</a>
    <a class="dropdown-item" onclick="setVal('serverstartpage', 'GMod');update()">GMod</a>
    <a class="dropdown-item" onclick="setVal('serverstartpage', 'General');update()">General</a>
  </div>
</div>
<hr>


<h3>Cloud</h3>
<div class="dropdown">
  <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
    Default page: <span id="clouddefaultpage"></span>
  </button>
  <div class="dropdown-menu">
    <a class="dropdown-item" onclick="setVal('cloudstartpage', 'MyCloud');update()">My Cloud</a>
    <a class="dropdown-item" onclick="setVal('cloudstartpage', 'PublicCloud');update()">Public Cloud</a>
  </div>
</div>

<br><br>

<script src="./../static/js/tools.js"></script>
<script>
  var remote = require('electron').remote;
  var win = remote.getCurrentWindow();
  var operator = win.webContents.session;
  var updatecheck = document.getElementById("updatecheck");
  var systrayobj = document.getElementById("systraycheck");
  var devmodecheck = document.getElementById("devmodecheck");
  document.getElementById("version").innerText = remote.app.getVersion()
  updatecheck.checked = getVal("autoupdate");
  systrayobj.checked = getVal("systemtray");
  devmodecheck.checked = getVal("devMode")
  
  function switchupdate(){
    setVal("autoupdate", !getVal("autoupdate"));
    var autoUpdater = require('electron-updater');
    autoUpdater.autoDownload = getVal("autoupdate");
  }
  function switchtray(){
    setVal("systemtray", !getVal("systemtray"));
  }
  function switchdevmode(){
    setVal("devMode", !getVal("devMode"));
    if(confirm("You have to restart for this to take effect!")){remote.app.relaunch();remote.app.exit()}
  }

  function update(){
    operator.getCacheSize().then(function(result){document.getElementById("cachesize").innerText = Math.round(result/(1024)) + " KB"})
    document.getElementById("currtheme").innerHTML = getVal("theme")
    document.getElementById("serverdefaultpage").innerHTML = getVal('serverstartpage')
    document.getElementById("gendefpage").innerHTML = getVal("defstartpage")
    document.getElementById("clouddefaultpage").innerHTML = getVal("cloudstartpage")
  }update()


  function openexplorer(exp){
    const {shell} = require('electron')
    if(exp == "cachedir"){
      shell.openItem(cachedir)
    }else{

    }
  }

  function clearCache(){
    operator.clearCache().then(()=>{
      operator.clearAuthCache().then(()=>{
        operator.clearHostResolverCache().then(()=>{
          operator.clearStorageData().then(()=>{
            win.webContents.clearHistory()
            window.location.href = "login.html";
          });
        });
      });
    });
  }
    
</script>