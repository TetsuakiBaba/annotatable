




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
    let canvasElement = document.getElementById('canvas');
    let parentElement = canvasElement.parentNode;
    let p5canvas = createCanvas(canvasElement.clientWidth, canvasElement.clientWidth * 9 / 16);
    p5canvas.parent('#canvas');
}

function draw() {
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
        let b_display = {};
        b_display.x = (b.x - b.w / 2) * width;
        b_display.y = (b.y - b.h / 2) * height;
        b_display.w = b.w * width;
        b_display.h = b.h * height;
        b_display.labels = [];
        for (l of b.labels) {
            b_display.labels.push(labels[Number(l)]);
        }
        noFill();
        strokeWeight(2);
        stroke(0);
        rect(b_display.x, b_display.y, b_display.w, b_display.h);
        rect(b_display.x, b_display.y - 16, b_display.w, 16);
        // bb.labelをばうんでぃうんぼっくすの上に表示
        //console.log(b.labels[0]);
        fill(0);
        textSize(12);
        textAlign(LEFT, TOP);
        noStroke();
        text(b_display.labels, b_display.x + 2, b_display.y - 16);
    }

    // bbsの上にマウスがある時
    for (let b of bbs) {
        let b_display = {};
        b_display.x = (b.x - b.w / 2) * width;
        b_display.y = (b.y - b.h / 2) * height;
        b_display.w = b.w * width;
        b_display.h = b.h * height;

        if (mouseX > b_display.x && mouseX < b_display.x + b_display.w && mouseY > b_display.y && mouseY < b_display.y + b_display.h) {
            // 線の太さを指定
            strokeWeight(2);
            fill(100, 250, 100, 100);
            stroke(0);
            // bb.x, bb.yを基準に四角を描く
            rect(b_display.x, b_display.y, b_display.w, b_display.h);

            // もしマウスがクリックされたら、bbsからそのbbを削除
            if (mouseIsPressed) {
                bbs = bbs.filter((b2) => b2 != b);
                saveAnnotations();
            }

        }
    }

    // マウス位置を中心に十字の線を描く
    strokeWeight(1);
    stroke(0);
    line(mouseX, 0, mouseX, height);
    line(0, mouseY, width, mouseY);


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
}

// マウスを離した際に呼ばれる関数
function mouseReleased() {
    bb.w = mouseX - bb.x;
    bb.h = mouseY - bb.y;
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
        console.log(values);
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
        resizeCanvas(width, img.height * (width / img.width));
    }
}

function windowResized() {
    adjustCanvasSize();
}

let index = 0;


function saveAnnotations() {
    // bbs array to formatted string
    let write_data = bbs.map(bb => {
        console.log({ bb });
        return `${bb.labels.join(' ')} ${bb.x} ${bb.y} ${bb.w} ${bb.h}`;
    }).join('\n');

    let save_file_name = loaded_files.jpgFiles[index].replace(/\.jpg$/, ".txt");
    // Write to filefs.
    fs.writeFile(save_file_name, write_data, (err) => {
        if (err) {
            return console.error(err);
        }
        console.log('File saved successfully!');
    });

}

async function loadAnnotations() {
    img = await loadImage(loaded_files.jpgFiles[index]);
    let txt_file_name = loaded_files.jpgFiles[index].replace(/\.jpg$/, ".txt");
    if (fs.existsSync(txt_file_name)) {
        console.log('The file exists.');
        bbs = readBoundingBoxesFile(txt_file_name);
    } else {
        console.log('The file does not exist.');
        bbs = [];
    }

}

function keyPressed() {
    if (key == ' ') {
        adjustCanvasSize();
        console.log({ loaded_files });
    }

    // 右矢印キー入力で次の画像を表示
    if (keyCode == RIGHT_ARROW) {
        console.log("RIGHT_ARROW");
        if (loaded_files) {
            index++;
            if (index < loaded_files.jpgFiles.length) {
                console.log(loaded_files.jpgFiles[index]);
                //img = loadImage(loaded_files.jpgFiles[index]);
                loadAnnotations();
            }
            else {
                index = loaded_files.jpgFiles.length - 1;
            }
        }
    }
    // 左矢印キー入力で前の画像を表示
    if (keyCode == LEFT_ARROW) {
        console.log("LEFT_ARROW");
        if (loaded_files) {
            index--;
            if (index >= 0) {
                console.log(loaded_files.jpgFiles[index]);
                //img = loadImage(loaded_files.jpgFiles[index]);
                loadAnnotations();
            }
            else {
                index = 0;
            }
        }
    }
}