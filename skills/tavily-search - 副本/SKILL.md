# Tavily Search Skill

使用 Tavily AI 搜索 API 进行智能搜索。

## 配置

在环境变量或 `.env` 文件中设置：
```
TAVILY_API_KEY=tvly-xxx
```

## 使用

### 基本搜索
```javascript
// 搜索最新 AI 新闻
const results = await tavilySearch("latest AI news", { maxResults: 5 });
```

### 深度搜索
```javascript
// 深度搜索获取更详细结果
const results = await tavilySearch("GPT-5 release date", { 
  searchDepth: "advanced",
  maxResults: 3,
  includeAnswer: true
});
```

## API

### `tavilySearch(query, options)`

- `query` (string): 搜索查询
- `options` (object):
  - `searchDepth`: `"basic"` 或 `"advanced"` (默认: `"basic"`)
  - `maxResults`: 最大结果数 (默认: 5)
  - `includeAnswer`: 是否包含 AI 生成的答案 (默认: false)
  - `includeImages`: 是否包含图片 (默认: false)

## 返回格式

```json
{
  "query": "搜索词",
  "results": [
    {
      "title": "标题",
      "url": "链接",
      "content": "摘要",
      "score": 0.95
    }
  ],
  "answer": "AI 生成的答案 (如果 includeAnswer=true)"
}
```
