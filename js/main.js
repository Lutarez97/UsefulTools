//#region prototypes
String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + 1);
}
//#endregion

//#region tooltip
function addTooltip(fieldId, message="") {
    const field = document.getElementById(fieldId);
    const parent = field.parentElement;

    field.classList.add("errorField");
    parent.classList.add("tooltip");
    parent.setAttribute("data-customTooltip", message);
}

function clear(fieldId) {
    const field = document.getElementById(fieldId);
    const parent = field.parentElement;

    field.classList.remove("errorField");
    parent.classList.remove("tooltip");
    parent.removeAttribute("data-customTooltip");
}
//#endregion

//#region create DOM elements
function addListNodeDOM(list, value, isDOM = false) {
    let listNode = document.createElement("li");
    if (!isDOM) value = document.createTextNode(value);
    
    listNode.appendChild(value);
    list.appendChild(listNode);
}

function creatLinkDOM(value, href = "#", onclick = "") {
    let link = document.createElement("a");
    link.innerText = value;
    link.setAttribute("href", href);
    if (onclick) link.setAttribute("onclick", onclick);

    return link;
}
//#endregion

function getTypeOfLineBreak(str) {
    if (str.indexOf("\r\n") !== -1) return "\r\n";
    if (str.indexOf("\n") !== -1) return "\n";
    return "\r";
}

function updateFileName(orgName, additional) {
    const splittName = orgName.split(".");
    const extension = splittName.pop();
    
    return splittName.join(".") + additional + "." + extension;
}



function download(filename, type, data) {
    // create a blob file
    const blob = new Blob([data], {type: type});
    // create an URL
    const url = window.URL.createObjectURL(blob);

    let a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    window.URL.revokeObjectURL(url);
}