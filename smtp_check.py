import os, json

p = r"C:\Program Files\QClaw\resources\openclaw\config\skills\imap-smtp-email\.env"
result = {"env_exists": os.path.exists(p)}
print(json.dumps(result))
