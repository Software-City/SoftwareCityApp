var iswin32 = process.platform === "win32"
var fs = require('fs');

var setfile;
var cachefile;

var settings;
var cachedata;
var tempdata;
var cachedir;

var settingsfile = "settings.json";
var tempfilefile = "cachefile.json";

var def_config = {
    "theme":"dark",
    "systemtray":false,
    "loggedin":false,
    "credentials":[],
    "autoupdate":true,
    "defstartpage":"Dashboard",
    "serverstartpage":"Teamspeak",
    "cloudstartpage":"MyCloud",
    "devMode": false,
    "chatsettings": {
        "sendonreturn": true,
        "personal_namecolor": "#A74300",
        "personal_textcolor": "#689C1A",
        "other_namecolor": "#ADFF2F",
        "other_textcolor": "#808080"
    }
}

if(iswin32){
    setfile = require("os").homedir() + "/AppData/Roaming/Software\ City\ App/" + settingsfile;
    cachefile = require("os").homedir() + "/AppData/Roaming/Software\ City\ App/" + tempfilefile;
    cachedir = require("os").homedir() + "/AppData/Roaming/Software\ City\ App/";
}else{
    setfile = require("os").homedir() + "/.config/Software\ City\ App/" + settingsfile;
    cachefile = require("os").homedir() + "/.config/Software\ City\ App/" + tempfilefile;
    cachedir = require("os").homedir() + "/.config/Software\ City\ App/";
}

try {
    exports.init_settings = init_settings;
    exports.setVal = setVal;
    exports.getVal = getVal;
    exports.setCacheVal = setCacheVal;
    exports.getCacheVal = getCacheVal;
    exports.cachedir = cachedir;
    exports.tempdata = tempdata;
} catch (error) {
    init_settings();
}


function re_init_settings(){
    var creds = getVal("credentials")
    var logged = getVal("loggedin")
    fs.writeFileSync(setfile, JSON.stringify(def_config));
    fs.writeFileSync(cachefile, JSON.stringify({}));
    settings = JSON.parse(fs.readFileSync(setfile, "utf8"));
    cachedata = JSON.parse(fs.readFileSync(cachefile, "utf8"));
    tempdata = JSON.parse("{}")
    setVal("credentials", creds)
    setVal("loggedin", logged)
}


function init_settings (){
    if(!fs.existsSync(setfile)){
        fs.writeFileSync(setfile, JSON.stringify(def_config));
    }
    if(!fs.existsSync(cachefile)){
        fs.writeFileSync(cachefile, JSON.stringify({}));
    }
    settings = JSON.parse(fs.readFileSync(setfile, "utf8"));
    cachedata = JSON.parse(fs.readFileSync(cachefile, "utf8"));
    tempdata = JSON.parse("{}")
}

function commit_cache(){
    fs.writeFileSync(cachefile, JSON.stringify(cachedata));
}

function setCacheVal(key, val){
    cachedata[key] = val;
    commit_cache();
}

function getCacheVal(key){
    return cachedata[key];
}


function commit(){
    fs.writeFileSync(setfile, JSON.stringify(settings));
}

function setSubVal(key, subkey, val){
    settings[key][subkey] = val;
    commit();
}

function getSubVal(key, subkey){
    return settings[key][subkey];
}

function setVal(key, val){
    settings[key] = val;
    commit();
}

function getVal(key){
    return settings[key];
}