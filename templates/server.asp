<style>
    #serverwin{
        padding-top: 10vh;
        min-height: 20vh;
        width: 90vw;
    }
    #selector{
        padding-top: 2vh;
    }
</style>
<div class="container-fluid" id="selector">
    <ul class="nav nav-tabs nav-justified" style="position: fixed; width: 87vw;">
        <li class="nav-item">
            <a class="nav-link" id="tsbtn" onclick="loadserverpage('ts.html',this);">Teamspeak</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" id="mcbtn" onclick="loadserverpage('mc.html',this);">Minecraft</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" id="gmodbtn" onclick="loadserverpage('gmod.html',this);">GMod</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" id="generalbtn" onclick="loadserverpage('general.html',this);">General</a>
        </li>
    </ul>
</div>
<br>
<div id="serverwin"></div>
<script>
    var buts = [document.getElementById("mcbtn"),document.getElementById("tsbtn"),document.getElementById("gmodbtn"),document.getElementById("generalbtn")];
    function loadserverpage(page,btn){
        var pagewin = document.getElementById("serverwin");
        $(pagewin).load("servertemplates/" + page);
        buts.forEach((e)=>{e.classList.remove("active")})
        btn.classList.add("active")
    }
    function loadserverurl(url,btn){
        var pagewin = document.getElementById("serverwin");
        $(pagewin).load(url);
        buts.forEach((e)=>{e.classList.remove("active")})
        btn.classList.add("active")
    }
    switch(getVal("serverstartpage")){
        case "Teamspeak":loadserverpage("ts.html", document.getElementById("tsbtn"));break;
        case "Minecraft":loadserverpage("mc.html", document.getElementById("mcbtn"));break;
        case "GMod":loadserverpage("gmod.html", document.getElementById("gmodbtn"));break;
        case "general":loadserverpage("general.html", document.getElementById("generalbtn"));break;
        default:loadserverpage("mc.html", document.getElementById("mcbtn"));
    }
</script>