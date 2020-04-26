function loadHTML(filename){
    $("#mainpage").load("./../templates/" + filename);
    // document.getElementById("mainpage").setAttribute("src", "./../templates/" + filename)
}
function loadURL(url){
    $("#mainpage").load(url);
}