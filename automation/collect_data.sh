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

# Ambil data JSON dengan curl (dengan timeout 10 detik koneksi, 30 detik total)
JSON_DATA=$(curl -s --connect-timeout 10 --max-time 30 "$API_URL")

# Penanganan error jika curl gagal atau data kosong
if [ $? -ne 0 ] || [ -z "$JSON_DATA" ]; then
  echo "Error: Gagal mengunduh data dari API (Timeout atau masalah koneksi)." >&2
  exit 1
fi

# Tulis header CSV ke file target
echo "id,home_team_name_en,away_team_name_en,local_date" > "$FILE_PATH"

# Konversi objek JSON ke baris CSV menggunakan jq (dibatasi maksimal 1000 baris untuk mencegah overload)
echo "$JSON_DATA" | jq -r '
  .games[]? | [."id", ."home_team_name_en", ."away_team_name_en", ."local_date"] | join(",")
' | head -n 1000 >> "$FILE_PATH"

echo "Data dari API berhasil dikonversi dan disimpan ke $FILE_PATH"
