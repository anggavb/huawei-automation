#!/bin/bash

TARGET_DIR="./cron"

# Mencari file berekstensi .csv di target folder yang berumur lebih dari 30 hari, lalu menghapusnya
find "$TARGET_DIR" -type f -name "cron_*.csv" -mtime +30 -exec rm {} \;

echo "Proses data cleansing selesai pada $(date)"
