const iswin32 = process.platform === "win32"
const fs = require('fs');
var setpath;
var setfile;
var settings;
if (iswin32){setpath = __dirname.split("\\"); setpath.pop()}
else{setpath = __dirname.split("/"); setpath.pop()}
const settingsfile = "settings.json";
if(iswin32){
    setfile = require("os").homedir() + "/AppData/Roaming/Software\ City\ App/" + settingsfile;
}else{
    setfile = require("os").homedir() + "/.config/Software\ City\ App/" + settingsfile;
}

try {
    exports.init_settings = init_settings;
    exports.setVal = setVal;
    exports.getVal = getVal;
} catch (error) {
    init_settings();
}


function init_settings (){
    const def_config = {"theme":"dark","systemtray":false,"loggedin":false,"credentials":[],"autoupdate":true,"defstartpage":"Dashboard","serverstartpage":"Teamspeak","cloudstartpage":"MyCloud"}
    if(!fs.existsSync(setfile)){
        fs.writeFileSync(setfile, JSON.stringify(def_config));
    }
    settings = JSON.parse(fs.readFileSync(setfile, "utf8"));
}

function commit(){
    fs.writeFileSync(setfile, JSON.stringify(settings));
}

function setVal(key, val){
    settings[key] = val;
    commit();
}

function getVal(key){
    return settings[key];
}