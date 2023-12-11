var version = `
last modified: 2023/12/11 17:37:46
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


    loadLabelsFile(__dirname + '/labels.txt');
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
            class_color = color('rgba(50, 50, 50, 0.6)');
            class_color_more_alpha = color('rgba(50, 50, 50, 0.3)');
            class_color_no_alpha = color('rgba(50, 50, 50, 1.0)');
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


        strokeWeight(1);
        stroke(class_color_no_alpha);
        fill(class_color_more_alpha);
        rect(b_display.x, b_display.y, b_display.w, b_display.h);


        fill(class_color_no_alpha);
        rect(b_display.x, b_display.y - 16, b_display.w, 16);
        // bb.labelをばうんでぃうんぼっくすの上に表示
        //console.log(b.labels[0]);
        fill(255);
        textSize(12);
        textAlign(LEFT, TOP);
        noStroke();
        text(b_display.labels, b_display.x + 2, b_display.y - 16);


        // bbsの上にマウスがある時
        if (mouseX > b_display.x && mouseX < b_display.x + b_display.w && mouseY > b_display.y && mouseY < b_display.y + b_display.h) {
            // 線の太さを指定
            fill(class_color);
            // bb.x, bb.yを基準に四角を描く
            rect(b_display.x, b_display.y, b_display.w, b_display.h);

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
            fill(color('rgba(0, 200, 0, 0.5)'));
            // text('+', mouseX, mouseY);
            strokeWeight(1.0);
            stroke(color('rgba(0, 200, 0, 0.5)'));
            line(mouseX, 0, mouseX, height);
            line(0, mouseY, width, mouseY);

        }
        else {
            noStroke();
            fill(color('rgba(200, 0, 0, 0.5)'));
            // text('x', mouseX, mouseY);
            strokeWeight(1.0);
            stroke(color('rgba(200, 0, 0, 0.5)'));
            line(mouseX, 0, mouseX, height);
            line(0, mouseY, width, mouseY);

        }
    }


}


function mouseClicked() {
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
            }
            else if (mouseX > width) {
                bb.w = width - bb.x;
            }
            else if (mouseY < 0) {
                bb.h = bb.y;
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
        // bbにlabelを追加
        bb.x = (bb.x + bb.w / 2) / width;
        bb.y = (bb.y + bb.h / 2) / height;
        bb.w = bb.w / width;
        bb.h = bb.h / height;
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
    });

}

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

function imageLoadError() {
    alert('Image load error');
}

function keyPressed() {
    if (key == ' ') {
        adjustCanvasSize();
        //        console.log({ loaded_files });
    }

    // 右矢印キー入力で次の画像を表示
    if (keyCode == RIGHT_ARROW) {
        forwardImage();
    }
    // 左矢印キー入力で前の画像を表示
    if (keyCode == LEFT_ARROW) {
        backImage();
    }
}

function forwardImage() {
    if (loaded_files) {
        index++;
        if (index < loaded_files.jpgFiles.length) {
            setImageIndex(index);
        }
        else {
            index = loaded_files.jpgFiles.length - 1;
        }
    }
}
function backImage() {
    if (loaded_files) {
        index--;
        if (index >= 0) {
            setImageIndex(index);
        }
        else {
            index = 0;
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

// windowサイズが変更された場合
