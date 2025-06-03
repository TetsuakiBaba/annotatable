# coding: utf-8
import os
import glob
import argparse
import shutil
import random
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(
        description="YOLO dataset splitter",
        usage="> python3 split_dataset.py -s <dataset_path> -t 0.8 -v 0.15 --test 0.05",
        epilog="2025 Dataset Splitter"
    )

    parser.add_argument("-s", "--source", type=str, required=True,
                        help="source dataset directory path")
    parser.add_argument("--train", type=float, required=True,
                        help="train dataset ratio (e.g., 0.8)")
    parser.add_argument("--validation", type=float, required=True,
                        help="validation dataset ratio (e.g., 0.15)")
    parser.add_argument("--test", type=float, required=True,
                        help="test dataset ratio (e.g., 0.05)")

    args = parser.parse_args()

    # 比率の合計が1.0になっているかチェック
    total_ratio = args.train + args.validation + args.test
    if abs(total_ratio - 1.0) > 0.001:  # 浮動小数点の誤差を考慮
        print(f"エラー: データの割合の合計が1.0になっていません (合計: {total_ratio:.3f})")
        print(
            f"train: {args.train}, validation: {args.validation}, test: {args.test}")
        return

    # ソースディレクトリの存在確認
    source_path = Path(args.source)
    if not source_path.exists():
        print(f"エラー: ソースディレクトリが存在しません: {args.source}")
        return

    # JPGファイルを取得
    jpg_files = list(source_path.glob("*.jpg"))
    if not jpg_files:
        print(f"エラー: {args.source} にJPGファイルが見つかりません")
        return

    # 対応するTXTファイルが存在するかチェック
    valid_pairs = []
    for jpg_file in jpg_files:
        txt_file = jpg_file.with_suffix('.txt')
        if txt_file.exists():
            valid_pairs.append((jpg_file, txt_file))
        else:
            print(f"警告: {txt_file} が見つかりません。{jpg_file.name} をスキップします。")

    if not valid_pairs:
        print("エラー: 有効なJPG-TXTペアが見つかりません")
        return

    print(f"有効なデータセットペア数: {len(valid_pairs)}")

    # データをランダムにシャッフル
    random.shuffle(valid_pairs)

    # 分割数を計算
    total_count = len(valid_pairs)
    train_count = int(total_count * args.train)
    validation_count = int(total_count * args.validation)
    test_count = total_count - train_count - validation_count  # 残りをtestに

    print(
        f"分割数 - train: {train_count}, validation: {validation_count}, test: {test_count}")

    # 出力ディレクトリを作成
    output_dirs = {
        'train': Path('./train/images'),
        'validation': Path('./validation/images'),
        'test': Path('./test/images')
    }

    for dir_name, dir_path in output_dirs.items():
        dir_path.mkdir(parents=True, exist_ok=True)
        print(f"{dir_name} ディレクトリを作成/確認しました: {dir_path.absolute()}")

    # データセットを分割してコピー
    datasets = {
        'train': valid_pairs[:train_count],
        'validation': valid_pairs[train_count:train_count + validation_count],
        'test': valid_pairs[train_count + validation_count:]
    }

    for dataset_name, file_pairs in datasets.items():
        output_dir = output_dirs[dataset_name]
        print(f"\n{dataset_name} データセットをコピー中...")

        for i, (jpg_file, txt_file) in enumerate(file_pairs):
            # JPGファイルをコピー
            shutil.copy2(jpg_file, output_dir / jpg_file.name)
            # TXTファイルをコピー
            shutil.copy2(txt_file, output_dir / txt_file.name)

            if (i + 1) % 10 == 0 or i == len(file_pairs) - 1:
                print(f"  {i + 1}/{len(file_pairs)} ファイルペアをコピー完了")

    print(f"\nデータセット分割完了!")
    print(f"train: {len(datasets['train'])} ペア")
    print(f"validation: {len(datasets['validation'])} ペア")
    print(f"test: {len(datasets['test'])} ペア")


if __name__ == "__main__":
    main()
