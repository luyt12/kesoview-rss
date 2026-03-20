@echo off
:: Tavily Search 快捷测试脚本
:: 用法: test_tavily.ps1 "搜索关键词"
:: 需要设置 TAVILY_API_KEY 环境变量

python "%~dp0tavily_search.py" --query "%~1" --format md
