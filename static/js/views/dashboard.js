{
    let holder = document.getElementById("holder")
    let holderitems = holder.children

    for(let child of holderitems){
        child.hidden = true
    }

    let currlist = settings.views.dashboard.panels

    for(let obj of currlist){
        if(obj!==""){
            document.getElementById(obj).hidden = false
        }
    }

    for(let num in currlist){
        for(let onum in holderitems){
            if(currlist[num] == holderitems[onum].id){
                moveItem(onum, num)
            }
        }
    }

    function moveItem(from, to){
        if (to > holderitems.length - 1 || to < 0) return
        let item = holderitems[from]
        if (!item) return
        holder.removeChild(item)
        holder.insertBefore(item, holderitems[to])
    }
}

// News and cloud section
{
    let usernamespans = document.getElementsByClassName("username")

    let news_header = document.getElementById("news-header")
    let news_body = document.getElementById("news-body")

    let cloud_files = document.getElementById("cloud-files")
    let cloud_usage = document.getElementById("cloud-usage")
    let cloud_usage_bar = document.getElementById("cloud-usage-bar")

    let credentials = settings.account.user

    for(let x of usernamespans){
        x.innerText = credentials.name
    }
    ipcRenderer.invoke(
        "get",
        `https://interface.software-city.org/${credentials.name}/pcloud/mobile?passwd=${credentials.password}&info`,
    ).then((resp)=>{
        let data = resp.data
        news_header.innerHTML = data.newsdata[0]
        news_body.innerHTML = data.newsdata[1]

        let { files, max, used } = data
        cloud_files.innerText = `${files} Files in all directories`
        cloud_usage.innerText = `${used}GB / ${max}GB`
        cloud_usage_bar.style.width = `${Math.floor((used/max)*100)}%`
    }).catch((err)=>{
        alert(err)
    })
}

// joke section
var jokespans = document.getElementsByClassName("joke")
var jokevotin = document.getElementById("joke-voting")
var jokecontr = document.getElementById("joke-controls")
var jokeupvot = document.getElementById("joke-upvotes")
var jokedownv = document.getElementById("joke-downvotes")
var jokecateg = document.getElementById("joke-category")


if(typeof(lastjoke) == "undefined"){
    var lastjoke = ""
}

function loadJoke(n=false) {
    if(lastjoke == "" | n){
        jokevotin.hidden = true
        jokecateg.innerText = "loading..."
        jokecontr.hidden = true
        ipcRenderer.invoke(
            "get",
            `https://api.software-city.org/app/get_joke?jokemode=random`
        ).then((resp)=>{
            let data = resp.data
            lastjoke = data
            jokeupvot.innerText = data.up
            jokedownv.innerText = data.down
            jokevotin.hidden = false
            jokecateg.innerText = data.category
            jokecontr.hidden = false
            for(x of jokespans){
                x.innerHTML = data.joke
            }
        })
    }else{
        jokeupvot.innerText = lastjoke.up
        jokedownv.innerText = lastjoke.down
        jokevotin.hidden = false
        jokecateg.innerText = lastjoke.category
        jokecontr.hidden = false
        for(x of jokespans){
            x.innerHTML = lastjoke.joke
        }
    }
}
function voteJoke(mode) {
    if(mode == undefined){
        loadJoke(true)
    }else{
        ipcRenderer.invoke(
            "get",
            `https://api.software-city.org/app/get_joke?jokemode=vote&voting=${mode}&id=${lastjoke.id}`
        ).then(()=>{
            loadJoke(true)
        })
    }
}
loadJoke()


//pp calc section
{
    document.getElementById("lastpplength").innerText = `Your PP is ${Math.floor(Math.random()*80)}cm long.`
}