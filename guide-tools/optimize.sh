#!/bin/sh
# macOS 版的 resize.ps1 ＋ crop.ps1：shots/*.png（2x PNG）→ opt/*.jpg
#   1) 全部缩到 1200px 宽、JPEG q90
#   2) 两张成绩图（08-*、09-*）先裁到作答栏再缩到 900px 宽（并排时才看得清）
# 裁切框（2x 像素）由环境变数覆盖：CROP="x y w h"
set -e
cd "$(dirname "$0")"
mkdir -p opt
for f in shots/*.png; do
  b=$(basename "$f" .png)
  sips -s format jpeg -s formatOptions 90 --resampleWidth 1200 "$f" --out "opt/$b.jpg" >/dev/null
  printf '%-20s %6d KB\n' "$b" $(( $(stat -f%z "opt/$b.jpg") / 1024 ))
done
if [ -n "$CROP" ]; then
  set -- $CROP; X=$1; Y=$2; W=$3; H=$4
  for f in shots/08-*.png shots/09-*.png; do
    b=$(basename "$f" .png)
    sips -c "$H" "$W" --cropOffset "$Y" "$X" "$f" --out "opt/_crop.png" >/dev/null
    sips -s format jpeg -s formatOptions 92 --resampleWidth 900 "opt/_crop.png" --out "opt/$b.jpg" >/dev/null
    rm -f "opt/_crop.png"
    printf '%-20s cropped %sx%s@%s,%s\n' "$b" "$W" "$H" "$X" "$Y"
  done
fi
