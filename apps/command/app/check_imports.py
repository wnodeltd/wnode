
import os
import re

files_to_check = [
    "apps/command/app/layout.tsx",
    "apps/command/app/components/Shell.tsx",
    "apps/command/app/components/TopHeader.tsx"
]

base_dir = "/home/obregan/Documents/nodl"

def resolve_path(current_file, import_path):
    if import_path.startswith("@shared/"):
        return os.path.join(base_dir, "apps/shared", import_path[len("@shared/"):])
    if import_path.startswith("./") or import_path.startswith("../"):
        dir_name = os.path.dirname(current_file)
        return os.path.join(dir_name, import_path)
    return None

for f in files_to_check:
    abs_f = os.path.join(base_dir, f)
    if not os.path.exists(abs_f):
        print(f"File not found: {f}")
        continue
    
    with open(abs_f, 'r') as content:
        lines = content.readlines()
        for line in lines:
            match = re.search(r'from\s+["\']([^"\']+)["\']', line)
            if match:
                import_path = match.group(1)
                resolved = resolve_path(abs_f, import_path)
                if resolved:
                    # Try with extensions
                    found = False
                    for ext in ['', '.tsx', '.ts', '.js', '.css']:
                        if os.path.exists(resolved + ext):
                            found = True
                            break
                    if not found:
                        print(f"BROKEN IMPORT in {f}: {import_path} (Resolved to {resolved})")
