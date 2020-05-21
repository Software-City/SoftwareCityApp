<style>
    #mainpage{
        overflow-y: hidden;
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
                The chat feature is still WIP and this is just a preview of how the page will roughly look.
                Almost everything is subject to change!
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-info" data-dismiss="modal">Accept</button>
            </div>
        </div>
    </div>
</div>
<script>
    $("#infoModal").modal()
</script>


<link rel="stylesheet" href="./../static/css/chatStyle.css">

<div id="navbarlayout" hidden>
    <a class="navbar-brand"><img src="./../static/logos/logo.ico" alt="Logo" style="width:40px;">&nbsp; Software City Chat</a>
    <div class="collapse navbar-collapse" id="collapsibleNavbar">
        <ul class="navbar-nav">
            <li class="nav-item">
                <a class="nav-link sidebarclass resetsocket" onclick="goback();">Back</a>
            </li>
        </ul>
    </div>
</div>

<div id="sidebarlayout" hidden>
    <ul class="nav nav-pills flex-column">

        <h3 class="nav-info">Chats</h3>
        <li class="nav-item">
            <a class="nav-link custom-sidebarclass resetsocket" onclick="loadchat(this)" chat="">All</a>
        </li>

        <h6 class="nav-info">Groups</h6>
        <li class="nav-item">
            <a class="nav-link custom-sidebarclass resetsocket disabled" onclick="loadchat(this)" chat="">N/A</a>
        </li>

        <h6 class="nav-info">DMs</h6>
        <li class="nav-item">
            <a class="nav-link custom-sidebarclass resetsocket disabled" onclick="loadchat(this)" chat="">N/A</a>
        </li>

    </ul>
</div>

<div id="chatwin-nav" class="fixed-top">
    <nav class="navbar bg-dark" id="navbar">
        <a class="navbar-brand"><img src="./../static/logos/logo.ico" alt="Logo" style="width:40px;">&nbsp; {{chatname}}</a>
    </nav>
</div>
<div id="chatwin-main">
    <div class="media p-3">
        <div class="media-body">
            <h6>{{name}}</h6>
            <p>{{message}}</p>
        </div>
    </div>
    <div class="media p-3 sent">
        <div class="media-body">
            <h6>{{name}}</h6>
            <p>{{message}}</p>
        </div>
    </div>
</div>
<div id="chatwin-footer" class="fixed-bottom">
    <nav class="navbar navbar-expand-sm bg-dark navbar-dark">
        <button class="btn material-icons" onclick="showEmojiSelector();">insert_emoticon</button>
        <!-- <textarea class="form-control mr-sm-2" type="text" placeholder="Write something" id="inputtext"></textarea> -->
        <input class="form-control mr-sm-2" type="text" placeholder="Write something" id="inputtext" disabled>
        <button class="btn material-icons text-success" type="submit" onclick="send()">send</button>
    </nav>
</div>


<!-- <script src="./../static/modules/socket.js"></script> -->
<script src="./../static/js/chat/render.js"></script>
<!-- <script src="./../static/js/chat/socket.js"></script> -->
<script>
    
</script>