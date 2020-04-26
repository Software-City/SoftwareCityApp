<text>Logged in as: {{username}}</text>&nbsp;
<button type="button" class="btn btn-dark" data-toggle="modal" data-target="#logoutModal">
    Logout
</button><br><br>
<!-- <h4>Ranks: <span id="mainrank" class="badge badge-secondary" style="color: red;"></span> <span id="ranks"><span class="badge badge-secondary"></span></span></h4> -->








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
    function logout(){
        setVal("loggedin", false);
        setVal("credentials", []);
        window.location.href = "login.html";
    }
    var page = document.getElementById("mainpage");
    var creds = getVal("credentials")
    page.innerHTML = page.innerHTML.replace("{{username}}", creds[0])
</script>