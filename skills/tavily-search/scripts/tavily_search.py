#!/usr/bin/env python3
"""
Tavily Search Skill for OpenClaw
直接调用 Tavily REST API，无第三方依赖
用法:
  python tavily_search.py --query "关键词" --max-results 5 --format md
  python tavily_search.py --query "关键词" --search-depth advanced --format json
  python tavily_search.py --query "关键词" --topic news --days 7
"""

import sys
import json
import argparse
import urllib.request
import urllib.parse
import os


def search_tavily(api_key: str, query: str, max_results: int = 5,
                  search_depth: str = "basic", topic: str = "general",
                  days: int = None, include_answer: bool = False,
                  include_raw_content: bool = False,
                  include_images: bool = False) -> dict:
    """调用 Tavily Search API"""
    base_url = "https://api.tavily.com/search"

    headers = {
        "Content-Type": "application/json",
    }

    payload = {
        "api_key": api_key,
        "query": query,
        "search_depth": search_depth,  # "basic" or "advanced"
        "max_results": max_results,
        "topic": topic,  # "general" or "news"
        "include_answer": include_answer,
        "include_raw_content": include_raw_content,
        "include_images": include_images,
    }

    if days is not None:
        payload["days"] = days

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        base_url,
        data=data,
        headers=headers,
        method="POST"
    )

    with urllib.request.urlopen(req, timeout=30) as response:
        return json.loads(response.read().decode("utf-8"))


def format_json(results: dict) -> str:
    """JSON 原始格式输出"""
    return json.dumps(results, ensure_ascii=False, indent=2)


def format_markdown(results: dict, query: str) -> str:
    """友好的 Markdown 格式输出"""
    lines = [f"## 🔍 搜索结果: {query}\n"]

    if "answer" in results and results["answer"]:
        lines.append(f"### 💬 AI 摘要\n{results['answer']}\n")

    lines.append(f"**查询时间**: {results.get('search_time', 'N/A')}秒")
    lines.append(f"**结果数量**: {len(results.get('results', []))}\n")
    lines.append("---")

    for i, r in enumerate(results.get("results", []), 1):
        lines.append(f"### {i}. {r.get('title', '无标题')}")
        lines.append(f"**URL**: {r.get('url', 'N/A')}")
        lines.append(f"**摘要**: {r.get('content', 'N/A')[:300]}...")
        lines.append("")

    return "\n".join(lines)


def format_brave(results: dict, query: str) -> str:
    """Brave Search 风格格式"""
    lines = [f"Search results for: {query}\n"]
    for r in results.get("results", []):
        lines.append(f"  - {r.get('title', 'N/A')}")
        lines.append(f"    {r.get('url', 'N/A')}")
        snippet = r.get('content', '')
        if snippet:
            lines.append(f"    {snippet[:200]}")
        lines.append("")
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(
        description="Tavily Search CLI for OpenClaw"
    )
    parser.add_argument("--query", "-q", required=True, help="搜索关键词")
    parser.add_argument("--max-results", "-m", type=int, default=5,
                        help="最大结果数 (默认: 5)")
    parser.add_argument("--search-depth", "-d", default="basic",
                        choices=["basic", "advanced"],
                        help="搜索深度: basic/advanced (默认: basic)")
    parser.add_argument("--topic", "-t", default="general",
                        choices=["general", "news"],
                        help="话题: general/news (默认: general)")
    parser.add_argument("--days", type=int, default=None,
                        help="新闻搜索时的时间范围(天数)")
    parser.add_argument("--format", "-f", default="json",
                        choices=["json", "md", "brave"],
                        help="输出格式: json/md/brave (默认: json)")
    parser.add_argument("--include-answer", action="store_true",
                        help="包含 AI 生成的答案摘要")
    parser.add_argument("--include-raw-content", action="store_true",
                        help="包含原始网页内容摘要")
    parser.add_argument("--api-key", "-k", default=None,
                        help="Tavily API Key (也可设置 TAVILY_API_KEY 环境变量)")

    args = parser.parse_args()

    # 获取 API Key
    api_key = args.api_key or os.environ.get("TAVILY_API_KEY")

    # 尝试从 skill 配置目录读取
    if not api_key:
        skill_dir = os.path.dirname(os.path.abspath(__file__))
        env_path = os.path.join(skill_dir, "..", ".env")
        if os.path.exists(env_path):
            with open(env_path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line.startswith("TAVILY_API_KEY="):
                        api_key = line.split("=", 1)[1].strip().strip('"').strip("'")
                        break

    if not api_key:
        print("错误: 未找到 Tavily API Key。", file=sys.stderr)
        print("请设置 TAVILY_API_KEY 环境变量或创建 .env 文件。", file=sys.stderr)
        print('TAVILY_API_KEY=tvly-xxxxxxxxxxxxxxxx', file=sys.stderr)
        sys.exit(1)

    try:
        results = search_tavily(
            api_key=api_key,
            query=args.query,
            max_results=args.max_results,
            search_depth=args.search_depth,
            topic=args.topic,
            days=args.days,
            include_answer=args.include_answer,
            include_raw_content=args.include_raw_content,
        )

        if args.format == "json":
            print(format_json(results))
        elif args.format == "md":
            print(format_markdown(results, args.query))
        elif args.format == "brave":
            print(format_brave(results, args.query))

    except urllib.error.HTTPError as e:
        print(f"HTTP 错误: {e.code} - {e.reason}", file=sys.stderr)
        body = e.read().decode("utf-8", errors="replace")
        print(body, file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"错误: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
