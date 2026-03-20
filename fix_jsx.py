import os

def solve_jsx_issue(file_path):
    if not os.path.exists(file_path):
        return False
    
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # We want to remove line 628 (extra </div>)
    # Line 628 translates to index 627 (since indices are 0-indexed)
    if len(lines) > 627 and "</div>" in lines[627]:
        del lines[627]
        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(lines)
        return True
    return False

if __name__ == "__main__":
    target_file = r"c:\work\AI 리더캠프\projects\treia\app\treia\page.tsx"
    if solve_jsx_issue(target_file):
        print("Success")
    else:
        print("Failed")
