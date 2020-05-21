<style>
    .view{
        height: calc(100vh - 80px - 50px);
    }
    .view-fs{
        height: calc(100vh - 50px);
    }
    .view-vfs{
        height: 100vh;
    }
    #mainpage{
        overflow-y: hidden;
        overflow-x: hidden;
    }
    #webnav{
        height: 50px;
        border-style: solid;
        border-color: gray;
    }
    .spinning{
        animation-name: spin-animation;
        animation-duration: 0.7s;
        animation-iteration-count: infinite;
    }
    @keyframes spin-animation{
        from{transform: rotate(0deg);}
        to{transform: rotate(360deg);}
    }
    .btn:focus,.btn:active {
        outline: none !important;
        box-shadow: none !important;
    }
    body{
        overflow-y: hidden;
    }
</style>

<nav class="navbar navbar-expand-sm" id="webnav">
    <button id="back" class="btn material-icons" onclick="backView();" title="Go back">arrow_back</button>
    <button id="forward" class="btn material-icons" onclick="forwardView();" title="Go forward">arrow_forward</button>
    <button id="refresh" class="btn material-icons" onclick="reloadView();" title="Refresh">refresh</button>
    <button id="home" class="btn material-icons" onclick="gohome();" title="SWC Home">home</button>
    <input type="text" class="form-control" placeholder="URL" id="url" onclick="this.select();">
    <button id="devtools" class="btn material-icons" onclick="toggledevtools();" title="Open Dev-Tools">developer_board</button>
    <button id="clearHistory" class="btn material-icons" onclick="clearhist();" title="Clear all history">layers_clear</button>
    <button id="togglefullscreen" class="btn material-icons" onclick="togglefullscreen(this);" title="Toggle borders">fullscreen</button>
</nav>
<webview id="view" src="./browser/index.html" autosize="on" allowpopups class="view"></webview>

<script src="./../static/js/tools.js"></script>
<script src="./browser/renderer.js"></script>
<script src="./browser/menu.js"></script>
<script>
    var webview = document.querySelector('webview');
    var view = document.getElementById("view");
    var urlbar = document.getElementById("url");
    var refresh = document.getElementById("refresh");
    var back = document.getElementById("back");
    var forward = document.getElementById("forward");

    if(tempdata.browserurloverride!=undefined && tempdata.browserurloverride!=""){
        view.src = tempdata.browserurloverride;
        tempdata.browserurloverride = undefined;
    }

    function clearhist(){
        webview.clearHistory();
        view.src = "./browser/index.html";
    }
    webview.addEventListener('new-window', (e) => {
        try {
            e.preventDefault();
            webview.loadURL(e.url);
        } catch (error) {
            alert(error);
            view.src = "./browser/index.html";
        }
    });
    webview.addEventListener('did-start-loading', () => {
        urlbar.disabled = true;
        refresh.classList.add("spinning");
    });
    webview.addEventListener('did-stop-loading', () => {
        urlbar.disabled = false;
        refresh.classList.remove("spinning");
        if(webview.canGoBack()){back.disabled = false;}else{back.disabled = true;}
        if(webview.canGoForward()){forward.disabled = false;}else{forward.disabled = true;}
    });
    view.addEventListener("contextmenu", (e) => {console.log(e)});
</script>