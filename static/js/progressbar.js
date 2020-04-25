var progress = document.getElementById("progress");
var progress_wrapper = document.getElementById("progress_wrapper");
var progress_status = document.getElementById("progress_status");
var upload_btn = document.getElementById("upload_btn");
var loading_btn = document.getElementById("loading_btn");
var cancel_btn = document.getElementById("cancel_btn");
var input = document.getElementById("file_input");
var file_input_label = document.getElementById("file_input_label");

function input_filename() {
    file_input_label.innerText = input.files[0].name;
}

function reset() {
    input.value = null;
    cancel_btn.classList.add("d-none");
    input.disabled = false;
    upload_btn.classList.remove("d-none");
    loading_btn.classList.add("d-none");
    progress_wrapper.classList.add("d-none");
    progress.setAttribute("style", `width: 0%`);
    file_input_label.innerText = "Select file";
}