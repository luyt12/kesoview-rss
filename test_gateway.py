import urllib.request
import json

# 检查本地代理是否可用
try:
    req = urllib.request.Request(
        "http://localhost:19000/",
        method="GET"
    )
    with urllib.request.urlopen(req, timeout=5) as r:
        print("Proxy reachable, status:", r.status)
except Exception as e:
    print("Proxy not reachable:", e)

# 检查 AUTH_GATEWAY_PORT 环境变量
import os
port = os.environ.get("AUTH_GATEWAY_PORT", "19000 (default)")
print("AUTH_GATEWAY_PORT:", port)
