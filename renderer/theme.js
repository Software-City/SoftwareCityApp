var tag = document.getElementById("settings");
var main = document.getElementById("mainpage");
function setTheme(theme=undefined){
    tag.innerHTML = ""
    if(theme!=undefined){
        setVal("theme", theme)
    }
    if(getVal("theme")=="light"){
        main.setAttribute("theme", "light");
        tag.innerHTML += `<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">`;
    }
    else{
        main.setAttribute("theme", "dark");
        tag.innerHTML += `<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootswatch/4.4.1/darkly/bootstrap.min.css">`;
    }
    tag.innerHTML += `<link rel="stylesheet" href="./../static/css/index.css">`
    return;
}setTheme()
function getTheme(){
    return main.getAttribute("theme")
}