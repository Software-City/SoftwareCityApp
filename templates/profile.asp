<style>
    #load{
        margin-left: 40vw;
        margin-top:35vh;
    }
    body{
        overflow-y: hidden;
    }
</style>

<br>
<div id="load" class="spinner-border"></div>
<div class="row" id="profilecont" hidden>
    <div class="card m-4" style="width:400px">
        <div class="card-body">
            <p>Avatar</p>
        </div>
        <img class="card-img-top avatar" src="" alt="Card image" style="width:100%;">
    </div>
    <div class="card m-4" style="width:400px">
        <div class="card-body" style="position: relative;">
            <p>Userinfo</p>
            <div style="position: absolute; bottom: 20px;">
                <h4 class="card-title">{{username}}</h4>
                <p class="card-text">Ranks: &nbsp;<span class="badge badge-secondary" style="color: red;">{{mainrank}}</span> <span>{{ranks}}</span></p>
                <button type="button" class="btn btn-primary" onclick="openinternalbrowser(`https://interface.software-city.org/${getVal('credentials')[0]}/profile`);">
                    Edit
                </button>
                &nbsp;
                <button type="button" class="btn btn-danger float-right" data-toggle="modal" data-target="#logoutModal">
                    Logout
                </button>
            </div>
        </div>
    </div>
</div>







<div class="modal" id="logoutModal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Do you really want to log out?</h4>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body">
                If you log out, you will be presented with the login screen again!
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-info" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-danger" data-dismiss="modal" onclick="logout()">Logout</button>
            </div>
        </div>
    </div>
</div>
<script>
    $.ajax({
        url: `http://interface.software-city.org/${getVal("credentials")[0]}/avatar`,
        success: function(data){
            for(x of document.getElementsByClassName("avatar")){
                x.src = data.avatar
            }
        },
        dataType: "json"
    });


    function logout(){
        setVal("loggedin", false);
        setVal("credentials", []);
        window.location.href = "login.html";
    }
    function setItem(item, val){
        page.innerHTML = page.innerHTML.replace(`{{${item}}}`, val)
    }
    var load = document.getElementById("load")
    var page = document.getElementById("profilecont");
    var creds = getVal("credentials")
    var request = new XMLHttpRequest();
    request.responseType = "json";
    request.open("GET",`https://interface.software-city.org/api?mode=apprest&data=get_userranks&user=${creds[0]}&rank=all`);
    request.addEventListener('load', function(event) {
        if (request.status >= 200 && request.status < 300) {
            if(request.response.execcode == 0){
                setItem("username", creds[0])
                setItem("mainrank", request.response.mainrank)
                var rankshtml = "";
                for(x of request.response.ranks){
                    if(x != request.response.mainrank){rankshtml += `<span class="badge badge-secondary">${x}</span>&nbsp;`}
                }
                setItem("ranks", rankshtml)
                load.hidden = true;
                page.hidden = false;
            }else{
                info.innerText = "Wrong username or password!"
            }
        } else {
            window.location.href = "offline.html"
        }
    });
    request.send();
</script>