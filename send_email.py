import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

today = datetime.now().strftime('%Y-%m-%d')

report = f"""📰 每日简报 — {today}

================================================================
🌍 地缘政治：美伊战争（第20天）
----------------------------------------------------------------------
• 美国和以色列联合打击伊朗境内军事目标，以色列袭击了南帕尔斯天然气田
• 油价飙升 — 全球能源市场受到重大冲击
• 特朗普："不会向伊朗派遣地面部队"
• 核心情报摘要：美以冲突第20天，美军深入打击伊朗境内军事目标，以色列袭击南帕尔斯气田导致能源价格暴涨。

📎 来源：
  - CNN: https://www.cnn.com/2026/03/19/middleeast/us-israel-iran-middle-east-war-day-20-what-we-know-intl-hnk
  - Al Jazeera: https://www.aljazeera.com/video/newsfeed/2026/3/20/unpacking-netanyahus-latest-claims-about-the-war-on-iran
  - Fox News: https://www.foxnews.com/video/6391246686112

----------------------------------------------------------------------
🤖 AI 与科技
----------------------------------------------------------------------
• AI 基础设施快速扩张 — Cerebras 登陆 AWS、NVIDIA 开放数据计划
• 2026年3月多个新 AI 模型发布；初创公司受益于基础设施改善
• 核心情报摘要：AI 基础设施快速扩张，多个新模型和合作项目涌现，包括 Cerebras 与 AWS 的合作以及 NVIDIA 的开放数据计划。

📎 来源：
  - Mean CEO: https://blog.mean.ceo/new-ai-model-releases-news-march-2026/
  - Radical Data Science: https://radicaldatascience.wordpress.com/2026/03/17/ai-news-briefs-bulletin-board-for-march-2026/

----------------------------------------------------------------------
🇺🇸 美国政治
----------------------------------------------------------------------
• 特朗普3月20日会见多国领导人，签署针对伊朗的新行政令
• 出席士兵遗体归国仪式；伊朗战争成为第二任期核心议题
• 核心情报摘要：3月20日特朗普会见国际领导人，签署针对伊朗威胁的行政令，并出席伤亡将士归国仪式。

📎 来源：
  - CNN: https://www.cnn.com/politics/president-donald-trump-47
  - AP News: https://apnews.com/hub/donald-trump
  - 白宫: https://www.whitehouse.gov/videos/president-trump-participates-in-a-bilateral-meeting-mar-19-2026/

----------------------------------------------------------------------
💰 市场与经济
----------------------------------------------------------------------
• 道指3月20日上涨200+点，标普500上涨
• 标普500早些时候因伊朗石油危机创年内新低
• 油价维持高位；Nvidia 和油价是华尔街关注焦点
• 全球15%关税生效 — 市场波动持续

📎 来源：
  - CNBC: https://www.cnbc.com/2026/03/03/stock-market-today-live-updates.html
  - CNBC: https://www.cnbc.com/2026/03/12/stock-market-today-live-updates.html

================================================================
由 OpenClaw Agent 生成 | Tavily Search API 驱动
"""

print("=== 每日简报邮件发送 ===")
print(f"收件人: HZ-lu2007@outlook.com")
print(f"主题: 每日简报 {today}")
print("")

# Check for SMTP credentials in .env
env_path = r"C:\Program Files\QClaw\resources\openclaw\config\skills\imap-smtp-email\.env"
smtp_host = None
smtp_user = None
smtp_pass = None
smtp_port = 587
smtp_from = None

if os.path.exists(env_path):
    print("找到 SMTP 配置文件...")
    with open(env_path, 'r') as f:
        for line in f:
            line = line.strip()
            if line.startswith('#') or '=' not in line:
                continue
            k, v = line.split('=', 1)
            k = k.strip()
            v = v.strip()
            if k == 'SMTP_HOST': smtp_host = v
            elif k == 'SMTP_PORT': smtp_port = int(v)
            elif k == 'SMTP_USER': smtp_user = v
            elif k == 'SMTP_PASS': smtp_pass = v
            elif k == 'SMTP_FROM': smtp_from = v

    print(f"  SMTP_HOST: {'已配置' if smtp_host else '未配置'}")
    print(f"  SMTP_USER: {'已配置' if smtp_user else '未配置'}")
    print(f"  SMTP_PASS: {'已配置' if smtp_pass else '未配置'}")
else:
    print("未找到 SMTP 配置文件")

if not all([smtp_host, smtp_user, smtp_pass]):
    print("")
    print("SMTP 未完整配置，跳过发送。日报内容如下：")
    print(report)
else:
    try:
        print("\n正在连接 SMTP 服务器...")
        msg = MIMEMultipart()
        msg['From'] = smtp_from or smtp_user
        msg['To'] = 'HZ-lu2007@outlook.com'
        msg['Subject'] = f"每日简报 {today}"
        msg.attach(MIMEText(report, 'plain', 'utf-8'))

        server = smtplib.SMTP(smtp_host, smtp_port)
        server.ehlo()
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.sendmail(smtp_user, ['HZ-lu2007@outlook.com'], msg.as_string())
        server.quit()

        print("✅ 邮件发送成功!")
    except Exception as e:
        print(f"❌ 发送失败: {e}")
        print("")
        print("日报内容：")
        print(report)
