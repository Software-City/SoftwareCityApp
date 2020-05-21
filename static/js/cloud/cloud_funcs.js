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
    var btnRNM = `<button id="rn-${element}" title="Rename element" onclick="rename('${element}')" class="btn material-icons rn">label</button>
                    <button id="rn_pr-${element}" class="btn material-icons rn d-none spinning">autorenew</button>`;
    var btnBIN = `<button id="bin-${element}" title="Move file to Trash" onclick="trymovebin('${element}');" class="btn material-icons bin">delete</button>
                    <button id="bin_pr-${element}" class="btn material-icons bin d-none spinning">autorenew</button>`;
    var btnDEL = `<button id="del-${element}" title="Delete file" onclick="trydeleteforever('${element}');" class="btn material-icons del">delete_forever</button>
                    <button id="del_pr-${element}" class="btn material-icons del d-none spinning">autorenew</button>`;
    var btnNONE = `-`
    var respo = "";
    for(var x of objects) {
        if(x == "DWN"){respo += btnDWN}
        if(x == "MVT"){respo += btnMVT}
        if(x == "RNM"){respo += btnRNM}
        if(x == "BIN"){respo += btnBIN}
        if(x == "DEL"){respo += btnDEL}
        if(x == "none"){respo += btnNONE}
    }
    return respo;
}

function tableconstructor(name, size, type, btns){
    var nametag = name;
    if(type=="auto"){
        type = name.split(".")
        if(type.length > 1){
            type = "." + type.reverse()[0]
            nametag = nametag.split(type)[0]
        }else{
            type = "file"
        }
    }
    var table_obj = `
                    <tr>
                        <td>${nametag}</td>
                        <td>${mainbtnconstructor(btns, name)}</td>
                        <td>${type}</td>
                        <td>${size}</td>
                    </tr>
                    `;
    return table_obj;
}









load(curr_folder)
function load(folder){
    load_dirs()
    load_files(folder)
}

function load_dirs(){
    var drawer = document.getElementById("customfolders")
    var drawerobj = `<li>
                        <a class="clearfix foldersymbol">
                            <i class="material-icons btn" aria-hidden="true" style="padding-right:0px;" onclick="load('{{x}}')">folder</i>
                            <span onclick="load('{{x}}')" class="folderclick">{{x}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <button title="Delete folder" onclick="del_folder('{{x}}');" class="material-icons btn float-right">close</button>
                        </a>
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
            dirs.sort()
            drawer.innerHTML = "";
            dirs.forEach(dir => drawer.innerHTML = drawer.innerHTML + drawerobj.replaceAll("{{x}}", dir));
        }
        else {
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
            console.log(elements.length)
            if(elements.length==0){wrapperobj.innerHTML = tableconstructor("This folder is empty", "-", "-", ["none"]);}
            else{
                wrapperobj.innerHTML = "";
                elements.sort()
                if(curr_folder=="bin"){elements.forEach(element => wrapperobj.innerHTML = wrapperobj.innerHTML + tableconstructor(element, "NaN", "auto", ["MVT", "DEL"]));}
                else{
                    for(element of elements){
                        if(element=="c0dc6828-d6b7-4f3f-80ab-2fe2282c86ef"){
                            wrapperobj.innerHTML = wrapperobj.innerHTML + tableconstructor(element, "-", "auto", ["DWN", "MVT", "RNM", "BIN", "DEL"])
                        }else{
                            wrapperobj.innerHTML = wrapperobj.innerHTML + tableconstructor(element, "NaN", "auto", ["DWN", "MVT", "BIN"])
                        }
                    }
                }
            }
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
            show_alert(`Error downloading file: ${request.status}`, "danger");
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
    if(foldername.value!="" && foldername.value.length <= 12){
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
            foldername.value = ""
        })
    }else{
        infotext.innerText = "Please enter a valid foldername!"
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



