# 🔗 TinyLink — URL Shortener (Next.js + Neon Postgres)

TinyLink is a minimal, production-ready URL shortening service (similar to bit.ly) built for the take-home assignment.  
It supports creating short links, redirects, click analytics, deletion, and a clean dashboard UI.

Live Demo: **https://tinylink-phi-ten.vercel.app/**  
API Base URL: **https://tinylink-phi-ten.vercel.app/api**

---

## 🚀 Features

### 🔧 Core Functionality

- Create short URLs with optional custom codes
- Automatic code generation (`A-Za-z0-9`, length 6–8)
- 302 redirect to target URL via `/:code`
- Click count tracking
- Last-clicked timestamp tracking
- Delete short links
- Fully public (no login required)

### 📊 Dashboard

- Create links via form
- Error + success messages
- Loading states
- Search filter by code or URL
- Pagination
- Dark mode toggle
- Copy button
- "Open" button
- Delete button
- Responsive layout
- Small analytics chart (top links by clicks)

### 🔍 Stats Page

- `/code/:code` shows:
  - Target URL
  - Total clicks
  - Created date
  - Last clicked
  - Copy short link button

### 🩺 Health Check

- `/healthz` returns:

```json
{ "ok": true, "version": "1.0" }
```
