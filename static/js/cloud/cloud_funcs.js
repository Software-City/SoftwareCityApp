var navbar = document.getElementById("navbar")
var custom_navbar = document.getElementById("custom-navbar")
var navbarlayout = document.getElementById("navbarlayout")
var sidebar = document.getElementById("sidebar")

var chatarea = document.getElementById("chatwin-main")
var inputtext = document.getElementById("inputtext")

custom_navbar.innerHTML = navbarlayout.innerHTML
navbar.hidden = true;
custom_navbar.hidden = false;

sidebar.hidden = true;

function goback(){
    navbar.hidden = false;
    custom_navbar.hidden = true;
    sidebar.hidden = false;
    loadHTML("dash.asp")
}




function load(){
    nofiles_template = `
        <tr>
            <td>
                No files
            </td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
        </tr>
    `
    dir_template = `
        <tr>
            <td>
                <i class="material-icons">folder</i>
                <a onclick="navigate('{{name}}')">
                    {{name}}/
                </a>
            </td>
            <td>
                <button id="rn-{{name}}" title="Rename element" onclick="rename('{{name}}')" class="btn material-icons rn">label</button>
                <button id="rn_pr-{{name}}" class="btn material-icons rn d-none spinning">autorenew</button>

                <button id="del-{{name}}" title="Delete" onclick="remove('{{name}}');" class="btn material-icons del">delete_forever</button>
                <button id="del_pr-{{name}}" class="btn material-icons del d-none spinning">autorenew</button>
            </td>
            <td>Folder</td>
            <td>{{size}}</td>
        </tr>
    `
    file_template = `
        <tr>
            <td>
                <i class="material-icons">{{symbol}}</i>
                <a class="editr" edit="{{name}}">
                    {{name}}
                </a>
            </td>
            <td>
                <button id="dwn-{{name}}" title="Download file" onclick="download_file('{{name}}');" class="btn material-icons dwn">cloud_download</button>
                <button id="dwn_pr-{{name}}" title="stop downloading" class="btn material-icons dwn d-none spinning">autorenew</button>

                <button id="rn-{{name}}" title="Rename element" onclick="rename('{{name}}')" class="btn material-icons rn">label</button>
                <button id="rn_pr-{{name}}" class="btn material-icons rn d-none spinning">autorenew</button>

                <button id="bin-{{name}}" title="Move file to Trash" onclick="movebin('{{name}}');" class="btn material-icons bin">delete</button>
                <button id="bin_pr-{{name}}" class="btn material-icons bin d-none spinning">autorenew</button>
            </td>
            <td>{{type}}</td>
            <td>{{size}}</td>
        </tr>
    `
    file_trash_template = `
        <tr>
            <td>
                <i class="material-icons">{{symbol}}</i>
                <a class="editr" edit="{{name}}">
                    {{name}}
                </a>
            </td>
            <td>
                <button id="mv-n" title="Move to main folder" onclick="moveto('n')" class="btn material-icons mv">eject</button>
                <button id="mv_pr-n" class="btn material-icons mv d-none spinning">autorenew</button>

                <button id="del-{{name}}" title="Delete" onclick="remove('{{name}}');" class="btn material-icons del">delete_forever</button>
                <button id="del_pr-{{name}}" class="btn material-icons del d-none spinning">autorenew</button>
            </td>
            <td>{{type}}</td>
            <td>{{size}}</td>
        </tr>
    `
    error_template = `
        <tr>
            <td class="text-danger">{{error}}</td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
    `

    var table = document.getElementById("wrapperlist")

    table.innerHTML = ""
    
    $.getJSON(url, {
        path: path
    }, (data)=>{

        if(data.resp.length == 0){
            table.innerHTML = nofiles_template
        }

        for(var file of data.resp){
            if(file.type == "dir"){
                table.innerHTML += dir_template.replaceAll("{{name}}", file.name).replaceAll("{{size}}", file.size)
            }
        }
        for(var file of data.resp){
            if(file.type != "dir" && path != "trash"){
                table.innerHTML += file_template.replaceAll("{{symbol}}", file.symbol).replaceAll("{{name}}", file.name).replaceAll("{{type}}", file.name.split(".").pop()).replaceAll("{{size}}", file.size)
            }else if(file.type != "dir" && path == "trash"){
                table.innerHTML += file_trash_template.replaceAll("{{symbol}}", file.symbol).replaceAll("{{name}}", file.name).replaceAll("{{type}}", file.name.split(".").pop()).replaceAll("{{size}}", file.size)
            }
        }

        $(".editr").click(function(e){
            e.preventDefault()
            editor(e.target)
        })

    }).fail((err)=>{
        table.innerHTML = error_template.replace("{{error}}", `${err.status}: ${err.statusText}`)
    })
}
function navigate(to){
    function removeLast(str){
        var sstr = str.split("/")
        sstr.pop()
        console.log(sstr)
        if(sstr.length <= 1){
            return ""
        }
        sstr.pop()
        var retstr = ""
        for(var s of sstr){
            retstr += `${s}/`
        }
        return retstr
    }
    switch (to) {
        case "main":
            path = ""
            break;
        case "trash":
            path = "trash"
            break;
        case "back":
            path = removeLast(path)
            break;
        default:
            path += `${to}/`
            break;
    }
    document.getElementById("indexof").innerText = `/${path}`
    load()
}




function newFile(){
    var modal = new Overlay("overlay-wrapper", "modal2", "Create new File", "modal-xxl")

    modal.TextArea("data", "File Contents")
    var inp = modal.Input("filename", "text", "Filename")
    var btn = modal.Button("confirm", "Create", "btn-success")
    btn.addEventListener("click", function(ev){
        if(inp.value==""){return}
        btn.removeEventListener("click", ev)
        CnewFile(inp.value, document.getElementById("data").value)
    })
    modal.modal()

    function CnewFile(name, data){
        modal.modal("hide")

        $.get(url, {
            path: path,
            newfile: name,
            newfiledata: data,
            success: function(){
                setTimeout(load, 500)
            }
        }).fail(function(err){
            console.error(err)
            new OverlayError("overlay-wrapper", "err", `${err.status}: ${err.statusText} ${err.responseText}`).modal()
        })
    }

}


function newFolder(){
    var modal = new Overlay("overlay-wrapper", "modal1", "Create new Folder")

    var inp = modal.Input("foldername", "text", "Foldername")
    var btn = modal.Button("confirm", "Create", "btn-success")
    btn.addEventListener("click", function(ev){
        if(inp.value==""){return}
        btn.removeEventListener("click", ev)
        CnewFolder(inp.value)
    })
    modal.modal()

    function CnewFolder(name){
        modal.modal("hide")

        $.get(url, {
            path: path,
            newfolder: name,
            success: function(){
                setTimeout(load, 500)
            }
        }).fail(function(err){
            console.error(err)
            new OverlayError("overlay-wrapper", "err", `${err.status}: ${err.statusText} ${err.responseText}`).modal()
        })
    }

}


function upload() {
    var modal = new Overlay("overlay-wrapper", "modal4", "Upload File(s)")

    modal.Custom(`
    <div>
        <div class="progress" style="height:20px">
            <div class="progress-bar" style="width:0%;height:30px" id="progress"></div>
        </div>
    </div> <br>
    `)
    var inp = modal.FileInput("filesinp", true, "btn btn-primary")
    var btn = modal.Button("confirm", "Upload", "btn-success")
    btn.addEventListener("click", function(ev){
        if(inp.files.length == 0){return}
        btn.removeEventListener("click", ev)
        btn.disabled = true
        Cupload(inp.files)
    })
    modal.modal()

    function Cupload(names){
        var progress = document.getElementById("progress")
        var data = new FormData();
        var request = new XMLHttpRequest();

        var totalSize = 0;
        for(var file of names){totalSize += file.size}
        for(var file of names){
            data.append("upload", file)
            data.append("path", path)
        }

        request.upload.addEventListener("progress", function(e){
            var loaded = e.loaded;
            var total = e.total
            var percent_complete = (loaded / total) * 100;
            progress.setAttribute("style", `width: ${Math.floor(percent_complete)}%`);
            progress.innerText = `${Math.floor(percent_complete)}% uploaded`;
        })

        request.addEventListener("load", function (){
            modal.modal("hide")
            if (request.status == 200) {
                setTimeout(load, 500)
            }
            else {
                new OverlayError("overlay-wrapper", "err", `${request.status}: ${request.statusText} ${request.responseText}`).modal()
            }
        });

        request.open("POST", url)
        request.send(data)
    }
}


function download_file(filename) {
    function downloadURI(uri, name){
        var link = document.createElement("a");
        link.setAttribute('download', name);
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
    var btn = document.getElementById("dwn-" + filename);
    var btn_pr = document.getElementById("dwn_pr-" + filename);
    btn.classList.add("d-none");
    btn_pr.classList.remove("d-none");
    downloadURI(`${document.location.href}/${filename}`, filename)
    setTimeout(()=>{
        btn.classList.remove("d-none");
        btn_pr.classList.add("d-none");
    }, 500)
}


function rename(file){
    var modal = new Overlay("overlay-wrapper", "modal5", "Rename File / Folder")

    var inp = modal.Input("filename", "text", "New name", "", file)
    var btn = modal.Button("confirm", "Rename", "btn-warning")
    btn.addEventListener("click", function(ev){
        if(inp.value==""){return}
        btn.removeEventListener("click", ev)
        Crename(inp.value)
    })
    modal.modal()

    function Crename(name){
        modal.modal("hide")

        $.get(url, {
            path: path,
            rename: file,
            renameto: name,
            success: function(){
                setTimeout(load, 500)
            }
        }).fail(function(err){
            console.error(err)
            new OverlayError("overlay-wrapper", "err", `${err.status}: ${err.statusText} ${err.responseText}`).modal()
        })
    }
}


function movebin(file){
    var modal = new Overlay("overlay-wrapper", "modal6", "Move to Trash")

    modal.Text(`Move ${file} to Trash?`, "span", "text-warning")
    var btn = modal.Button("confirm", "Move to Trash", "btn-warning")
    btn.addEventListener("click", function(ev){
        btn.removeEventListener("click", ev)
        Cmovebin()
    })
    modal.modal()

    function Cmovebin(){
        modal.modal("hide")

        var request = new XMLHttpRequest();

        request.addEventListener("load", function(e){
            modal.modal("hide")
            if (request.status == 200) {
                load()
            }
            else {
                console.error(e)
                new OverlayError("overlay-wrapper", "err", `${request.status}: ${request.statusText} ${request.responseText}`).modal()
            }
        });

        request.open("GET", url + `?movebin=${file}&path=${path}`)
        request.send()

    }
}


function remove(file){
    var modal = new Overlay("overlay-wrapper", "modal6", "Remove File / Folder")

    modal.Text(`Delete ${file} forever?`, "span", "text-danger")
    var btn = modal.Button("confirm", "Delete", "btn-danger")
    btn.addEventListener("click", function(ev){
        btn.removeEventListener("click", ev)
        Cremove()
    })
    modal.modal()

    function Cremove(){
        modal.modal("hide")

        var request = new XMLHttpRequest();

        request.addEventListener("load", function(e){
            modal.modal("hide")
            if (request.status == 200) {
                load()
            }
            else {
                console.error(e)
                new OverlayError("overlay-wrapper", "err", `${request.status}: ${request.statusText} ${request.responseText}`).modal()
            }
        });

        request.open("GET", url + `?remove=${file}&path=${path}`)
        request.send()

    }
}


function editor(btn){
    function downloadURI(uri, name){
        var link = document.createElement("a");
        link.setAttribute('download', name);
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
    function checkSpecials(specs, check){
        for(var x of specs){
            if(check.includes(x)){return true}
        }
        return false
    }

    var textfiles = ["txt", "pdf", "py", "css", "js", "html", "asp", "c", "h", "cpp", "hpp", "class", "java", "cfg", "dll", "xml", "yml", "json"]
    var imagefiles = ["png", "jpg", "jpeg", "bmp", "gif", "jpeg", "ico", "tiff"]
    var audiofiles = ["mp3", "mp2", "wav", "ogg", "webm"]
    var videofiles = ["mp4", "mov", "flv", "avi"]
    var specialtexts = ["LICENSE"]

    var file = btn.getAttribute("edit")
    var extension = file.split(".").pop()
    var modal = new Overlay("overlay-wrapper", "modal1", `Showing: '${file}'`, "modal-xxl")
    modal.Button("dwnbtn", "Download", "btn-primary").addEventListener("click", function(){
        downloadURI(`${url}?path=${path}${file}`, file)
    })
    modal.Custom(`<div id="text-inner" class="p-3"></div>`)
    var wrapp = document.getElementById("text-inner")

    if(textfiles.includes(extension)){
        $.get({url: `${url}?path=${path}${file}`, success: function(data){wrapp.innerHTML = `<textarea class="p-2 form-control" disabled>${data}</textarea>`; modal.modal()}})
    }else if(imagefiles.includes(extension)){
        wrapp.innerHTML = `<img src="${url}?path=${path}${file}">`
        modal.modal()
    }else if(audiofiles.includes(extension)){
        wrapp.innerHTML = `<audio src="${url}?path=${path}${file}" controls>Your browser does not support HTML5 Audio</audio>`
        modal.modal()
    }else if(videofiles.includes(extension)){
        wrapp.innerHTML = `<video src="${url}?path=${path}${file}" controls>Your browser does not support HTML5 Video</video>`
        modal.modal()
    }else if(checkSpecials(specialtexts, file)){
        $.get({url: `${url}?path=${path}${file}`, success: function(data){wrapp.innerHTML = `<textarea class="p-2 form-control" disabled>${data}</textarea>`; modal.modal()}})
    }else{
        wrapp.innerText = `${file}: Unknown type, can't preview`
        modal.modal()
    }
}