# 工作规则

- 安排的工作必须进队列，自主安排优先级
- 任务卡住时跳转下一个
- 队列未清空时，每10分钟报告一次进度
- 待办任务队列（`TODO.md`）每隔10分钟更新一次，包含任务状态和最后更新时间
- **会话恢复规则**：电脑随时可能关机，每次交互后或每隔几分钟，将通信摘要、当前任务状态、工作进度完整写入 `memory/` 目录（按日期命名，如 `memory/2026-03-20.md`），确保下次开机可完整恢复
- git 已配置时，每次重要操作后执行 `git add . && git commit`，保证变更不丢失
- 下载时多试几次；已有文件不要重复从 GitHub 下载

---

## 搜索规范（重要！）

除非用户指定搜索方式，否则**默认使用 Tavily**进行所有搜索：
- 中英文内容均优先使用 Tavily
- 仅当 Tavily 返回结果明显有问题时，才补充使用其他搜索方式（如多搜索引擎 skill）

---

## 日报规范（重要！）

每天发两种日报，分别发送：

**① 新闻日报**
- 内容：Tavily 搜索当天要闻（地缘政治、AI科技、美国政治、市场经济）
- 格式：分主题列出摘要 + 来源链接
- 发送方式：Tavily 搜索 → 整理 → Python smtplib → 发送到 HZ-lu2007@outlook.com

**② 工作日报**
- 内容：今日通信概要 + 已完成工作 + 未完成/阻塞项
- 格式：分节列出，不含新闻内容
- 发送方式：Python smtplib → 发送到 HZ-lu2007@outlook.com

发件邮箱：kimberagent@163.com（SMTP 直发）

---

## 邮件发送能力（技术记录）

**实现方式：** Python smtplib（无需 nodemailer，无需安装任何模块）

**原因：** nodemailer 在本环境中不可用（`require('nodemailer')` 找不到），且 nodemailer 未安装在任何 node_modules 中。

**发送脚本位置：** `C:\Users\yongl\.qclaw\workspace\send163.py`

**SMTP 配置（163邮箱）：**
- Host: `smtp.163.com`
- Port: `465`（SSL）
- User: `kimberagent@163.com`
- Pass: `KUy32yx8YxKiQww7`（163邮箱 SMTP 授权码）
- From: `kimberagent@163.com`
- TLS: `ssl.create_default_context()` + `SMTP_SSL`

**Python 核心代码片段：**
```python
import smtplib, ssl
ctx = ssl.create_default_context()
s = smtplib.SMTP_SSL('smtp.163.com', 465, context=ctx)
s.login('kimberagent@163.com', 'KUy32yx8YxKiQww7')
msg = f'From: {FROM}\r\nTo: {TO}\r\nSubject: ...\r\n\r\n{body}'
s.sendmail(FROM, [TO], msg.encode('utf-8'))
s.quit()
```

**重要限制：**
- SMTP 凭据无法写入 Program Files（权限不足），需通过 `write` 工具或 Python 直接写入
- 脚本存放在 workspace，每次发送时用 Python 执行该脚本
- 公邮平台通道（`127.0.0.1:19000` 代理）不通，依赖 163 SMTP 直连
