<link rel="stylesheet" href="./../static/css/cloudStyle.css">

<div id="overlay-wrapper"></div>

<div id="navbarlayout" hidden>
    <a class="navbar-brand"><img src="./../static/logos/logo.ico" alt="Logo" style="width:40px;">&nbsp; Software City Cloud</a>
    <ul class="navbar-nav">
        <li class="nav-item">
            <a class="nav-link sidebarclass resetsocket" onclick="goback();">Back</a>
        </li>
        <ul class="nav nav-pills" id="cl-sel">
            <li class="nav-item">
                <a class="nav-link cloudswitch" id="pcloudbtn" onclick="loadcloudpage('pcloud.html',this);">My Cloud</a>
            </li>
            <li class="nav-item">
                <a class="nav-link cloudswitch" id="cloudbtn" onclick="loadcloudpage('cloud.html',this);">Public Cloud</a>
            </li>
        </ul>
    </ul>
</div>

<div id="sidebarlayout" hidden>
    <ul class="nav nav-pills flex-column">
        <li class="nav-item">
            <a class="nav-link cloudswitch" id="pcloudbtn" onclick="loadcloudpage('pcloud.html',this);">My Cloud</a>
        </li>
        <li class="nav-item">
            <a class="nav-link cloudswitch" id="cloudbtn" onclick="loadcloudpage('cloud.html',this);">Public Cloud</a>
        </li>
    </ul>
</div>

<div id="cloudwin"></div>

<script src="./../static/js/cloud/cloud_funcs.js"></script>
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