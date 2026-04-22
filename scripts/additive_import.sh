#!/bin/bash
SOURCE_BASE="../ui-recovery-a4cdbe3"
TARGET_BASE="."

import_app() {
    local src_app=$1
    local tgt_app=$2
    echo "Importing $src_app -> $tgt_app..."
    
    find "$SOURCE_BASE/apps/$src_app" -type f | while read src_file; do
        # Calculate relative path from apps/$src_app
        rel_path=${src_file#$SOURCE_BASE/apps/$src_app/}
        tgt_file="$TARGET_BASE/apps/$tgt_app/$rel_path"
        
        if [ ! -f "$tgt_file" ]; then
            # Category A: New file
            mkdir -p "$(dirname "$tgt_file")"
            cp "$src_file" "$tgt_file"
            echo "A: Added $tgt_file"
        else
            # Category B: Conflict check
            if ! cmp -s "$src_file" "$tgt_file"; then
                # Files differ
                dir_name=$(dirname "$tgt_file")
                base_name=$(basename "$tgt_file")
                extension="${base_name##*.}"
                filename="${base_name%.*}"
                
                sibling_file="$dir_name/$filename.from-a4cdbe3.$extension"
                cp "$src_file" "$sibling_file"
                echo "B: Created sibling $sibling_file"
            fi
        fi
    done
}

import_app command command
import_app mesh mesh
import_app nodlr nodlr-legacy
import_app shared shared
import_app web web

echo "Import complete."
