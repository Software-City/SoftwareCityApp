<style>
    #view{
        height: 80vh;
        width: 88.4vw;
    }
    #mainpage{
        overflow-y: hidden;
        overflow-x: hidden;
    }
    #webnav{
        height: 5vh;
        border-style: solid;
        border-color: gray;
    }
</style>

<div class="modal" id="infoModal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Warning</h4>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body">
                This feature is still WIP and really buggy! Be careful using it!
                Info: If the Buttons break you will have to restart the app for now.
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-info" data-dismiss="modal">Accept</button>
            </div>
        </div>
    </div>
</div>

<nav class="navbar navbar-expand-sm" id="webnav">
    <button id="back" class="btn material-icons" onclick="backView();" title="Go back">arrow_back</button>
    <button id="forward" class="btn material-icons" onclick="forwardView();" title="Go forward">arrow_forward</button>
    <button id="refresh" class="btn material-icons" onclick="reloadView();" title="Refresh">refresh</button>
    <button id="home" class="btn material-icons" onclick="gohome();" title="SWC Home">home</button>
    <input type="text" class="form-control" placeholder="URL" id="url" onclick="this.select();">
    <button id="home" class="btn material-icons" onclick="toggledevtools();" title="pen Dev-Tools">developer_board</button>
</nav>
<!-- <iframe id="view" src="./browser/index.html"></iframe> -->
<webview id="view" src="./browser/index.html" autosize="on"></webview>

<script src="./../static/js/tools.js"></script>
<script src="./browser/renderer.js"></script>
<script>
    // $("#infoModal").modal("show");
</script>