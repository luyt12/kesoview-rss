import base64, os, urllib.request

skill_dir = r"C:\Users\yongl\AppData\Roaming\openclaw\config\skills\tavily-search"
os.makedirs(skill_dir, exist_ok=True)

files = {
    "SKILL.md": "https://raw.githubusercontent.com/rioiart/tavily-skill/main/SKILL.md",
    "scripts/tavily_search.sh":   "https://raw.githubusercontent.com/rioiart/tavily-skill/main/scripts/tavily_search.sh",
    "scripts/tavily_extract.sh":  "https://raw.githubusercontent.com/rioiart/tavily-skill/main/scripts/tavily_extract.sh",
    "scripts/tavily_sitemap.sh":  "https://raw.githubusercontent.com/rioiart/tavily-skill/main/scripts/tavily_sitemap.sh",
    "scripts/tavily_research.sh": "https://raw.githubusercontent.com/rioiart/tavily-skill/main/scripts/tavily_research.sh",
    "scripts/tavily_crawl.sh":    "https://raw.githubusercontent.com/rioiart/tavily-skill/main/scripts/tavily_crawl.sh",
    "references/api_reference.md": "https://raw.githubusercontent.com/rioiart/tavily-skill/main/references/api_reference.md",
}

for rel_path, url in files.items():
    full_path = os.path.join(skill_dir, rel_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    try:
        with urllib.request.urlopen(url) as resp:
            content = resp.read().decode('utf-8')
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"OK: {rel_path}")
    except Exception as e:
        print(f"FAIL: {rel_path} -> {e}")

print("All done!")
