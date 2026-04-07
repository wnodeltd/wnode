import os
import re

def replace_in_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        try:
            content = f.read()
        except:
            return

    original = content
    
    content = re.sub(r"(?i)\bwnodes\b", lambda m: "Nodls" if m.group(0).istitle() else ("NODLS" if m.group(0).isupper() else "nodls"), content)
    content = re.sub(r"(?i)wnode's\b", lambda m: "Nodl's" if m.group(0).istitle() else ("NODL'S" if m.group(0).isupper() else "nodl's"), content)
    
    def replace_base(m):
        w = m.group(1)
        if w.isupper(): return "NODL"
        elif w.istitle(): return "Nodl"
        else: return "nodl"
        
    content = re.sub(r"(Wnode|wnode|WNODE)", replace_base, content)
    
    # Restore the literal graphic logo string requested by the user
    content = content.replace(">nodl</span>", ">wnode</span>")
    
    if content != original:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {path}")

skip_files = {'go.sum', 'package-lock.json', 'pnpm-lock.yaml', 'pnpm-workspace.yaml', 'refactor.py', 'refactor2.py', 'unrefactor.py'}

for root, dirs, files in os.walk('.'):
    dirs[:] = [d for d in dirs if not d.startswith('.') and d not in ('node_modules', 'dist', 'build', 'nodld_bin', 'nodld_debug')]
    for file in files:
        if file in skip_files: continue
        if file.endswith(('.go', '.ts', '.tsx', '.js', '.jsx', '.css', '.md', '.sql', '.html', '.sh', '.json', '.mod')):
            replace_in_file(os.path.join(root, file))
