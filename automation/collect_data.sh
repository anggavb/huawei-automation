#!/bin/bash

TARGET_DIR="./cron"
# TARGET_DIR="/home/cron"
mkdir -p "$TARGET_DIR"

DATE_STR=$(date +"%m%d%Y")
TIME_STR=$(date +"%H.%M")
FILE_NAME="cron_${DATE_STR}_${TIME_STR}.csv"
FILE_PATH="${TARGET_DIR}/${FILE_NAME}"

# URL API Target
API_URL="https://worldcup26.ir/get/games"

# Ambil data JSON dengan curl, lalu konversi objek JSON ke baris CSV menggunakan jq
curl -s "$API_URL" | jq -r '
  .games[] | [."id", ."home_team_name_en", ."away_team_name_en", ."local_date"] | join(",")
' > "$FILE_PATH"

echo "Data dari API berhasil dikonversi dan disimpan ke $FILE_PATH"
