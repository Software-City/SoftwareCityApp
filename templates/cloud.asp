<style>
    #serverwin{
        padding-top: 10vh;
        min-height: 20vh;
        width: 90vw;
    }
</style>




<div class="modal" id="newfolderModal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">New folder</h4>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body">
                <span>Only ASCII and max 12 characters</span><br>
                <span style="color: red;" id="newfolderinfo"></span>
                <input type="text" class="form-control" placeholder="Folder name" id="foldernameinput">
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-info" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-success" onclick="new_folder()">Create</button>
            </div>
        </div>
    </div>
</div>
<div class="modal" id="moveModal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Move Folder</h4>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="dropdown">
                    <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" id="movetofolderbtndr">
                        Folder
                    </button>
                    <div class="dropdown-menu" id="movetofolderdr">
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-info" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-success" onclick="movetonow();">Move</button>
            </div>
        </div>
    </div>
</div>
<div class="modal" id="binModal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Move File to Trash?</h4>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body">
                Continue? You can retrieve the file again!
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-info" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-warning" onclick="movetobin();">Move to Trash</button>
            </div>
        </div>
    </div>
</div>
<div class="modal" id="deletefileModal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Delete file?</h4>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body">
                Do you really, really want to delete this file? It won't be recoverable!
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-info" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-danger" onclick="deleteforever();">Delete</button>
            </div>
        </div>
    </div>
</div>





<ul class="nav nav-tabs nav-justified" style="position: fixed; width: 87vw;">
    <li class="nav-item">
        <a class="nav-link cloudswitch" id="pcloudbtn" onclick="loadcloudpage('pcloud.html',this);">My Cloud</a>
    </li>
    <li class="nav-item">
        <a class="nav-link cloudswitch" id="cloudbtn" onclick="loadcloudpage('cloud.html',this);">Public Cloud</a>
    </li>
</ul><br>
<div id="cloudwin"></div>
<script>
    var buts = [document.getElementById("pcloudbtn"),document.getElementById("cloudbtn")];
    function loadcloudpage(page,btn){
        var pagewin = document.getElementById("cloudwin");
        $(pagewin).load("cloudtemplates/" + page);
        buts.forEach((e)=>{e.classList.remove("active")})
        btn.classList.add("active")
    }
    function loadcloudurl(url,btn){
        var pagewin = document.getElementById("cloudwin");
        $(pagewin).load(url);
        buts.forEach((e)=>{e.classList.remove("active")})
        btn.classList.add("active")
    }
    switch(getVal("cloudstartpage")){
        case "MyCloud":loadcloudpage("pcloud.html", document.getElementById("pcloudbtn"));break;
        case "PublicCloud":loadcloudpage("cloud.html", document.getElementById("cloudbtn"));break;
        default:loadcloudpage("pcloud.html", document.getElementById("pcloudbtn"));
    }
</script>