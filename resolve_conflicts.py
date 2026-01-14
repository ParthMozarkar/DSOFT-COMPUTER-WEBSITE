
import os

files = ['index.html', 'script.js', 'styles.css']
markers = {
    'start': '<<<<<<< HEAD',
    'mid': '=======',
    'end': '>>>>>>>'
}

for file_path in files:
    if not os.path.exists(file_path):
        print(f"Skipping {file_path}, not found.")
        continue
    
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    new_lines = []
    in_head = False
    in_incoming = False
    found_conflict = False
    
    # We want to keep ONLY the incoming part (between ======= and >>>>>>>)
    # But wait, there might be non-conflicting parts outside the markers?
    # Usually in a full file conflict (which these seem to be), the whole file is wrapped.
    # But let's handle the general case: keep top, ignore HEAD block, keep Incoming block, keep bottom.
    
    for line in lines:
        if line.startswith(markers['start']):
            in_head = True
            found_conflict = True
        elif line.startswith(markers['mid']) and in_head:
            in_head = False
            in_incoming = True
        elif line.startswith(markers['end']) and in_incoming:
            in_incoming = False
            # Detect the label after >>>>>> if needed, but ends with newline
        else:
            if in_head:
                continue # Skip HEAD content
            elif in_incoming:
                new_lines.append(line)
            else:
                # Outside of conflict block
                # If these files are 100% wrapped, this handles the empty start/end.
                # If they have shared content, it's preserved.
                 new_lines.append(line)

    if found_conflict:
        print(f"Resolving {file_path} by keeping incoming changes.")
        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
    else:
        print(f"No conflict markers found in {file_path}.")
