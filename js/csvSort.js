// Global Variables
var headerRow;
var contentRow;
var lineBreak;
var sortColumn;
var listDOM;
var newFileName;
var replaceString = "&Ysnut;"; // You should not use this
var splitter = ",";


function readFileInput() {
    listDOM.innerHTML = ""; // Clear list
    clear("csvFile"); // Clear error tooltip
    if (this.files.length == 0) return; // break when no file is selected

    const selectedFile = this.files[0]; // get file

    // check if file is a csv file, when not than add a tooltip and break
    if (selectedFile.type != "text/csv") {
        addTooltip("csvFile", "Upload a CSV file");
        return;
    }

    newFileName = updateFileName(selectedFile.name, "Sorted"); // get new file name

    const reader = new FileReader(); // init FileReader class
    // assign an function, which is called, as soon the content is read
    reader.onload = e => {
        const fileContent = e.target.result; // get content of the file
        lineBreak = getTypeOfLineBreak(fileContent); // get type of the linebreak

        [headerRow, contentRow] = csvToArray(fileContent, lineBreak); // break the content of the file in a header and content array
        
        // loop all header columns to create an link-list
        headerRow.forEach(ele => {
            const linkDom = creatLinkDOM(ele, "#", `sortAndDownload('${ele}'); return false`); // create link element
            addListNodeDOM(listDOM, linkDom, true); // add link to the list
        });
    };
    reader.readAsText(selectedFile); // read the content as text and trigger onload function
}

function csvToArray(str, lineBreak = "\r\n") {
    // trim all whitespaces at the start and end of the string
    str = str.trim();

    for (let i = 0; i < str.length; i++) {
        const exception = "\"";
        const start = str.indexOf(exception, i);
        const end = str.indexOf("\"", start+1);

        i = end;
        if (start < 0 || end < 0) i = str.length;
        else {
            for (let j = start; j < i; j++) {
                if (str[j] == splitter) {
                    str = str.replaceAt(j, replaceString);
                    i += replaceString.length-1;
                }
            }
        }
    }

    const [headRow, ...bodyRows] = str.split(lineBreak);
    const headers = headRow.split(splitter);
    // Map the row
    // split values from each row into an array
    // use headers.reduce to create an object
    // object properties derived from headers:values
    // the object passed as an element of the array

    // Map the row
    const body = bodyRows.map(row => {
        // split values from each row into an array
        const values = row.split(splitter);
        
        // create object 
        const el = headers.reduce((object, header, index) => {
            object[header] = values[index];
            return object;
            }, {});
        return el;
    });

    // return the array
    return [headers, body];
}


/**
 * Sort the csv-file and download it
 * @param {String} str column name
 */
function sortAndDownload(str) {
    sortColumn = str; // update global variable
    const order = document.getElementById("sortOrder"); // get content of sortOrder element

    // decision to use the correct sort order
    if (order.value == "asc") contentRow.sort(sortAsc);
    else contentRow.sort(sortDesc);

    const csvString = objectToCsv(contentRow, headerRow, lineBreak).replaceAll(replaceString, splitter); // combine the arrays back to a string
    download(newFileName, "text/csv", csvString); // create and download the file
}

//#region sort functions
/**
 * Compare 2 values for ascending order
 * @param {String} a first value
 * @param {String} b second value
 * @returns {Number} Result for sort function -1 | 0 | 1
 */
function sortAsc(a, b) {
    const fa = a[sortColumn].toLowerCase(); // lower case the property of a
    const fb = b[sortColumn].toLowerCase(); // lower case the property of b

    // compare the values
    if (fa < fb) return -1;
    if (fa > fb) return 1;
    return 0;
};

/**
 * Compare 2 values for descending order
 * @param {String} a first value
 * @param {String} b second value
 * @returns {Number} Result for sort function -1 | 0 | 1
 */
function sortDesc(a, b) {
    const fa = a[sortColumn].toLowerCase(); // lower case the property of a
    const fb = b[sortColumn].toLowerCase(); // lower case the property of b

    // compare the values
    if (fa > fb) return -1;
    if (fa < fb) return 1;
    return 0;
};
//#endregion

/**
 * Create CSV-string from array
 * @param {Array} data content of the file
 * @param {Array} head header row
 * @param {String} [lineBreak="\r\n"] lineBreak type of line break
 * @returns {String} CSV file as string
 */
const objectToCsv = function (data, head = null, lineBreak = "\r\n") {
    const csvRows = [];

    /* Get headers as every csv data format 
    has header (head means column name)
    so objects key is nothing but column name 
    for csv data using Object.key() function.
    We fetch key of object as column name for 
    csv */
    const headers = head ? head : Object.keys(data[0]);

    /* Using push() method we push fetched 
    data into csvRows[] array */
    csvRows.push(headers.join(splitter));

    
    // Loop to get value of each objects key
    for (const row of data) {
        const values = headers.map(header => row[header]);

        // To add, sepearater between each value
        csvRows.push(values.join(splitter));
    }

    /* To add new line for each objects values
    and this return statement array csvRows
    to this function.*/
    return csvRows.join(lineBreak);
};