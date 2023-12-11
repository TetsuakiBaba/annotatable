# annotatable
annotatable is a simple image annotation tool for object detection.
![teaser](teaser.png)

## Getting started
```
git clone https://github.com/TetsuakiBaba/annotatable.git
cd annotatable
npm install
npm start
```
Drag and drop a folder containing images and annotations to the app.

## Change labels

### default labels
You can change default labels in `src/labels.txt`.

### dynamic loading
You can change labels by drag and drop a file containing labels to the app.

## Supported annotation format
 * YOLO Objecct Dectection: [label id] [x] [y] [width] [height]

## Thanks
I'd like to thank the following photographer for providing free images for sample dataset.
 * fauxels: https://www.pexels.com/ja-jp/photo/3228925/
 * fauxels: https://www.pexels.com/ja-jp/photo/3183150/
 * fauxels: https://www.pexels.com/ja-jp/photo/3184663/