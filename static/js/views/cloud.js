var user = [settings.account.user.name, settings.account.user.password]


String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};


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
                <button id="dwn-{{name}}" title="Download folder as zip" onclick="download_dir('{{name}}');" class="btn material-icons dwn">archive</button>
                <button id="dwn_pr-{{name}}" title="stop downloading" class="btn material-icons dwn d-none spinning">autorenew</button>

                <button id="mv-{{name}}" title="Move to folder" onclick="moveto('{{name}}')" class="btn material-icons mv">low_priority</button>
                <button id="mv_pr-{{name}}" class="btn material-icons mv d-none spinning">autorenew</button>
            
                <button id="rn-{{name}}" title="Rename element" onclick="rename('{{name}}')" class="btn material-icons rn">label</button>
                <button id="rn_pr-{{name}}" class="btn material-icons rn d-none spinning">autorenew</button>

                <button id="bin-{{name}}" title="Move folder to Trash" onclick="movebin('{{name}}');" class="btn material-icons bin">delete</button>
                <button id="bin_pr-{{name}}" class="btn material-icons bin d-none spinning">autorenew</button>
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

                <button id="mv-{{name}}" title="Move to folder" onclick="moveto('{{name}}')" class="btn material-icons mv">low_priority</button>
                <button id="mv_pr-{{name}}" class="btn material-icons mv d-none spinning">autorenew</button>

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
                <button id="mv-{{name}}" title="Restore to main folder" onclick="restore('{{name}}')" class="btn material-icons mv">restore_from_trash</button>
                <button id="mv_pr-{{name}}" class="btn material-icons mv d-none spinning">autorenew</button>

                <button id="del-{{name}}" title="Delete" onclick="remove('{{name}}');" class="btn material-icons del">delete_forever</button>
                <button id="del_pr-{{name}}" class="btn material-icons del d-none spinning">autorenew</button>
            </td>
            <td>{{type}}</td>
            <td>{{size}}</td>
        </tr>
    `
    dir_trash_template = `
        <tr>
            <td>
                <i class="material-icons">folder</i>
                <a onclick="navigate('{{name}}')">
                    {{name}}/
                </a>
            </td>
            <td>
                <button id="mv-{{name}}" title="Restore to main folder" onclick="restore('{{name}}')" class="btn material-icons mv">restore_from_trash</button>
                <button id="mv_pr-{{name}}" class="btn material-icons mv d-none spinning">autorenew</button>

                <button id="del-{{name}}" title="Delete" onclick="remove('{{name}}');" class="btn material-icons del">delete_forever</button>
                <button id="del_pr-{{name}}" class="btn material-icons del d-none spinning">autorenew</button>
            </td>
            <td>Folder</td>
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
    loader = `
        <div class="spinner-border"></div>
    `

    var table = document.getElementById("wrapperlist")

    table.innerHTML = loader

    $.getJSON(url, {
        path: path,
        passwd: user[1]
    }, (data)=>{

        if(data.resp.length == 0){
            table.innerHTML = nofiles_template
        }else{
            table.innerHTML = ""
        }

        for(var file of data.resp){
            if(path == "trash/"){
                if(file.type == "dir"){
                    table.innerHTML += dir_trash_template.replaceAll("{{name}}", file.name).replaceAll("{{size}}", file.size)
                }
            }else{
                if(file.type == "dir"){
                    table.innerHTML += dir_template.replaceAll("{{name}}", file.name).replaceAll("{{size}}", file.size)
                }
            }
        }
        for(var file of data.resp){
            if(path == "trash/"){
                if(file.type != "dir"){
                    table.innerHTML += file_trash_template.replaceAll("{{symbol}}", file.symbol).replaceAll("{{name}}", file.name).replaceAll("{{type}}", file.name.split(".").pop()).replaceAll("{{size}}", file.size)
                }
            }else{
                if(file.type != "dir"){
                    table.innerHTML += file_template.replaceAll("{{symbol}}", file.symbol).replaceAll("{{name}}", file.name).replaceAll("{{type}}", file.name.split(".").pop()).replaceAll("{{size}}", file.size)
                }
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
            if(path===""){return ;}
            path = ""
            break;
        case "trash":
            if(path==="trash/"){return;}
            path = "trash/"
            break;
        case "back":
            if(path===""){return;}
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
            passwd: user[1],
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
            passwd: user[1],
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

        request.open("POST", `${url}?path=${path}&passwd=${user[1]}`)
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
    downloadURI(`${url}?path=${path}${filename}&passwd=${user[1]}`, filename)
    setTimeout(()=>{
        btn.classList.remove("d-none");
        btn_pr.classList.add("d-none");
    }, 500)
}


function download_dir(filename) {
    var modal = new Overlay("overlay-wrapper", "modal9", "Download as ZIP", "modal-xl")
    modal.Custom(`
    <div>
        <div class="progress" style="height:20px">
            <div class="progress-bar" style="width:0%;height:30px" id="progress">Compressing...</div>
        </div>
        <br><br>
        <span id="info-mspan" class="text-warning">${filename} will be compressed into a .zip archive and then downloaded</span>
    </div><br>
    `)
    var txt = document.getElementById("info-mspan")
    var btn = modal.Button("confirm", "Continue", "btn-success")
    btn.addEventListener("click", function(ev){
        txt.innerHTML = "Do not click any where else, as this might interupt the process"
        modal.disableBTN(true)
        btn.removeEventListener("click", ev)
        btn.disabled = true
        Cdownload()
    })
    modal.modal()

    function Cdownload(){
        var progress = document.getElementById("progress")
        var request = new XMLHttpRequest();
        request.responseType = "blob";
        request.open("GET", `${url}?downloaddir=${filename}&path=${path}&passwd=${user[1]}`);
        request.send();
        progress.setAttribute("style", `width: 100%`);
        progress.classList.add("progress-bar-striped", "progress-bar-animated")
        request.addEventListener("load", function (e) {
            if (request.status == 200) {
                var file_blob = request.response;
                var blob_type = request.response.type;
                download(file_blob, filename, blob_type);
                setTimeout(()=>{modal.modal("hide")}, 300)
            }
            else {
                console.error(e)
                modal.modal("hide")
                new OverlayError("overlay-wrapper", "err", `${request.status}: ${request.statusText} ${request.responseText}`).modal()
            }
        });
        request.addEventListener("progress", function (e) {
            progress.classList.remove("progress-bar-striped", "progress-bar-animated")
            var loaded = e.loaded;
            var total = e.total;
            var loaded_mb = Math.floor(e.loaded/(1024*1024));
            var total_mb = Math.floor(e.total/(1024*1024));
            var percent_complete = (loaded / total) * 100;
            progress.setAttribute("style", `width: ${Math.floor(percent_complete)}%`);
            progress.innerText = `${Math.floor(percent_complete)}% (${loaded_mb}MB / ${total_mb}MB) transmitted`;
        })
        btn.innerText = "Abort"
        btn.classList.replace("btn-success", "btn-warning")
        btn.addEventListener("click", function(ev){
            btn.removeEventListener("click", ev)
            request.abort()
        })
    }
}


function moveto(file){
    var modal = new Overlay("overlay-wrapper", "modal8", "Move to", "modal-xl")

    modal.Text(`Move ${file} to:`, "span")
    modal.Custom(`<div><ul id="text-inner-mv" class="expl"> <div class="spinner-border text-primary"></div> Loading sub-direcories... </ul></div>`)
    var wrap = document.getElementById("text-inner-mv")

    var btn = modal.Button("confirm", "Move", "btn-warning")
    btn.disabled = true
    modal.modal()

    $.get(url, {path: path, getdirs: null, passwd: user[1]}, function(data){
        wrap.innerHTML = ""
        var cwfr = ""
        var selection;
        function fetchdirs(jsn, wrapper){
            for(var dir of jsn){
                cwfr = `idddn-${String(Math.floor(Math.random()*10000000000))}`
                wrapper.innerHTML += `
                <li class="indent">
                    <i class="material-icons">folder</i>
                    <a class="select-folder" data-toggle="collapse" data-target="#${cwfr}" val="${dir.path}">${dir.dir}</a>
                    <ul id="${cwfr}" class="collapse"></ul>
                </li>
                `
                fetchdirs(dir.subdirs, document.getElementById(cwfr))
            }
        }
        fetchdirs(data.dirs, wrap)
        $(".select-folder").on("click", function(e){
            btn.disabled = false
            $(".select-folder").removeClass("on")
            e.target.classList.add("on")
            selection = e.target.getAttribute("val")
            btn.addEventListener("click", function(ev){
                btn.removeEventListener("click", ev)
                Cmoveto(selection)
            })
        })
    })

    function Cmoveto(selected){
        modal.modal("hide")

        var request = new XMLHttpRequest();

        request.addEventListener("load", function(e){
            modal.modal("hide")
            if (request.status == 200) {
                setTimeout(load, 500)
            } else {
                console.error(e)
                new OverlayError("overlay-wrapper", "err", `${request.status}: ${request.statusText} ${request.responseText}`).modal()
            }
        });

        request.open("GET", url + `?move=${file}&moveto=${selected}&path=${path}`)
        request.send()

    }
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
            passwd: user[1],
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

        request.open("GET", url + `?movebin=${file}&path=${path}&passwd=${user[1]}`)
        request.send()

    }
}


function restore(file){
    var modal = new Overlay("overlay-wrapper", "modal7", "Restore")

    modal.Text(`Restore ${file} to Main folder?`, "span")
    var btn = modal.Button("confirm", "Restore", "btn-success")
    btn.addEventListener("click", function(ev){
        btn.removeEventListener("click", ev)
        Crestore()
    })
    modal.modal()

    function Crestore(){
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

        request.open("GET", url + `?restore=${file}&path=${path}&passwd=${user[1]}`)
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

        request.open("GET", url + `?remove=${file}&path=${path}&passwd=${user[1]}`)
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

    // editables
    var textfiles = ["txt", "py", "css", "js", "asp", "c", "h", "cpp", "cfg", "yml", "json"]
    var opendocfiles = ["odt"]
    var xhtmlfiles = ["html", "xml", "xhtml"]
    var markdownfiles = ["md"]

    // statics
    var imagefiles = ["png", "jpg", "jpeg", "bmp", "gif", "jpeg", "ico", "tiff"]
    var audiofiles = ["mp3", "mp2", "wav", "ogg", "webm"]
    var videofiles = ["mp4", "mov", "flv", "avi"]

    // other
    var specialtexts = ["LICENSE", "README"]


    var file = btn.getAttribute("edit")
    var extension = file.split(".").pop()

    class PreviewModal{
        constructor(){
            var Modal = new Overlay("overlay-wrapper", "modal1", `Showing: '${file}'`, "modal-xxl")
            Modal.Button("dwnbtn", "Download", "btn-primary").addEventListener("click", function(){
                downloadURI(`${url}?path=${path}${file}&passwd=${user[1]}`, file)
            })
            Modal.Custom(`<div id="text-inner" class="p-3"></div>`)
            this.overlay = Modal
            this.element = document.getElementById("text-inner")
        }
        show(){
            this.overlay.modal()
        }
    }
    class EditModal{
        constructor(){
            var Modal = new Overlay("overlay-wrapper", "modal", `Editing: '${file}'`, "modal-xxl")
            Modal.Button("dwnbtn", "Download", "btn-primary").addEventListener("click", function(){
                downloadURI(`${url}?path=${path}/${file}&passwd=${user[1]}`, file)
            })
            Modal.Custom(`<div id="text-inner"></div>`)
            this.overlay = Modal
            this.element = document.getElementById("text-inner")
        }
        show(){
            this.overlay.modal()
        }
    }


    var editorUrl = `${url}?path=${path}${file}&passwd=${user[1]}`




    function showText(){
        $.get({
            url: editorUrl,
            dataType: "text",
            success: function(data){
                var html =
                    `
                <textarea class="form-control" disabled>${data}</textarea>
                `
                var md = new PreviewModal()
                md.element.innerHTML = html
                md.show()
            }
        })

    }
    function editText(){
        function save(data){
            $.get(editorUrl, {
                save: data
            }).fail(function(err){
                console.error(err)
                new OverlayError("overlay-wrapper", "err", `${err.status}: ${err.statusText} ${err.responseText}`).modal()
            })
        }
        $.get({
            url: editorUrl,
            dataType: "text",
            cache: false,
            success: function(data){
                var html =
                    `
                <button class="btn btn-warning" id="editm-btn">Save</button>
                <textarea class="form-control" id="editm-area">${data}</textarea>
                `

                var md = new EditModal()
                md.element.innerHTML = html
                md.show()

                var btn = document.getElementById("editm-btn")
                var area = document.getElementById("editm-area")

                btn.addEventListener("click", ()=>{save(area.value)})
                // area.addEventListener("change", ()=>{save(area.value)})
            }
        })
    }
    function editXHTML(){
        function save(data, frame){
            $.get(editorUrl, {
                save: data,
                success: function(){
                    frame.contentWindow.location.reload()
                }
            }).fail(function(err){
                console.error(err)
                new OverlayError("overlay-wrapper", "err", `${err.status}: ${err.statusText} ${err.responseText}`).modal()
            })
        }
        $.get({
            url: editorUrl,
            dataType: "text",
            cache: false,
            success: function(data){
                var html =
                    `
                <ul class="nav nav-tabs">
                    <li class="nav-item">
                        <a class="nav-link active" data-toggle="tab" href="#view">Preview</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-toggle="tab" href="#edit">Edit</a>
                    </li>
                </ul>
                <div class="tab-content">
                    <div class="tab-pane active p-2" id="view">
                        <iframe id="show-html">loading...</iframe>
                    </div>
                    <div class="tab-pane fade p-2" id="edit">
                        <button class="btn btn-warning" id="editm-btn">Save</button>
                        <textarea class="form-control" id="editm-area">${data}</textarea>
                    </div>
                </div>
                `

                var mod = new EditModal()
                mod.element.innerHTML = html
                mod.show()

                var prew = document.getElementById("show-html")

                var btn = document.getElementById("editm-btn")
                var area = document.getElementById("editm-area")

                prew.src = editorUrl

                btn.addEventListener("click", ()=>{save(area.value, prew)})
                // area.addEventListener("change", ()=>{save(area.value, prew)})
            }
        })
    }
    function editMarkdown(){
        var md = new remarkable.Remarkable({
            html:         true,
            xhtmlOut:     false,
            breaks:       true,

            typographer:  true,

            quotes: '“”‘’',

            highlight: function (/*str, lang*/) { return ''; }
        })
        function save(data){
            $.get(editorUrl, {
                save: data
            }).fail(function(err){
                console.error(err)
                new OverlayError("overlay-wrapper", "err", `${err.status}: ${err.statusText} ${err.responseText}`).modal()
            })
        }
        $.get({
            url: editorUrl,
            dataType: "text",
            cache: false,
            success: function(data){
                var html =
                    `
                <ul class="nav nav-tabs">
                    <li class="nav-item">
                        <a class="nav-link active" data-toggle="tab" href="#view">Preview</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-toggle="tab" href="#edit">Edit</a>
                    </li>
                </ul>
                <div class="tab-content">
                    <div class="tab-pane active" id="view">
                        <div id="show-md">loading...</div>
                    </div>
                    <div class="tab-pane fade" id="edit">
                        <button class="btn btn-warning" id="editm-btn">Save</button>
                        <textarea class="form-control" id="editm-area">${data}</textarea>
                    </div>
                </div>
                `

                var mod = new EditModal()
                mod.element.innerHTML = html
                mod.show()

                var prew = document.getElementById("show-md")

                var btn = document.getElementById("editm-btn")
                var area = document.getElementById("editm-area")

                prew.innerHTML = md.render(data)

                btn.addEventListener("click", ()=>{save(area.value); prew.innerHTML = md.render(area.value)})
                // area.addEventListener("change", ()=>{save(area.value); prew.innerHTML = md.render(area.value)})
            }
        })
    }
    function showImage(){
        var html =
            `
        <img src="${editorUrl}">
        `
        var mod = new PreviewModal()
        mod.element.innerHTML = html
        mod.show()
    }
    function showAudio(){
        var html =
            `
        <audio src="${editorUrl}" controls>Your browser does not support HTML5 Audio</audio>
        `
        var mod = new PreviewModal()
        mod.element.innerHTML = html
        mod.show()
    }
    function showVideo(){
        var html =
            `
        <video src="${editorUrl}" controls>Your browser does not support HTML5 Video</video>
        `
        var mod = new PreviewModal()
        mod.element.innerHTML = html
        mod.show()
    }
    function showOther(){
        var html =
            `
        <div class="container">
            <p>Unknown file type</p>
            <p>You can try opening as a <button class="btn btn-warning" id="allsh-btn">Textfile</button></p>
            <p class="text-warning">Note: Incompatible files may load forever or may crash this tab if opened as a text file!</p>
        </div>
        `
        var mod = new PreviewModal()
        mod.element.innerHTML = html
        document.getElementById("allsh-btn").addEventListener("click", ()=>{
            mod.overlay.modal("hide")
            showText()
        })
        mod.show()
    }

    if(textfiles.includes(extension)){
        editText()
    }else if(opendocfiles.includes(extension)){
        new OverlayError("overlay-wrapper", "err", `Feature will be added soon...`).modal()
    }else if(xhtmlfiles.includes(extension)){
        editXHTML()
    }else if(markdownfiles.includes(extension)){
        editMarkdown()
    }else if(imagefiles.includes(extension)){
        showImage()
    }else if(audiofiles.includes(extension)){
        showAudio()
    }else if(videofiles.includes(extension)){
        showVideo()
    }else if(checkSpecials(specialtexts, file)){
        showText()
    }else{
        showOther()
    }
}















function download(data, strFileName, strMimeType) {
    var self = window,
        u = "application/octet-stream",
        m = strMimeType || u,
        x = data,
        D = document,
        a = D.createElement("a"),
        z = function(a){return String(a);},
        B = self.Blob || self.MozBlob || self.WebKitBlob || z,
        BB = self.MSBlobBuilder || self.WebKitBlobBuilder || self.BlobBuilder,
        fn = strFileName || "download",
        blob,
        b,
        ua,
        fr;
    if(String(this)==="true"){
        x=[x, m];
        m=x[0];
        x=x[1];
    }
    if(String(x).match(/^data\:[\w+\-]+\/[\w+\-]+[,;]/)){
        return navigator.msSaveBlob ?
            navigator.msSaveBlob(d2b(x), fn) :
            saver(x) ;
    }
    try{
        blob = x instanceof B ?
            x :
            new B([x], {type: m}) ;
    }catch(y){
        if(BB){
            b = new BB();
            b.append([x]);
            blob = b.getBlob(m); // the blob
        }

    }
    function d2b(u) {
        var p= u.split(/[:;,]/),
            t= p[1],
            dec= p[2] == "base64" ? atob : decodeURIComponent,
            bin= dec(p.pop()),
            mx= bin.length,
            i= 0,
            uia= new Uint8Array(mx);
        for(i;i<mx;++i) uia[i]= bin.charCodeAt(i);
        return new B([uia], {type: t});
    }
    function saver(url, winMode){
        if ('download' in a) {
            a.href = url;
            a.setAttribute("download", fn);
            a.innerHTML = "downloading...";
            D.body.appendChild(a);
            setTimeout(function() {
                a.click();
                D.body.removeChild(a);
                if(winMode===true){setTimeout(function(){ self.URL.revokeObjectURL(a.href);}, 250 );}
            }, 66);
            return true;
        }
        var f = D.createElement("iframe");
        D.body.appendChild(f);
        if(!winMode){
            url="data:"+url.replace(/^data:([\w\/\-\+]+)/, u);
        }
        f.src = url;
        setTimeout(function(){ D.body.removeChild(f); }, 333);
    }
    if (navigator.msSaveBlob) {
        return navigator.msSaveBlob(blob, fn);
    }
    if(self.URL){
        saver(self.URL.createObjectURL(blob), true);
    }else{
        if(typeof blob === "string" || blob.constructor===z ){
            try{
                return saver( "data:" +  m   + ";base64,"  +  self.btoa(blob)  );
            }catch(y){
                return saver( "data:" +  m   + "," + encodeURIComponent(blob)  );
            }
        }
        fr=new FileReader();
        fr.onload=function(e){
            saver(this.result);
        };
        fr.readAsDataURL(blob);
    }
    return true;
}