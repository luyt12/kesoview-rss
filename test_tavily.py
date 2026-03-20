import sys
import json
import urllib.request
import urllib.parse

print("Python version:", sys.version)
print("urllib available: ok")

# Test basic connectivity first
try:
    req = urllib.request.Request("https://api.tavily.com", method="GET")
    with urllib.request.urlopen(req, timeout=10) as r:
        print("Tavily API reachable, status:", r.status)
except Exception as e:
    print("Connectivity error:", e)
