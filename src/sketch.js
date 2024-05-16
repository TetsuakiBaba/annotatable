var version = `
last modified: 2024/04/09 00:07:38
`;

let mode_multiple_labels = false;
let canvas = {
    width: 400,
    height: 400
}
let bbs = [];
let bb = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    labels: []
}

function setup() {
    colorMode(HSB, 360, 100, 100, 1);  // HSBモードを設定

    let canvasElement = document.getElementById('canvas');
    let parentElement = canvasElement.parentNode;
    let p5canvas = createCanvas(canvasElement.clientWidth, canvasElement.clientWidth * 9 / 16);
    p5canvas.parent('#canvas');
    document.querySelector('#version').innerHTML = version;

    p5canvas.mouseOver(hideCursor);
    p5canvas.mouseOut(showCursor);


    loadLabelsFile(__dirname + '/../sample_dataset/labels.txt');
    document.querySelector('#directory_information').innerHTML = `Loaded Directory: sample_dataset`;
    // console.log(__dirname + '/../sample_dataset/data');
    loadDataset(__dirname + '/../sample_dataset/data');
    // getJpgAndTxtFiles(__dirname + '/../sample_dataset/data')
    //     .then(async (files) => {
    //         loaded_files = files;
    //         loadAnnotations();
    //         document.querySelector('#directory_information').innerHTML += `<br>Loaded Image: ${files.jpgFiles.length}`;
    //         document.querySelector('#directory_information').innerHTML += `<br>Loaded Txt: ${files.txtFiles.length}`;

    //         // #image_index_sliderを読み込んだファイルの数量に合わせて変更する
    //         document.querySelector('#image_index_slider').max = files.jpgFiles.length - 1;
    //         document.querySelector('#image_index_slider').min = 0;
    //         document.querySelector('#image_index_slider').value = 0;

    //     })
    //     .catch(err => console.error(err));
}

function hideCursor() {
    document.body.style.cursor = 'none';
}

function showCursor() {
    document.body.style.cursor = 'default';
}

function draw() {
    let flg_on_the_bb = false;
    background(220);

    if (img) {
        image(img, 0, 0, width, img.height * (width / img.width));
    }

    // マウスが押されている間
    if (mouseIsPressed) {
        // 線の太さを指定
        strokeWeight(2);
        noFill();
        stroke(0);
        // bb.x, bb.yを基準に四角を描く
        rect(bb.x, bb.y, mouseX - bb.x, mouseY - bb.y);
    }

    for (let b of bbs) {
        // bb.labelsが複数の場合は単色で塗りつぶす
        let class_color;
        let class_color_more_alpha;
        let class_color_no_alpha;
        if (b.labels.length > 1) {
            // class_color = color('rgba(50, 50, 50, 0.6)');
            // class_color_more_alpha = color('rgba(50, 50, 50, 0.3)');
            // class_color_no_alpha = color('rgba(50, 50, 50, 1.0)');
            class_color = color(`${label_colors[b.labels[0]]}`);
            class_color_more_alpha = color(`${label_colors[b.labels[0]]}`);
            class_color_more_alpha.setAlpha(0.2);
            class_color_no_alpha = color(`${label_colors[b.labels[0]]}`);
            class_color_no_alpha.setAlpha(1.0);
        }
        else {
            class_color = color(`${label_colors[b.labels[0]]}`);
            class_color_more_alpha = color(`${label_colors[b.labels[0]]}`);
            class_color_more_alpha.setAlpha(0.2);
            class_color_no_alpha = color(`${label_colors[b.labels[0]]}`);
            class_color_no_alpha.setAlpha(1.0);
        }


        let b_display = {};

        b_display.x = (b.x - b.w / 2) * width;
        b_display.y = (b.y - b.h / 2) * height;
        b_display.w = b.w * width;
        b_display.h = b.h * height;
        b_display.labels = [];
        for (l of b.labels) {
            b_display.labels.push(labels[Number(l)]);
        }



        if (b_display.y - 16 < 0) {
            strokeWeight(1);
            stroke(class_color_no_alpha);
            fill(class_color_more_alpha);
            rect(b_display.x, b_display.y, b_display.w, b_display.h);

            fill(class_color_no_alpha);
            rect(b_display.x, b_display.y + b_display.h, b_display.w, 16);

            fill(255);
            textSize(12);
            textAlign(LEFT, TOP);
            noStroke();
            text(b_display.labels, b_display.x + 2, b_display.y + b_display.h);
        }
        else {
            strokeWeight(1);
            stroke(class_color_no_alpha);
            fill(class_color_more_alpha);
            rect(b_display.x, b_display.y, b_display.w, b_display.h);


            fill(class_color_no_alpha);
            rect(b_display.x, b_display.y - 16, b_display.w, 16);

            fill(255);
            textSize(12);
            textAlign(LEFT, TOP);
            noStroke();
            text(b_display.labels, b_display.x + 2, b_display.y - 16);
        }

        // bbsの上にマウスがある時
        if (mouseX > b_display.x && mouseX < b_display.x + b_display.w && mouseY > b_display.y && mouseY < b_display.y + b_display.h) {
            // 線の太さを指定
            fill(class_color);
            // bb.x, bb.yを基準に四角を描く
            rect(b_display.x, b_display.y, b_display.w, b_display.h);

            // バウンディングボックスの4点の座標を表示
            fill(255);
            textSize(6);
            noStroke();
            textAlign(LEFT, TOP);
            let bbpos = [
                { x: b_display.x / width, y: b_display.y / height },
                { x: (b_display.x + b_display.w) / width, y: b_display.y / height },
                { x: b_display.x / width, y: (b_display.y + b_display.h) / height },
                { x: (b_display.x + b_display.w) / width, y: (b_display.y + b_display.h) / height },
            ]

            text(`(${bbpos[0].x.toFixed(2)}, ${bbpos[0].y.toFixed(2)})`,
                b_display.x, b_display.y);

            textAlign(RIGHT, TOP);
            text(`(${bbpos[1].x.toFixed(2)}, ${bbpos[1].y.toFixed(2)})`,
                b_display.x + b_display.w, b_display.y);

            textAlign(LEFT, BOTTOM);
            text(`(${bbpos[2].x.toFixed(2)}, ${bbpos[2].y.toFixed(2)})`,
                b_display.x, b_display.y + b_display.h);

            textAlign(RIGHT, BOTTOM);
            text(`(${bbpos[3].x.toFixed(2)}, ${bbpos[3].y.toFixed(2)})`,
                b_display.x + b_display.w, b_display.y + b_display.h);


            stroke(color('rgba(255, 255, 255, 0.2)'));
            line(b_display.x, b_display.y, b_display.x + b_display.w, b_display.y + b_display.h);
            line(b_display.x + b_display.w, b_display.y, b_display.x, b_display.y + b_display.h);

            noStroke();
            textSize(8);
            textAlign(CENTER, CENTER);
            text(`Double click to delete`, b_display.x + b_display.w / 2, b_display.y + b_display.h / 2);
            flg_on_the_bb = true;

        }
        else {
            fill(class_color_more_alpha)
            // bb.x, bb.yを基準に四角を描く
            rect(b_display.x, b_display.y, b_display.w, b_display.h);


        }
    }

    // canvas上にマウスがあれば
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
        // マウス位置を中心に十字の線を描く

        if (flg_on_the_bb == false) {
            noStroke();
            fill(color('rgba(0, 150, 0, 0.5)'));
            // text('+', mouseX, mouseY);
            strokeWeight(2.0);
            stroke(color('rgba(0, 150, 0, 0.5)'));
            line(mouseX, 0, mouseX, height);
            line(0, mouseY, width, mouseY);

        }
        else {
            noStroke();
            fill(color('rgba(200, 0, 0, 0.5)'));
            // text('x', mouseX, mouseY);
            strokeWeight(2.0);
            stroke(color('rgba(200, 0, 0, 0.5)'));
            line(mouseX, 0, mouseX, height);
            line(0, mouseY, width, mouseY);

        }
    }


}


function doubleClicked() {
    console.log("mouseClicked");
    for (let b of bbs) {
        let b_display = {};

        b_display.x = (b.x - b.w / 2) * width;
        b_display.y = (b.y - b.h / 2) * height;
        b_display.w = b.w * width;
        b_display.h = b.h * height;
        // bbsの上にマウスがある時
        if (mouseX > b_display.x && mouseX < b_display.x + b_display.w && mouseY > b_display.y && mouseY < b_display.y + b_display.h) {
            // もしマウスがクリックされたら、bbsからそのbbを削除
            bbs = bbs.filter((b2) => b2 != b);
            saveAnnotations();
        }
    }
}

function setHalfAlpha(color) {
    return color.setAlpha(0.1);
}



function normalizeBoundingBox(box) {
    let { x, y, w, h } = box;

    if (w < 0) {
        x = x + w;
        w = Math.abs(w);
    }

    if (h < 0) {
        y = y + h;
        h = Math.abs(h);
    }

    return { x, y, w, h };
}



// クリックした際に呼ばれる関数
function mousePressed() {

    // bb.xにマウスのX座標を代入
    bb.x = mouseX;
    // bb.yにマウスのY座標を代入
    bb.y = mouseY;

    // もし bbにマイナス値が含まれている場合はその箇所を0にする
    if (bb.x < 0) {
        bb.x = 0;
    }
    else if (bb.x > width) {
        bb.x = width;
    }

    if (bb.y < 0) {
        bb.y = 0;
    }
    else if (bb.y > height) {
        bb.y = height;
    }
}

// マウスを離した際に呼ばれる関数
function mouseReleased() {

    // canvas上にマウスがないが，pressedしたときのx,y座標がキャンバス上にあれば
    if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
        if (bb.x > 0 && bb.x < width && bb.y > 0 && bb.y < height) {
            bb.w = mouseX - bb.x;
            bb.h = mouseY - bb.y;
            if (mouseX < 0) {
                bb.w = bb.x;
                bb.x = 0;
            }
            else if (mouseX > width) {
                bb.w = width - bb.x;
            }

            if (mouseY < 0) {
                bb.h = bb.y;
                bb.y = 0;
            }
            else if (mouseY > height) {
                bb.h = height - bb.y;
            }

        }
        else {
            bb = { x: 0, y: 0, w: 0, h: 0 };
            return;
        }

    }
    // pressedした時のx,y座標がキャンバス上になければ
    else if (bb.x < 0 || bb.x > width || bb.y < 0 || bb.y > height) {
        bb = { x: 0, y: 0, w: 0, h: 0 };
        return;
    }
    else {
        bb.w = mouseX - bb.x;
        bb.h = mouseY - bb.y;
    }


    // bbsにbbを追加
    bb = normalizeBoundingBox(bb);
    if (bb.w * bb.h > 20) {

        // labelsに含まれるbutton要素で、getAttribute('checked')がtrueのもののidをvaluesに代入
        let buttons = document.querySelectorAll('button');
        let values = [];


        buttons.forEach(button => {
            if (button.getAttribute('checked') === 'true') {
                values.push(labels.indexOf(button.id));
            }
        });
        if (values.length == 0) {
            alert('Please select label');
            return;
        }
        // bb.x,yはyolo形式では中心座標になるため、bb.w,hそれぞれの半分を加算する
        bb.x = (bb.x + bb.w / 2) / width;
        bb.y = (bb.y + bb.h / 2) / height;

        // bb.wは0-1で表現するため、widthで割る
        bb.w = bb.w / width;

        // bb.x + bb.w/2が1.0より大きければその分を引く
        if (bb.x + bb.w / 2 > 1.0) {
            bb.x = bb.x - (bb.x + bb.w / 2 - 1.0);
        }

        // bb.hは0-1で表現するため、heightで割る
        bb.h = bb.h / height;

        // bb.y + bb.h/2が1.0より大きければその分を引く
        if (bb.y + bb.h / 2 > 1.0) {
            bb.y = bb.y - (bb.y + bb.h / 2 - 1.0);
        }

        bb.labels = values;
        bbs.push({ ...bb });
        saveAnnotations();
    }
    else {
        //alert("bounding box is too small");
        bb = { x: 0, y: 0, w: 0, h: 0 };
    }
}

function adjustCanvasSize() {
    if (img) {
        let canvasElement = document.getElementById('canvas');
        let w_new = canvasElement.clientWidth;
        resizeCanvas(w_new, img.height * (w_new / img.width));
        document.querySelector('#image_information').innerHTML = `Loaded Image: ${parseInt(index) + parseInt(1)}/${loaded_files.jpgFiles.length}<br>Image: <a href="${loaded_files.jpgFiles[index]}" target="_blank">${loaded_files.jpgFiles[index]}</a><br>Txt: <a href="${loaded_files.txtFiles[index]}" target="_blank">${loaded_files.txtFiles[index]}</a><br>Image size: ${img.width} x ${img.height}`;
        document.querySelector('#bb_count').innerHTML = `Bounding box count: ${bbs.length}`;
    }
    else {
        let canvasElement = document.getElementById('canvas');
        let w_new = canvasElement.clientWidth;
        resizeCanvas(w_new, w_new * 9 / 16);
    }
}

function windowResized() {
    adjustCanvasSize();
}

let index = 0;


function saveAnnotations() {

    // jpgFilesが空の時は何もしない
    if (!loaded_files) {
        bbs = [];
        alert('load image folder first')
        return;
    }

    // bbs array to formatted string
    let write_data = bbs.map(bb => {
        return `${bb.labels.join(' ')} ${bb.x} ${bb.y} ${bb.w} ${bb.h}`;
    }).join('\n');

    let save_file_name = loaded_files.jpgFiles[index].replace(/\.jpg$/, ".txt");
    // Write to filefs.
    fs.writeFile(save_file_name, write_data, (err) => {
        if (err) {
            return console.error(err);
        }
        //console.log('File saved successfully!');
        if (loaded_files.txtFiles[index] == 'no txt file') {

            // loaded_files.jpgFiles[index]に含まれる.jpgを.txtに置き換える
            loaded_files.txtFiles[index] = loaded_files.jpgFiles[index].replace(/\.jpg$/, ".txt");
            document.querySelector('#image_information').innerHTML = `Loaded Image: ${parseInt(index) + parseInt(1)}/${loaded_files.jpgFiles.length}<br>Image: <a href="${loaded_files.jpgFiles[index]}" target="_blank">${loaded_files.jpgFiles[index]}</a><br>Txt: <a href="${loaded_files.txtFiles[index]}" target="_blank">${loaded_files.txtFiles[index]}</a><br>Image size: ${img.width} x ${img.height}`;
        }
        document.querySelector('#bb_count').innerHTML = `Bounding box count: ${bbs.length}`;
    });

}

// bbの配列bbsに読み込まれたアノテーションを代入する（これは、一つのファイル処理に対してのみ）
function loadAnnotations() {
    img = loadImage(loaded_files.jpgFiles[index], adjustCanvasSize, imageLoadError);
    let txt_file_name = loaded_files.jpgFiles[index].replace(/\.jpg$/, ".txt");
    if (fs.existsSync(txt_file_name)) {
        //console.log('The file exists.');
        bbs = readBoundingBoxesFile(txt_file_name);

    } else {
        //console.log('The file does not exist.');
        bbs = [];
    }
}

// 現在の画像のアノテーションを削除する
function clearAnnotations() {
    let txt_file_name = loaded_files.jpgFiles[index].replace(/\.jpg$/, ".txt");
    if (fs.existsSync(txt_file_name)) {

        // fsの中身だけ空にする
        fs.writeFile(txt_file_name, '', (err) => {
            if (err) {
                return console.error(err);
            }
            //console.log('File deleted successfully!');
            bbs = [];
            document.querySelector('#bb_count').innerHTML = `Bounding box count: ${bbs.length}`;
        });
    }
}

function imageLoadError() {
    alert('Image load error');
}

function keyPressed() {
    if (key == ' ') {
        adjustCanvasSize();
        //        console.log({ loaded_files });
    }

    // 右矢印キー入力で次の画像を表示
    if (keyCode == RIGHT_ARROW || key == 'd') {
        forwardImage();
    }
    // 左矢印キー入力で前の画像を表示
    if (keyCode == LEFT_ARROW || key == 'a') {
        backImage();
    }
}
// 
function forwardImage(option = { go_to_no_txt: false }) {

    if (loaded_files) {
        if (option.go_to_no_txt == false) {
            index++;
            if (index < loaded_files.jpgFiles.length) {
                setImageIndex(index);
            }
            else {
                index = loaded_files.jpgFiles.length - 1;
            }
        }
        else if (option.go_to_no_txt == true) {
            index++
            while (index < loaded_files.jpgFiles.length) {
                console.log(index)
                let txt_file_name = loaded_files.jpgFiles[index].replace(/\.jpg$/, ".txt");
                if (fs.existsSync(txt_file_name)) {
                    index++;
                }
                else {
                    setImageIndex(index);
                    break;
                }
            }

            if (index == loaded_files.jpgFiles.length) {
                index--;
                setImageIndex(index);
            }
        }
    }
}
function backImage(option = { go_to_no_txt: false }) {
    if (loaded_files) {
        if (option.go_to_no_txt == false) {
            index--;
            if (index >= 0) {
                setImageIndex(index);
            }
            else {
                index = 0;
            }
        }
        else if (option.go_to_no_txt == true) {
            index--
            while (index >= 0) {
                let txt_file_name = loaded_files.jpgFiles[index].replace(/\.jpg$/, ".txt");
                if (fs.existsSync(txt_file_name)) {
                    index--;
                }
                else {
                    setImageIndex(index);
                    break;
                }
            }

            if (index < 0) {
                index++;
                setImageIndex(index);
            }
        }

    }
}

function setImageIndex(i) {
    if (loaded_files) {
        if (i >= 0 && i < loaded_files.jpgFiles.length) {
            index = i;
            document.querySelector('#image_index_slider').value = index;
            loadAnnotations();
        }
    }
}

function toggleMultipleLabelsMode(dom) {
    //console.log(dom.checked);
    mode_multiple_labels = dom.checked;
    if (mode_multiple_labels == false) {
        resetAllLabelToggles();
        // #selected_labelsを空にする
        document.querySelector('#selected_labels').innerHTML = "";
    }
}

function resetAllLabelToggles() {
    let buttons = document.querySelector('#labels').querySelectorAll('button');
    buttons.forEach(button => {
        button.setAttribute('checked', false);
        if (button.classList.contains('btn-success')) {
            button.classList.remove('btn-success');
            button.classList.add('btn-light');
        }
    });
}

function resetAllLabelTogglesExceptMe(me_id) {
    let buttons = document.querySelector('#labels').querySelectorAll('button');
    buttons.forEach(button => {
        if (button.id != me_id) {
            button.setAttribute('checked', false);
            if (button.classList.contains('btn-success')) {
                button.classList.remove('btn-success');
                button.classList.add('btn-light');
            }
        }
    });
}

// windowサイズが変更された場合
