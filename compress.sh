#!/bin/bash

show_help() {
    cat << EOF
Usage: $0 [max_size_kb] [folder_path]

Compress JPEG images recursively to be under a specified size.

Arguments:
  max_size_kb   Maximum file size in kilobytes (default: 500)
  folder_path   Folder path to recursively process images (default: current directory)

Description:
  This script recursively finds all .jpg and .jpeg files (case-insensitive)
  in the specified folder, and compresses them to be under the target file size.

  Compression is done by:
    1) Reducing JPEG quality in steps of 10, from 90 down to 50.
    2) If still too large, reducing image dimensions by 10% steps down to 50%.

  The script keeps the aspect ratio and overwrites the original files only
  if the compressed version is smaller and under the max size.

  A warning is printed if the minimum quality (50%) is reached during compression.

Examples:
  $0                 # Compress images under 500KB in current directory
  $0 300 /path/to/dir # Compress images under 300KB in /path/to/dir

Options:
  -h, --help    Show this help message and exit
EOF
}

# Default values
MAX_SIZE_KB=500
INPUT_DIR="."

# Parse args
if [[ "$1" == "-h" || "$1" == "--help" ]]; then
    show_help
    exit 0
fi

if [[ -n "$1" ]]; then
    if [[ "$1" =~ ^[0-9]+$ ]]; then
        MAX_SIZE_KB="$1"
    else
        echo "❌ Error: max_size_kb must be a positive integer."
        show_help
        exit 1
    fi
fi

if [[ -n "$2" ]]; then
    if [[ -d "$2" ]]; then
        INPUT_DIR="$2"
    else
        echo "❌ Error: folder_path '$2' is not a valid directory."
        show_help
        exit 1
    fi
fi

# Convert KB to bytes
MAX_SIZE=$((MAX_SIZE_KB * 1024))

# Other constants
QUALITY_START=90
QUALITY_MIN=50
RESIZE_START=100
RESIZE_MIN=50
STEP=10

find "$INPUT_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" \) | while read -r img; do
    [ -f "$img" ] || { echo "⚠️ Skipping missing file: $img"; continue; }

    FILE_SIZE=$(stat -c%s "$img")

    if [ "$FILE_SIZE" -le "$MAX_SIZE" ]; then
        echo "✓ Skipping $img (already under target size)"
        continue
    fi

    echo "🔧 Processing: $img ($(du -h "$img" | cut -f1))"

    TMP_IMG="$(dirname "$img")/tmp_$$.jpg"

    QUALITY=$QUALITY_START
    cp "$img" "$TMP_IMG"

    # Reduce quality (including min quality)
    while [ "$(stat -c%s "$TMP_IMG")" -gt "$MAX_SIZE" ] && [ "$QUALITY" -ge "$QUALITY_MIN" ]; do
        magick "$img" -quality "$QUALITY" "$TMP_IMG"
        QUALITY=$((QUALITY - STEP))
    done

    if [ "$QUALITY" -lt "$QUALITY_MIN" ]; then
        echo "⚠️ Warning: $img compressed with low quality ($((QUALITY + STEP)))"
    fi

    RESIZE=$RESIZE_START
    # Reduce size (including min resize)
    while [ "$(stat -c%s "$TMP_IMG")" -gt "$MAX_SIZE" ] && [ "$RESIZE" -ge "$RESIZE_MIN" ]; do
        magick "$img" -resize "${RESIZE}%" -quality "$QUALITY" "$TMP_IMG"
        RESIZE=$((RESIZE - STEP))
    done

    # Move compressed file even if still > MAX_SIZE
    mv "$TMP_IMG" "$img"
    NEW_SIZE=$(stat -c%s "$img")
    echo "✅ Finished $img: $(du -h "$img" | cut -f1) (target was $((MAX_SIZE/1024)) KB)"
done
