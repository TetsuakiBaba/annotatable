// renderer.js
const { ipcRenderer } = require('electron')

const fs = require('fs');
const path = require('path');
var g_value = "test";
var img;
var loaded_files;


let dropzone = document.getElementById('dropzone');
let listing = document.getElementById("listing");

function scanFiles(item, container) {
    let elem = document.createElement("li");
    elem.textContent = item.name;
    container.appendChild(elem);

    if (item.isDirectory) {
        let directoryReader = item.createReader();
        let directoryContainer = document.createElement("ul");
        container.appendChild(directoryContainer);
        directoryReader.readEntries((entries) => {
            entries.forEach((entry) => {
                scanFiles(entry, directoryContainer);
            });
        });
    }
}

document.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropzone.style.backgroundColor = '#ccc'; // Change CSS here as needed

    //console.log(event);
    // Get the file name
    //message.textContent = 'Releasing will drop the folder here';

    return false;
}, false);

document.addEventListener('dragleave', (event) => {
    event.preventDefault();
    dropzone.style.backgroundColor = null; // Reset CSS here
    message.textContent = 'Drop folder here';
});



document.addEventListener('drop', (event) => {
    document.querySelector('#directory_information').innerHTML = `Loaded Directory: ${event.dataTransfer.files[0].path}`;
    getJpgAndTxtFiles(event.dataTransfer.files[0].path)
        .then(async (files) => {

            loaded_files = files;
            //console.log('jpg files:', files.jpgFiles);
            //console.log('txt files:', files.txtFiles);
            loadAnnotations();
            // img = await loadImage(files.jpgFiles[0]);
            // bbs = readBoundingBoxesFile(files.txtFiles[0]);


            document.querySelector('#directory_information').innerHTML += `<br>Loaded Image: ${files.jpgFiles.length}`;
            document.querySelector('#directory_information').innerHTML += `<br>Loaded Txt: ${files.txtFiles.length}`;
        })
        .catch(err => console.error(err));

    // Reset the message and CSS
    message.textContent = 'Drop folder here';
    dropzone.style.backgroundColor = null; // Reset CSS here

}, false);


function readBoundingBoxesFile(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8');
    const lines = data.split('\n').filter(line => line.trim() !== ''); // Ignore empty lines


    let bbs = lines.map(line => {
        let items = line.split(' ');

        let lastItems = items.splice(-4); // Get the last 4 items (x, y, w, h)
        return {
            labels: items, // The rest are labels
            x: parseFloat(lastItems[0]),
            y: parseFloat(lastItems[1]),
            w: parseFloat(lastItems[2]),
            h: parseFloat(lastItems[3])
        };
    });

    return bbs;
}

function getJpgAndTxtFiles(dir) {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, files) => {
            if (err) {
                reject(err);
                return;
            }

            let jpgFiles = [];
            let txtFiles = [];

            files.forEach(file => {
                const ext = path.extname(file);
                const fullPath = path.join(dir, file);

                if (ext === '.jpg') {
                    jpgFiles.push(fullPath);
                } else if (ext === '.txt') {
                    txtFiles.push(fullPath);
                }
            });

            resolve({ jpgFiles, txtFiles });
        });
    });
}

function readLabelsFile(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8');
    const labels = data.split('\n');

    return labels;
}

let labels = readLabelsFile('src/labels.txt');
// labelsをトグルボタンにして #labels に追加する
labels.forEach((label) => {
    let elem = document.createElement("button");
    elem.textContent = label;
    elem.setAttribute("class", "btn btn-sm btn-secondary m-1");
    elem.setAttribute("type", "button");
    elem.setAttribute("id", label);
    elem.setAttribute("onclick", "toggleLabel(this.id)");
    elem.setAttribute("checked", false);
    document.querySelector('#labels').appendChild(elem);
});

function toggleLabel(id) {

    let elem = document.getElementById(id);

    // multiple labelsが有効でない場合はラベル選択時に他のラベルを外す
    if (mode_multiple_labels == false) {
        resetAllLabelToggles();
    }
    // checkedのとき
    if (elem.classList.contains('btn-secondary')) {
        elem.classList.remove('btn-secondary');
        elem.classList.add('btn-primary');
        elem.setAttribute("checked", true);
    }
    // checkedが外れた時
    else {
        elem.classList.remove('btn-primary');
        elem.classList.add('btn-secondary');
        elem.setAttribute("checked", false);
    }
}


console.log(labels);
