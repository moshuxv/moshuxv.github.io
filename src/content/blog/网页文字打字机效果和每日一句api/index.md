---
title: 网页打字机效果和每日一句api
description: 扇贝单词每日一句api调用.
publishDate: 2025-06-13
language: 'zh-cn'
heroImage: { src: './1.jpg', color: '#D58388' }
tags:
  - 随笔
---


## 前言

一直都觉得扇贝单词app的每日一句文字很不错，所以想把每日一句加到我的网站上来

## Api

抓包找到了扇贝单词每日一句的API接口,具体的地址如下：

获取指定日期

```bash
https://apiv3.shanbay.com/weapps/dailyquote/quote/?date=2025-05-07
```

获取当天

```bash
https://apiv3.shanbay.com/weapps/dailyquote/quote/
```

## 实现方法

本来想让网站每日更新扇贝单词当天的每日一句，直接调用api的话，涉及到跨域请求问题，我的网站是纯静态的所以实现不了，解决思路是把文字内容爬取下来用Javascript进行调用

## python爬取

写了一段python程序用于爬取每日一句

```python
import requests
import json
from datetime import datetime, timedelta
import os

def crawl_daily_quote(date_str):
    url = f"https://apiv3.shanbay.com/weapps/dailyquote/quote/?date={date_str}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        return {
            "content": data["content"],
            "author": data["author"],
            "translation": data["translation"]
        }
    except requests.RequestException as e:
        print(f"请求 {date_str} 的数据时出错: {e}")
    except (KeyError, json.JSONDecodeError) as e:
        print(f"解析 {date_str} 的数据时出错: {e}")
    return None


def save_to_json(data, file_path):
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        print(f"数据已成功保存到 {file_path}")
    except Exception as e:
        print(f"保存文件时出错: {e}")

def main(start_date_str, end_date_str):
    start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
    end_date = datetime.strptime(end_date_str, '%Y-%m-%d')
delta = end_date - start_date
all_data = []
for i in range(delta.days + 1):
    current_date = start_date + timedelta(days=i)
    date_str = current_date.strftime('%Y-%m-%d')
    print(f"正在爬取 {date_str} 的数据...")
    quote_data = crawl_daily_quote(date_str)
    if quote_data:
        quote_data["id"] = len(all_data) + 1
        all_data.append(quote_data)

save_path = r"C:\Users\Administrator\Downloads"
file_path = os.path.join(save_path, 'daily_quotes.json')
save_to_json(all_data, file_path)
if __name__ == "__main__":
    start_date = "2025-04-01"
    end_date = "2025-05-01"
    main(start_date, end_date)
```

爬取下来的内容格式是这样的：


```json
        [
            {
                "content": "The time spent with you allowed me to feel again.",
                "author": "《大洋之间的灯光》",
                "translation": "与你共度的时光，让我重新苏醒。",
                "id": 2
            }
        ]  
```

## JavaScript写法

用JavaScript调用：
```javascript
        (function () {
            // 配置参数
            const SPEED = 30;   // 打字速度（毫秒）
            const INITIAL_LINES = [
                { id: 'line1', text: 'welcome to moshuxv blog' },
                { id: 'line2', text: '欢迎访问莫书旭的博客' }
            ];
            const ADDITIONAL_LINES = [
                { text: '--Who？', pause: 1000 },
                { text: "--It's me.", pause: 1000 },
                { text: 'Haha, just making a joke.', pause: 1000 }
            ];
            const WAIT_TIME = 20; // 等待时间（毫秒）
            const LINES = [
                { id: 'line1', key: 'content' },
                { id: 'line2', key: 'translation' },
                { id: 'line3', key: 'author', prefix: '-- ' }
            ];
        })();
      // 核心逻辑
      async function init() {
          // 先显示初始内容
          await showInitialLines();
    
          // 退格初始内容
          await backspaceLines();
    
          // 然后加载后续内容
          try {
              const data = await fetch('src/assets/1.json').then(res => res.json());
              const item = data[Math.floor(Math.random() * data.length)];
              // 逐行输入内容
              for (let i = 0; i < LINES.length; i++) {
                  const line = LINES[i];
                  const el = document.getElementById(line.id);
                  const text = line.prefix ? line.prefix + item[line.key] : item[line.key];
                  await typeText(el, text);
                  // 如果是 line2 显示完，处理 line3 的额外内容
                  if (line.id === 'line2') {
                      await handleAdditionalLinesInLine3();
                  }
              }
              // 添加闪烁光标
              addBlinkingCursor(LINES[LINES.length - 1].id);
          } catch (e) {
              showError(e);
          }
      }
    
      async function showInitialLines() {
          for (const line of INITIAL_LINES) {
              const el = document.getElementById(line.id);
              await typeText(el, line.text);
              if (line.id === 'line2') {
                  const cursor = addBlinkingCursor(line.id);
                  await wait(2000, cursor); // 停顿 2 秒
              }
          }
      }
    
      async function handleAdditionalLinesInLine3() {
          const line3El = document.getElementById('line3');
          for (const line of ADDITIONAL_LINES) {
              await typeText(line3El, line.text);
              const cursor = addBlinkingCursor('line3');
              await wait(line.pause, cursor);
              await backspaceText(line3El, line.text.length);
          }
      }
    
      async function backspaceLines() {
          for (const line of INITIAL_LINES.reverse()) {
              const el = document.getElementById(line.id);
              await backspaceText(el, line.text.length);
          }
      }
    
      async function typeLines(item) {
          // 清空所有行内容
          LINES.forEach(line => {
              document.getElementById(line.id).innerHTML = '';
          });
    
          // 逐行输入内容
          for (const line of LINES) {
              const el = document.getElementById(line.id);
              const text = line.prefix ? line.prefix + item[line.key] : item[line.key];
              await typeText(el, text);
          }
    
          // 添加闪烁光标
          addBlinkingCursor(LINES[LINES.length - 1].id);
      }
    
      function typeText(el, text) {
          return new Promise(resolve => {
              let count = 0;
              const timer = setInterval(() => {
                  // 带光标的临时内容
                  el.innerHTML = text.slice(0, count) + '<span class="typing-cursor">|</span>';
                  count++;
                  if (count > text.length) {
                      clearInterval(timer);
                      el.textContent = text; // 最终移除光标
                      resolve();
                  }
              }, SPEED);
          });
      }
    
      function backspaceText(el, length) {
          return new Promise(resolve => {
              let count = length;
              const timer = setInterval(() => {
                  const text = el.textContent.slice(0, count - 1);
                  el.innerHTML = text + '<span class="typing-cursor">|</span>';
                  count--;
                  if (count < 0) {
                      clearInterval(timer);
                      el.textContent = '';
                      resolve();
                  }
              }, SPEED);
          });
      }
    
      function addBlinkingCursor(lineId) {
          const lastLine = document.getElementById(lineId);
          const cursor = document.createElement('span');
          cursor.classList.add('blinking-cursor');
          cursor.textContent = '|';
          lastLine.appendChild(cursor);
    
          // 闪烁动画
          let isVisible = true;
          const blinkInterval = setInterval(() => {
              isVisible = !isVisible;
              cursor.style.opacity = isVisible ? '1' : '0';
          }, 500);
    
          return { cursor, blinkInterval };
      }
    
      function wait(time, cursorObj) {
          return new Promise(resolve => {
              setTimeout(() => {
                  clearInterval(cursorObj.blinkInterval);
                  cursorObj.cursor.remove();
                  resolve();
              }, time);
          });
      }
    
      function showError(e) {
          console.error('Error:', e);
          document.getElementById('line1').textContent = '数据加载失败';
      }
    
      // 启动
      document.addEventListener('DOMContentLoaded', init);
        })();
```
 html的写法：

```html
<div class="typing-line" id="line1"></div>
<div class="typing-line" id="line2"></div>
<div class="typing-line" id="line3"></div>
```

## 效果

显示效果看点链接看我博客首页https://msx.ink

