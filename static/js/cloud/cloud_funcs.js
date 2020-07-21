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

    var table = document.getElementById("wrapperlist")

    table.innerHTML = ""
    
    $.getJSON(url, {
        path: path
    }, (data)=>{

        if(data.resp.length == 0){
            table.innerHTML = nofiles_template
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
            path = "trash/"
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
        request.open("GET", `${url}?downloaddir=${filename}&path=${path}`);
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

    $.get(url, {path: path, getdirs: null}, function(data){
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
            }
            else {
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

        request.open("GET", url + `?restore=${file}&path=${path}`)
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

    var textfiles = ["txt", "pdf", "py", "css", "js", "html", "asp", "c", "h", "cpp", "hpp", "class", "java", "cfg", "xml", "yml", "json"]
    var imagefiles = ["png", "jpg", "jpeg", "bmp", "gif", "jpeg", "ico", "tiff"]
    var audiofiles = ["mp3", "mp2", "wav", "ogg", "webm"]
    var videofiles = ["mp4", "mov", "flv", "avi"]
    var specialtexts = ["LICENSE"]

    var file = btn.getAttribute("edit")
    var extension = file.split(".").pop()
    var modal = new Overlay("overlay-wrapper", "modal1", `Showing: '${file}'`, "modal-xxl")
    modal.Button("dwnbtn", "Download", "btn-primary").addEventListener("click", function(){
        downloadURI(url + "/" + file, file)
    })
    modal.Custom(`<div id="text-inner" class="p-3"></div>`)
    var wrapp = document.getElementById("text-inner")

    function showAllAsTxt(){
        wrapp.innerHTML = `<div class="spinner-border text-primary"></div>`
        $.get({
            url: url + `/${file}`,
            dataType: "text",
            success: function(data){wrapp.innerHTML = `<textarea class="p-2 form-control" disabled>${data}</textarea>`; modal.modal()}
        })
    }

    if(textfiles.includes(extension)){
        $.get({
            url: `${url}?path=${path}${file}`,
            dataType: "text",
            success: function(data){wrapp.innerHTML = `<textarea class="p-2 form-control" disabled>${data}</textarea>`; modal.modal()}
        })
    }else if(imagefiles.includes(extension)){
        wrapp.innerHTML = `<img src="${url + "/" + file}">`
        modal.modal()
    }else if(audiofiles.includes(extension)){
        wrapp.innerHTML = `<audio src="${url + "/" + file}" controls>Your browser does not support HTML5 Audio</audio>`
        modal.modal()
    }else if(videofiles.includes(extension)){
        wrapp.innerHTML = `<video src="${url + "/" + file}" controls>Your browser does not support HTML5 Video</video>`
        modal.modal()
    }else if(checkSpecials(specialtexts, file)){
        $.get({url: `${url}?path=${path}${file}`, success: function(data){wrapp.innerHTML = `<textarea class="p-2 form-control" disabled>${data}</textarea>`; modal.modal()}})
    }else{
        wrapp.innerText = `${file}: Unknown type, can't preview`
        wrapp.innerHTML += `
        <p>
            <button id="allsh-btn" class="btn btn-warning">Try opening as a fextfile</button> 
        </p>
        `
        document.getElementById("allsh-btn").addEventListener("click", showAllAsTxt)
        modal.modal()
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