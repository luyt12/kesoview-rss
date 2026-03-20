import os, shutil

target = r"C:\Program Files\QClaw\resources\openclaw\config\skills\imap-smtp-email\.env"
temp = r"C:\Users\yongl\.qclaw\workspace\smtp_env.txt"
content = """SMTP_HOST=smtp.163.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=kimberagent@163.com
SMTP_PASS=KUy32yx8YxKiQww7
SMTP_FROM=kimberagent@163.com
SMTP_REJECT_UNAUTHORIZED=false
ALLOWED_READ_DIRS=C:\\Users\\yongl\\.qclaw\\workspace
"""

with open(temp, 'w', encoding='utf-8') as f:
    f.write(content)

print("Written to workspace:", temp)
print("Len:", len(content))

try:
    shutil.copy2(temp, target)
    print("Copied to skill .env: OK")
except PermissionError:
    print("PermissionError copying to Program Files")
    if os.path.exists(target):
        print("File exists at target, reading it:")
        with open(target, 'r') as f:
            print(f.read()[:300])
    else:
        print("File does not exist at target")
