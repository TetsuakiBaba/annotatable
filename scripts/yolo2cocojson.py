# coding: utf-8
import os
import glob
import argparse
import csv
import json
from PIL import Image

parser = argparse.ArgumentParser(description="YOLO to JSON(Coco) converter.",
                                 usage="> python3 yolo2cocojson.py -s <path_to_json_dataset>",
                                 epilog="2021 Tetsuaki BABA")
parser.add_argument("-s", "--search_path", type=str,
                    help="set a json search path, required=True")
parser.add_argument("-c", "--classfile", type=str,
                    help="set a class file", required=True)
args = parser.parse_args()

if (args.search_path and args.classfile):
    f_label = open(args.classfile, 'r')
    reader = csv.reader(f_label, delimiter=',')
    classes = []
    categories = [{"id": 0, "name": "background"}]
    index_id = 1
    for r in reader:
        classes.append(r[0])
        categories.append(
            {
                "id": index_id,
                "name": r[0]
            }
        )
        index_id = index_id + 1
    # print(classes)

    file = glob.glob(args.search_path+'/*.txt')
    print(len(file))

    images = []
    annotations = []
    annotation_id = 0
    i = 0
    for f_txt in file:
        print(i, len(file))
        # 該当する画像サイズを求める
        filepath_jpg = os.path.splitext(f_txt)[0]+'.jpg'
        image = Image.open(filepath_jpg)
        width, height = image.size
        images.append({"id": i, "file_name": os.path.basename(filepath_jpg)})

        f = open(f_txt, 'r')
        print(f_txt)
        length_row = sum([1 for _ in open(f_txt)])
        reader = csv.reader(f, delimiter=" ")

        for r in reader:
            w = int(width*float(r[3]))
            h = int(height*float(r[4]))
            x = int(width*float(r[1]) - w/2)
            y = int(height*float(r[2]) - h/2)
            annotations.append(
                {
                    "id": annotation_id,
                    "image_id": i,
                    "category_id": int(r[0])+1,
                    "bbox": [
                        x, y, w, h
                    ]
                }
            )
            annotation_id = annotation_id + 1
        i = i + 1
    labels = {
        "categories": categories,
        "images": images,
        "annotations": annotations
    }
    print(labels)
    # ファイルに書き出す
    with open("./labels.json", "w") as file:
        json.dump(labels, file)
