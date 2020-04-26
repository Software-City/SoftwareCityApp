<style>
    #serverwin{
        padding-top: 10vh;
        min-height: 20vh;
        width: 90vw;
    }
</style>
<ul class="nav nav-tabs nav-justified" style="position: fixed; width: 80vw;">
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