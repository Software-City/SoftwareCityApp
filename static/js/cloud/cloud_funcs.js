function enable(){
    for(elem of document.getElementsByClassName("sidebarclass")){
        elem.classList.remove("disabled")
    }
    for(elem of document.getElementsByClassName("cloudswitch")){
        elem.classList.remove("disabled")
    }
}
function disable(){
    for(elem of document.getElementsByClassName("sidebarclass")){
        elem.classList.add("disabled")
    }
    for(elem of document.getElementsByClassName("cloudswitch")){
        elem.classList.add("disabled")
    }
}

function set_view(see, not_see){
    see.forEach(element => element.classList.remove("d-none"));
    not_see.forEach(element => element.classList.add("d-none"));
    reset();
}

function bin_view(){
    var upl_sec = document.getElementById("upload_section");
    var info = document.getElementById("folderinfo");
    if(curr_folder == "bin"){
        upl_sec.classList.add("d-none");
    }
    else{
        upl_sec.classList.remove("d-none");
    }
    info.textContent = "Folder " + curr_folder;
}

function mainbtnconstructor(objects, element){
    if(objects[0] == "all"){objects=["DWN", "MVT", "BIN", "DEL"]}
    var btnDWN = `<button id="dwn-${element}" title="Download file" onclick="download_file('${element}');" class="btn material-icons dwn">cloud_download</button>
                    <button id="dwn_pr-${element}" title="stop downloading" class="btn material-icons dwn d-none spinning">autorenew</button>`;
    var btnMVT = `<button id="mv-${element}" title="Move to different folder" onclick="moveto('${element}')" class="btn material-icons mv">keyboard_return</button>
                    <button id="mv_pr-${element}" class="btn material-icons mv d-none spinning">autorenew</button>`;
    var btnBIN = `<button id="bin-${element}" title="Move file to Trash" onclick="trymovebin('${element}');" class="btn material-icons bin">delete</button>
                    <button id="bin_pr-${element}" class="btn material-icons bin d-none spinning">autorenew</button>`;
    var btnDEL = `<button id="del-${element}" title="Delete file" onclick="trydeleteforever('${element}');" class="btn material-icons del">delete_forever</button>
                    <button id="del_pr-${element}" class="btn material-icons del d-none spinning">autorenew</button>`;
    var respo = "";
    respo += `<a href="#" class="list-group-item list-group-item-action">`
                // <span class="mdc-list-item__text">
    for(var x of objects) {
        if(x == "DWN"){respo += btnDWN}
        if(x == "MVT"){respo += btnMVT}
        if(x == "BIN"){respo += btnBIN}
        if(x == "DEL"){respo += btnDEL}
    }
    respo += `&nbsp;${element}`
    respo += `</li>`
    return respo;
}





load(curr_folder)
function load(folder){
    load_dirs()
    load_files(folder)
}

function load_dirs(){
    var drawer = document.getElementById("customfolders")
    var drawerobj = `<li class="mdc-list-item">
                        <a onclick="load('{{x}}')">
                            <i class="material-icons" aria-hidden="true">folder</i>
                            <span>{{x}}</span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        </a><button title="Delete folder" onclick="del_folder('{{x}}');" class="material-icons btn">close</button>
                    </li>
    `;
    var data = new FormData();
    var request = new XMLHttpRequest();
    data.append("dirs", "");
    request.responseType = "json";
    request.open("post", url);
    request.send(data);
    request.addEventListener("load", function (e) {
        if (request.status == 200) {
            var dirs = request.response.dirs;
            drawer.innerHTML = "";
            dirs.forEach(dir => drawer.innerHTML = drawer.innerHTML + drawerobj.replaceAll("{{x}}", dir));
        }
        else {
            console.log(request.status)
            show_alert(`Error getting dirs`, "danger");
        }
    });
}

function load_files(folder){
    var wrapperobj = document.getElementById("wrapperlist");
    curr_folder = folder;
    bin_view()
    var data = new FormData();
    var request = new XMLHttpRequest();
    data.append("files_from", folder);
    request.responseType = "json";
    request.open("post", url);
    request.send(data);
    request.addEventListener("load", function (e) {
        if (request.status == 200) {
            var elements = request.response.files;
            wrapperobj.innerHTML = "";
            if(curr_folder=="bin"){elements.forEach(element => wrapperobj.innerHTML = wrapperobj.innerHTML + mainbtnconstructor(["MVT", "DEL"], element));}
            else{elements.forEach(element => wrapperobj.innerHTML = wrapperobj.innerHTML + mainbtnconstructor(["DWN", "MVT", "BIN"], element));}
        }
        else {
            show_alert(`Error getting files: ${request.response.message}`, "danger");
        }
    });
}








function upload() {
    disable();
    if (!input.value) {
        show_alert("No file selected", "warning")
        enable()
        return;
    }
    var data = new FormData();
    var request = new XMLHttpRequest();
    request.responseType = "json";
    alert_wrapper.innerHTML = "";
    input.disabled = true;
    upload_btn.classList.add("d-none");
    loading_btn.classList.remove("d-none");
    cancel_btn.classList.remove("d-none");
    progress_wrapper.classList.remove("d-none");
    var file = input.files[0];
    var filesize = file.size;
    data.append("upload", file);
    data.append("currentfolder", curr_folder)
    request.upload.addEventListener("progress", function (e) {
        var loaded = e.loaded;
        var total = e.total
        var percent_complete = (loaded / total) * 100;
        progress.setAttribute("style", `width: ${Math.floor(percent_complete)}%`);
        progress_status.innerText = `${Math.floor(percent_complete)}% uploaded`;
    })
    request.addEventListener("load", function (e) {
        if (request.status == 200) {
            show_alert(`${request.response.message}`, "success");
        }
        else {
            show_alert(`Error uploading file`, "danger");
        }
        load_files(curr_folder);
        enable();
        reset();
    });
    request.addEventListener("error", function (e) {
        enable();
        reset();
        show_alert(`Error uploading file`, "warning");
    });
    request.addEventListener("abort", function (e) {
        enable();
        reset();
        show_alert(`Upload cancelled`, "primary");
    });
    request.open("post", url);
    request.send(data);
    cancel_btn.addEventListener("click", function () {
        enable();
        request.abort();
    })
}

function download_file(filename) {
    disable();
    var btn = document.getElementById("dwn-" + filename);
    var btn_pr = document.getElementById("dwn_pr-" + filename);
    var data = new FormData();
    var request = new XMLHttpRequest();
    btn.classList.add("d-none");
    btn_pr.classList.remove("d-none");
    progress_wrapper.classList.remove("d-none");
    request.responseType = "blob";
    data.append("download", `${curr_folder}/${filename}`);
    request.open("post", url);
    request.send(data);
    btn_pr.addEventListener("click", function () {
        request.abort();
        enable();
        set_view([btn], [btn_pr]);
        show_alert(`Download cancelled`, "primary");
        return;
    })
    request.addEventListener("load", function (e) {
        if (request.status == 200) {
            var file_blob = request.response;
            var blob_type = request.response.type;
            var file_size = Math.floor(request.response.size/(1024*1024));
            download(file_blob, filename, blob_type);
            show_alert(`Downloading file: '${filename}' (${file_size}MB)`, "success");
        }
        else {
            show_alert(`Error downloading file`, "danger");
        }
        enable();
        reset()
        btn.classList.remove("d-none");
        btn_pr.classList.add("d-none");
    });
    request.addEventListener("progress", function (e) {
    var loaded = e.loaded;
    var total = e.total;
    var loaded_mb = Math.floor(e.loaded/(1024*1024));
    var total_mb = Math.floor(e.total/(1024*1024));
    var percent_complete = (loaded / total) * 100;
    progress.setAttribute("style", `width: ${Math.floor(percent_complete)}%`);
    progress_status.innerText = `${Math.floor(percent_complete)}% (${loaded_mb}MB / ${total_mb}MB) transmitted`;
    })
}




// File moving /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var movetofolder = undefined
var tomove = undefined
function movetonow(){
    var to_folder = movetofolder;
    var filename = tomove;
    var btn = document.getElementById("mv-" + filename);
    var btn_pr = document.getElementById("mv_pr-" + filename);
    set_view([btn], [btn_pr]);
    var data = new FormData();
    var request = new XMLHttpRequest();
    data.append("cfolder", curr_folder);
    data.append("moveto", to_folder);
    data.append("file", filename);
    request.responseType = "json";
    request.open("post", url);
    request.send(data);
    request.addEventListener("load", function (e) {
        if (request.status == 200) {
            show_alert(`File "${filename}" moved to folder "${to_folder}"`, "success");
        }
        else {
            show_alert(`Error moving file`, "danger");
        }
        $("#moveModal").modal("hide");
        set_view([btn_pr], [btn]);
        load_files(curr_folder);
    });
}
function moveto(filename){
    loadmoveModalobjs();
    $("#moveModal").modal("show");
    tomove = filename;
}
function set_movefolder(folder){
    movetofolder = folder;
    document.getElementById("movetofolderbtndr").innerText = movetofolder;
}
function loadmoveModalobjs(){
    obj = `<a class="dropdown-item" onclick="set_movefolder('{{folder}}');">{{folder}}</a>`
    var modaldr = document.getElementById("movetofolderdr");
    var data = new FormData();
    var request = new XMLHttpRequest();
    data.append("dirs", "");
    request.responseType = "json";
    request.open("post", url);
    request.send(data);
    request.addEventListener("load", function (e) {
        if (request.status == 200) {
            var dirs = request.response.dirs;
            dirs.push("bin");dirs.push("main")
            modaldr.innerHTML = "";
            dirs.forEach(dir => modaldr.innerHTML = modaldr.innerHTML + obj.replaceAll("{{folder}}", dir));
        }
        else {
            console.log(request.status)
            show_alert(`Error getting dirs`, "danger");
        }
    });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Moving to trash ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var movefile = undefined
function movetobin(){
    $("#binModal").modal("hide")
    var data = new FormData();
    var request = new XMLHttpRequest();
    var filename = movefile;
    var btn = document.getElementById("bin-" + filename);
    var btn_pr = document.getElementById("bin_pr-" + filename);
    btn.classList.add("d-none");
    btn_pr.classList.remove("d-none");
    data.append("folder", curr_folder);
    data.append("movbin", filename);
    request.open("post", url);
    request.send(data);
    request.addEventListener("load", function (e) {
        if (request.status == 200) {
            show_alert(`Moved file: '${filename}' to bin`, "success");
        }
        else {
            show_alert(`Error moving file`, "danger");
        }
        load_files(curr_folder);
        btn.classList.remove("d-none");
        btn_pr.classList.add("d-none");
    });
}
function trymovebin(filename){
    movefile = filename;
    $("#binModal").modal("show")
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Delete file ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var deleterfile = undefined;
function deleteforever(){
    $("#deletefileModal").modal("hide")
    var data = new FormData();
    var request = new XMLHttpRequest();
    var filename = deleterfile;
    var btn = document.getElementById("del-" + filename);
    var btn_pr = document.getElementById("del_pr-" + filename);
    btn.classList.add("d-none");
    btn_pr.classList.remove("d-none");
    data.append("delete", `${curr_folder}/${filename}`);
    request.open("post", url);
    request.send(data);
    request.addEventListener("load", function (e) {
        if (request.status == 200) {
            show_alert(`Deleted file forever: '${filename}'`, "success");
        }
        else {
            show_alert(`Error deleting file`, "danger");
        }
        load_files(curr_folder)
        btn.classList.remove("d-none");
        btn_pr.classList.add("d-none");
    });
}
function trydeleteforever(filename){
    deleterfile = filename;
    $("#deletefileModal").modal("show")
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function del_folder(folder){
    var data = new FormData();
    var request = new XMLHttpRequest();
    request.responseType = "json";
    data.append("delfolder", folder);
    request.open("post", url);
    request.send(data);
    request.addEventListener("load", function (e) {
        if (request.status == 200) {
            show_alert(`Deleted folder: '${folder}'`, "success");
        }
        else {
            show_alert(`${request.response.message}`, "danger");
        }
        load("main")
    })
}

// New Folder ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function new_folder(){
    var infotext = document.getElementById("newfolderinfo")
    var foldername = document.getElementById("foldernameinput")
    if(foldername.value!=""){
        var data = new FormData();
        var request = new XMLHttpRequest();
        data.append("newfolder", foldername.value);
        request.open("post", url);
        request.send(data);
        request.addEventListener("load", function () {
            if (request.status == 200) {
                show_alert(`Created folder: '${foldername.value}'`, "success");
            }
            else {
                show_alert(`Error creating folder`, "danger");
            }
            $("#newfolderModal").modal("hide")
            load(foldername.value);
        })
    }else{
        infotext.innerText = "Please enter a foldername!"
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



