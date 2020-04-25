String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

// Array.prototype.length

function show_alert(message, alert) {
    var alert_wrapper = document.getElementById("alert_wrapper");
    function destroy(){alert_wrapper.innerHTML=""}
    alert_wrapper.innerHTML = `
    <div id="alert" class="alert alert-${alert} alert-dismissible fade show" role="alert">
        <span>${message}</span>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close" onclick="reset_alert()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>`
}

function reset_alert(){
    var alert_wrapper = document.getElementById("alert_wrapper");
    alert_wrapper.innerHTML="";
}

function openExplorer(path){
    const {shell} = require('electron')
    shell.openItem('folderpath')
}