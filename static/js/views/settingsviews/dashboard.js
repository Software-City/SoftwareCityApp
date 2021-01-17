function swapNodes(n1, n2) {
    let p1 = n1.parentNode;
    let p2 = n2.parentNode;
    let i1, i2;
    if ( !p1 || !p2 || p1.isEqualNode(n2) || p2.isEqualNode(n1) ) return;
    for (var i = 0; i < p1.children.length; i++) {
        if (p1.children[i].isEqualNode(n1)) {
            i1 = i;
        }
    }
    for (var i = 0; i < p2.children.length; i++) {
        if (p2.children[i].isEqualNode(n2)) {
            i2 = i;
        }
    }

    if ( p1.isEqualNode(p2) && i1 < i2 ) {
        i2++;
    }
    p1.insertBefore(n2, p1.children[i1]);
    p2.insertBefore(n1, p2.children[i2]);
}

var dragSrcEl
function dragStart() {
    this.style.opacity = '0.4';
    dragSrcEl = this;
}
function dragEnter() {
    this.classList.add('over');
}
function dragLeave(e) {
    e.stopPropagation();
    this.classList.remove('over');
}
function dragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
}
function dragDrop() {
    if (dragSrcEl !== this) {
        swapNodes(dragSrcEl, this)
    }
    return false;
}
function dragEnd() {
    var listItens = document.querySelectorAll('.dragarea');
    [].forEach.call(listItens, function(item) {
        item.classList.remove('over');
    });
    this.style.opacity = '1';
    update()
}
function addEventsDragAndDrop(el) {
    el.addEventListener('dragstart', dragStart, false);
    el.addEventListener('dragenter', dragEnter, false);
    el.addEventListener('dragover', dragOver, false);
    el.addEventListener('dragleave', dragLeave, false);
    el.addEventListener('drop', dragDrop, false);
    el.addEventListener('dragend', dragEnd, false);
}

function addStuff(){
    var listItens = document.querySelectorAll('.dragarea');
    [].forEach.call(listItens, function(item) {
        addEventsDragAndDrop(item);
    });
}




var listelem = document.getElementById("elem-list")

{
    let presets = ["News", "Joke", "Cloud", "PP Calc", "Messages", "Notifications"]

    let currlist = settings.views.dashboard.panels

    let elem =
        `
    <li class="list-group-item dragarea" data-id="{{id}}" draggable="true">
        <span class="checkbox-info">{{name}}</span>
<!--        <i class="material-icons dragarea moveup">keyboard_arrow_up</i>-->
<!--        <i class="material-icons dragarea movedown">keyboard_arrow_down</i>-->
        <label class="checkbox">
            <input type="checkbox">
            <span class="default"></span>
        </label>
    </li>
    `

    for(let obj of currlist){
        if(obj!==""){
            listelem.innerHTML += elem.replace("{{id}}", obj).replace("{{name}}", obj)
        }
    }
    for(let obj of presets){
        if(!currlist.includes(obj)){
            listelem.innerHTML += elem.replace("{{id}}", obj).replace("{{name}}", obj)
        }
    }
    for(let num in currlist){
        for(let child of listelem.children){
            if(child.getAttribute("data-id") === currlist[num]){
                child.getElementsByTagName("input")[0].checked = true
            }
        }
    }
    for(let child of listelem.children){
        child.getElementsByTagName("input")[0].addEventListener("click", update)
    }
    addStuff()
}

function update() {
    let retlist = []
    for(let child of document.getElementById("elem-list").children){
        let toggled = child.getElementsByTagName("input")[0].checked
        if(toggled){
            retlist.push(child.getAttribute("data-id"))
        }
    }
    settings.views.dashboard.panels = retlist
    settings.commit()
    return retlist
}