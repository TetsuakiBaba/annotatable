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

## Python scripts
These python scripts are provided to manipulate YOLO format annotations.

### Convert YOLO to COCO ( for mediapipe object detection )
This script converts YOLO format annotations to COCO format JSON file.
```bash
python scripts/yolo2cocojson.py -s <yolo_dir> -c <labels_file> 
```
After execution, a `labels.json` file will be generated in the current directory.

### Split dataset
This script splits the dataset into training ,validation and test sets.
```bash
python scripts/split_dataset.py -s <yolo_dir> -c <labels_file> -t <train_ratio> -v <val_ratio>
```
After execution, three directories `train`, `val` and `test` will be created in the current directory.
```
./
├── train/
│   └── images/
│       ├── IMG_0493.jpg
│       ├── IMG_0493.txt
│       └── ...
├── validation/
│   └── images/
│       ├── IMG_0494.jpg
│       ├── IMG_0494.txt
│       └── ...
└── test/
    └── images/
        ├── IMG_0495.jpg
        ├── IMG_0495.txt
        └── ...
```

## Video Instructions for Mediapipe Object Detection

<div style="position: relative; padding-bottom: 62.5%; height: 0;"><iframe src="https://www.loom.com/embed/a2b6412b9f794e46b09211886a950e8d?sid=601b273f-8249-42d9-ae0f-402caf70b4c0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>


## Thanks
I'd like to thank the following photographer for providing free images for sample dataset.
 * fauxels: https://www.pexels.com/ja-jp/photo/3228925/
 * fauxels: https://www.pexels.com/ja-jp/photo/3183150/
 * fauxels: https://www.pexels.com/ja-jp/photo/3184663/