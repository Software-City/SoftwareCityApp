const iswin32 = process.platform === "win32"
const fs = require('fs');

var setfile;
var tempfile;

var settings;
var tempdata;
var cachedir;

const settingsfile = "settings.json";
const tempfilefile = "temp.json";

if(iswin32){
    setfile = require("os").homedir() + "/AppData/Roaming/Software\ City\ App/" + settingsfile;
    tempfile = require("os").homedir() + "/AppData/Roaming/Software\ City\ App/" + tempfilefile;
    cachedir = require("os").homedir() + "/AppData/Roaming/Software\ City\ App/";
}else{
    setfile = require("os").homedir() + "/.config/Software\ City\ App/" + settingsfile;
    tempfile = require("os").homedir() + "/.config/Software\ City\ App/" + tempfilefile;
    cachedir = require("os").homedir() + "/.config/Software\ City\ App/";
}

try {
    exports.init_settings = init_settings;
    exports.setVal = setVal;
    exports.getVal = getVal;
    exports.setTempVal = setTempVal;
    exports.getTempVal = getTempVal;
    exports.cachedir = cachedir;
} catch (error) {
    init_settings();
}


function init_settings (){
    const def_config = {"theme":"dark","systemtray":false,"loggedin":false,"credentials":[],"autoupdate":true,"defstartpage":"Dashboard","serverstartpage":"Teamspeak","cloudstartpage":"MyCloud"}
    if(!fs.existsSync(setfile)){
        fs.writeFileSync(setfile, JSON.stringify(def_config));
    }
    if(!fs.existsSync(tempfile)){
        fs.writeFileSync(tempfile, JSON.stringify({}));
    }
    settings = JSON.parse(fs.readFileSync(setfile, "utf8"));
    tempdata = JSON.parse(fs.readFileSync(tempfile, "utf8"));
}

function commit_temp(){
    fs.writeFileSync(setfile, JSON.stringify(tempdata));
}

function setTempVal(key, val){
    tempdata[key] = val;
    commit_temp();
}

function getTempVal(key){
    return tempdata[key];
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