// renderer.js
const { ipcRenderer } = require('electron')

const fs = require('fs');
const path = require('path');
var g_value = "test";
var img;
var loaded_files;

// label_colorsという名前で100個の色を用意．色はカラフルで彩度を抑えたもの
var label_colors = [];

let dropzone = document.getElementById('dropzone');
dropzone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropzone.style.backgroundColor = '#ccc'; // Change CSS here as needed
    return false;
}, false);
dropzone.addEventListener('dragleave', (event) => {
    event.preventDefault();
    dropzone.style.backgroundColor = null; // Reset CSS here
    return false;
}, false);
dropzone.addEventListener('drop', (event) => {
    loadDataset(event.dataTransfer.files[0].path);
    // Reset the message and CSS
    dropzone.style.backgroundColor = null; // Reset CSS here
}, false);

function reloadDataset() {
    let path_to_dataset = document.querySelector('#path_to_dataset').innerHTML;
    console.log(document.querySelector('#path_to_dataset'));
    loadDataset(path_to_dataset);
}
function loadDataset(path_to_dataset) {
    document.querySelector('#directory_information').innerHTML = `Loaded Directory: <span id="path_to_dataset">${path_to_dataset}</span>`;

    getJpgAndTxtFiles(path_to_dataset)
        .then(async (files) => {
            loaded_files = files;

            // 最初の位置に戻す
            index = 0;
            loadAnnotations();
            document.querySelector('#directory_information').innerHTML += `<br>Loaded Image: ${files.jpgFiles.length}`;
            document.querySelector('#directory_information').innerHTML += `<br>Loaded Txt: ${files.txtFiles.length}`;

            // #image_index_sliderを読み込んだファイルの数量に合わせて変更する
            document.querySelector('#image_index_slider').max = files.jpgFiles.length - 1;
            document.querySelector('#image_index_slider').min = 0;
            document.querySelector('#image_index_slider').value = 0;
            console.log({ loaded_files });
        })
        .catch(err => console.error(err));

}



var labels = [];

let dropzone_label = document.getElementById('dropzone_label');
dropzone_label.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropzone_label.style.backgroundColor = '#ccc'; // Change CSS here as needed
    return false;
}, false);
dropzone_label.addEventListener('dragleave', (event) => {
    event.preventDefault();
    dropzone_label.style.backgroundColor = null; // Reset CSS here
    return false;
}, false);
dropzone_label.addEventListener('drop', (event) => {
    // dropされたファイルの拡張子をチェック
    const ext = path.extname(event.dataTransfer.files[0].path);

    // extがtxtの場合だけ処理をする
    if (ext === '.txt') {
        // #labels を空にする
        document.querySelector('#labels').innerHTML = "";
        loadLabelsFile(event.dataTransfer.files[0].path);
    }
    else {
        alert("txtファイルをドロップしてください");
    }
    // Reset the message and CSS
    dropzone_label.style.backgroundColor = null; // Reset CSS here
}, false);

function loadLabelsFile(filePath) {
    labels = [];
    // ファイルを読み込む
    labels = readLabelsFile(filePath);

    // labelsをトグルボタンにして #labels に追加する
    labels.forEach((label) => {
        let elem = document.createElement("button");
        elem.textContent = label;
        elem.setAttribute("class", "btn btn-sm btn-light m-1");
        elem.setAttribute("type", "button");
        elem.setAttribute("id", label);
        elem.setAttribute("onclick", "toggleLabel(this.id)");
        elem.setAttribute("checked", false);
        document.querySelector('#labels').appendChild(elem);
    });

    label_colors = [];
    for (let i = 0; i < labels.length; i++) {
        let hue = parseInt((5 * i + i * 360 / 5) % 360);  // 360を超えないようにする

        let saturation = 50;
        let brightness = 50;
        let mycolor = color(`hsba(${hue}, ${saturation}%, ${brightness}%, 0.6)`);
        // color をRGBに変換
        label_colors.push(mycolor);
    }

    // filePathからファイル名だけを取り出す
    let filePathSplit = filePath.split('/');
    let filePathSplitLast = filePathSplit[filePathSplit.length - 1];
    document.querySelector('#label_information').innerHTML = `File name: ${filePathSplitLast}<br>Loaded Labels: ${labels.length}`;

}
function readLabelsFile(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8');
    const labels = data.split('\n');
    // labelsに空白が含まれている場合は削除する
    for (let i = 0; i < labels.length; i++) {
        if (labels[i] == "") {
            labels.splice(i, 1);
        }
    }
    return labels;
}


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




function readBoundingBoxesFile(filePath) {
    const data = fs.readFileSync(filePath, 'utf-8');
    const lines = data.split('\n').filter(line => line.trim() !== ''); // Ignore empty lines

    let bbs = lines.map(line => {
        let items = line.split(' ');

        let lastItems = items.splice(-4); // Get the last 4 items (x, y, w, h)
        ret = {
            labels: items, // The rest are labels
            x: parseFloat(lastItems[0]),
            y: parseFloat(lastItems[1]),
            w: parseFloat(lastItems[2]),
            h: parseFloat(lastItems[3])
        };

        if (ret.x < 0 || ret.y < 0 || ret.w < 0 || ret.h < 0) {
            alert('Alert: Bounding box coordinates must be positive');
        }
        if (ret.x + ret.w / 2 > 1.0 || ret.y + ret.h / 2 > 1.0 || ret.x + ret.w / 2 < 0.0 || ret.y + ret.h / 2 < 0.0) {
            console.warn(`Bounding Box: (x,y,h,w)=(${ret.x},${ret.y},${ret.w},${ret.h}), (${ret.x + ret.w / 2}, ${ret.y + ret.h / 2})`);
            alert(`Alert: Bounding box coordinates must be smaller than 1.0. Please check console for more information`);
        }
        return ret;
    });

    return bbs;
}

// 渡されたdir pathからjpgとtxtファイルを取得する
function getJpgAndTxtFiles(dir) {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, files) => {
            if (err) {
                reject(err);
                return;
            }

            let jpgFiles = [];
            let txtFiles = [];

            // まずはjpgファイルだけを確認する
            files.forEach(file => {
                const ext = path.extname(file);
                const fullPath = path.join(dir, file);

                if (ext === '.jpg') {
                    jpgFiles.push(fullPath);
                }
            });

            // jpgFilesの一覧に基づいてtxtファイルを確認する
            jpgFiles.forEach(jpgFile => {
                const baseName = path.basename(jpgFile, '.jpg');
                const txtFile = path.join(dir, baseName + '.txt');
                // txtファイルが存在する場合
                if (fs.existsSync(txtFile)) {
                    txtFiles.push(txtFile);
                }
                // txtファイルが存在しない場合
                else {
                    txtFiles.push('no txt file');
                }
            });


            resolve({ jpgFiles, txtFiles });
        });
    });
}




function toggleLabel(id) {

    let elem = document.getElementById(id);

    // multiple labelsが有効でない場合はラベル選択時に他のラベルを外す
    if (mode_multiple_labels == false) {
        resetAllLabelToggles();
    }

    // checkedのとき
    if (elem.classList.contains('btn-light')) {
        elem.classList.remove('btn-light');
        elem.classList.add('btn-success');
        elem.setAttribute("checked", true);


    }
    // checkedが外れた時
    else {
        elem.classList.remove('btn-success');
        elem.classList.add('btn-light');
        elem.setAttribute("checked", false);
    }

    // #selected_labelsにある全てのspanを削除
    document.querySelector('#selected_labels').innerHTML = "";

    // すべてのlabels内のボタンを取得して，その中でcheckedのattributeがtrueになっているものだけを取得する
    let checked_labels = document.querySelectorAll('#labels button[checked="true"]');
    // console.log(checked_labels);
    for (let i = 0; i < checked_labels.length; i++) {
        let badge = document.createElement("span");
        badge.textContent = checked_labels[i].id;
        badge.setAttribute("class", "badge rounded-pill text-bg-success");
        badge.setAttribute("id", checked_labels[i].id + "_badge");
        document.querySelector('#selected_labels').appendChild(badge);
    }
}

