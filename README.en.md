<div align="center">

# Zi Wei Dou Shu · Open-Source Charting Engine & Practice Platform

### Algorithms are openly shared traditional wisdom; they shouldn't be locked behind walls.

[![CI](https://github.com/Renhuai123/ziwei-doushu/actions/workflows/ci.yml/badge.svg)](https://github.com/Renhuai123/ziwei-doushu/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/code-MIT-blue.svg)](./LICENSE)
[![Dataset: CC BY 4.0](https://img.shields.io/badge/dataset-CC%20BY%204.0-green.svg)](./DATASET-LICENSE)

[中文](./README.md) · **English**

</div>

**Philosophy:** Zi Wei Dou Shu is a treasure of traditional Chinese astrology, and Ni Haixia laid out its authentic system in *Tian Ji* (《天纪》). We hope technology can bring more people to learn it. We open-source the charting algorithm and the knowledge base because we believe **algorithms are openly shared traditional wisdom and shouldn't be locked behind walls**. The real value lies in the depth of interpretation, a carefully polished user experience, and what we build up by running the service day after day.

**About the project:** A Zi Wei Dou Shu charting and spiritual practice platform following the teaching system of **Ni Haixia's *Tian Ji***. It includes the full charting algorithm, the Four Transformations, a pattern knowledge base, public-domain classical texts, AI interpretation, Web3 wallet login, cryptocurrency recharge, a credits system, daily practice check-ins, prayer/wish features, and an admin dashboard. Try it at [metisziwei.com](https://metisziwei.com/?from=gh-readme-en).

---

## Table of Contents

| | Section | Summary |
|---|---------|---------|
| 1 | [Feature Overview](#1-feature-overview) | Charting + Divination + Physiognomy + Practice + Prayer + Knowledge |
| 2 | [Tech Architecture](#2-tech-architecture) | Next.js 16 + TypeScript + SQLite + Web3 + AI |
| 3 | [Quick Start](#3-quick-start) | Clone and run |
| 4 | [Charting Engine](#4-charting-engine) | True solar time, DST, leap months, flying stars, patterns |
| 5 | [Module Details](#5-module-details) | Pages, APIs, and credit costs |
| 6 | [Admin Dashboard](#6-admin-dashboard) | User management, recharge review, statistics, check-in records |
| 7 | [Datasets](#7-datasets) | 674,976-chart × 13-topic interpretation dataset v4.0 |
| 8 | [Open-Source Boundary](#8-open-source-boundary) | What's included and what's not |
| 9 | [License](#9-license) | Code MIT / Data CC BY 4.0 / Classics public domain |
| 10 | [About & Contact](#10-about--contact) | Philosophy, tech stack, contact |

---

## 1. Feature Overview

This project is a comprehensive platform combining **traditional Chinese metaphysics** with a **Web3 economy**, featuring six major modules:

### 1.1 Core Astrology

| Feature | Description | Credits |
|---------|-------------|---------|
| **Zi Wei Chart** | Generate a Zi Wei Dou Shu natal chart (12 palaces, 14 major stars, auxiliary stars, Four Transformations) | 20 |
| **Compatibility** | Dual-chart comparison for relationship/career compatibility | 50 |
| **Daily Fortune** | Daily fortune analysis based on your natal chart | 10 |
| **AI Interpretation** | AI streaming interpretation covering 13 analysis dimensions | 10 |
| **AI Q&A** | Chat with AI to explore destiny questions in depth | 10 |

### 1.2 Divination Tools

| Feature | Description | Credits |
|---------|-------------|---------|
| **Word Divination** | Input a Chinese character for divination interpretation | 10 |
| **Draw Lots** | Draw a fortune lot and receive interpretation | 10 |
| **Coin Divination** | Six-line copper coin hexagram divination | 10 |

### 1.3 Physiognomy

| Feature | Description | Credits |
|---------|-------------|---------|
| **AI Face Reading** | Upload a face photo for AI face reading analysis | 10 |
| **AI Palm Reading** | Upload a palm photo for AI palm reading analysis | 10 |
| **Feng Shui** | Environmental feng shui layout AI analysis | 10 |

### 1.4 Daily Practice (6 Check-in Types)

| Feature | Description | Reward |
|---------|-------------|--------|
| **Recitation** | Morning/evening sutra recitation tracking with streaks | First daily +2 |
| **Vegetarian** | Daily vegetarian practice record | First daily +2 |
| **Meditation** | Meditation session tracking with breathing guidance | First daily +2 |
| **Self-Reflection** | Daily reflection check-in | First daily +2 |
| **Tai Chi** | Tai Chi practice record | First daily +2 |
| **Charity** | Acts of kindness record | First daily +2 |

The check-in system includes **streak tracking** and an **8-level achievement system**: First Step (1) → Seven Days (7) → Thirty Days (30) → Hundred Days (100) → All Six (6 in one day) → Fifty Check-ins (50) → Two Hundred (200) → Five Hundred (500)

### 1.5 Prayer & Wishes

| Feature | Description |
|---------|-------------|
| **Prayer** | Pray to deities, select prayer target and deity |
| **Wish** | Make a wish |
| **Repentance** | Repentance practice |
| **Eternal Lamp** | Light an eternal lamp for blessing |
| **Incense** | Virtual incense offering |
| **Ritual** | Virtual ritual ceremony |

### 1.6 Knowledge System

| Feature | Description |
|---------|-------------|
| **Classics Library** | 25+ traditional Chinese texts (I Ching, Tao Te Ching, Analects, Mencius, Great Learning, Doctrine of the Mean, Instructions for Practical Living, Diamond Sutra, Avatamsaka Sutra, Surangama Sutra, Lotus Sutra, Heart Sutra, Liao Fan's Four Lessons, Zhuangzi, Liezi, Huainanzi, Bone Marrow Verse, Complete Works of Zi Wei Dou Shu, etc.) |
| **Knowledge Base** | 14 major stars × 12 palaces encyclopedia with SEO knowledge graph |
| **Full-text Search** | Search across all classical texts |

---

## 2. Tech Architecture

### 2.1 Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + CSS Variables design system |
| **Animation** | Framer Motion |
| **Database** | SQLite (better-sqlite3) |
| **Charting Core** | [iztro](https://github.com/SylarLong/iztro) + lunar-javascript |
| **Web3 Auth** | SIWE (Sign-In with Ethereum) + ethers + viem |
| **AI** | Anthropic Claude SDK / Volcengine Ark (streaming) |
| **Charts** | Recharts + custom SVG visualizations |
| **Deployment** | Vercel |

### 2.2 Database Schema (10 tables)

| Table | Purpose |
|-------|---------|
| `users` | User info (wallet address, nickname, membership tier, balance, credits) |
| `sessions` | Session management (7-day expiry) |
| `usage_limits` | Feature usage limits (free tier: 3 uses per feature) |
| `nonces` | SIWE authentication nonces |
| `recharge_records` | Cryptocurrency recharge records |
| `credits_log` | Credits consumption log |
| `prayer_records` | Prayer/wish/repentance records |
| `recitation_records` | Sutra recitation check-in records |
| `wellness_records` | Practice check-in records (vegetarian/meditation/tai chi/reflection/charity) |
| `feature_stats` | Feature click popularity statistics |

### 2.3 Credits System

| Item | Value |
|------|-------|
| New user bonus | 50 credits |
| Recharge rate | 1 USD = 10 credits |
| Daily check-in reward | +2 credits per type per day (first check-in only) |
| Free tier limit | 3 uses per feature |

### 2.4 Blockchain Support

Supports 3 chains × 3 tokens for cryptocurrency recharge:

| Chain | Chain ID | Tokens |
|-------|----------|--------|
| Ethereum | 1 | USDT / USDC / USDS |
| Polygon | 137 | USDT / USDC / USDS |
| BSC | 56 | USDT / USDC / USDS |

---

## 3. Quick Start

```bash
# Clone
git clone https://github.com/Renhuai123/ziwei-doushu.git
cd ziwei-doushu

# Install dependencies
npm install

# Configure environment variables (optional for charting only)
cp .env.example .env.local

# Start dev server
npm run dev
```

Verification:

```bash
npm run typecheck   # TypeScript type check
npm test            # Charting engine regression tests
npm run build       # Production build
```

---

## 4. Charting Engine

The charting core lives in `lib/ziwei/`.

### 4.1 Capabilities

| Feature | Description |
|---------|-------------|
| **True solar time** | Longitude offset + equation of time correction |
| **China DST** | 1986–1991 daylight-saving periods auto-removed |
| **Leap months** | Four configurable conventions (previous/next/split/same month) |
| **Late Zi hour** | 23:00–23:59 charted on next day, 00:00–00:59 on same day |
| **Star brightness** | 7 levels (庙 旺 得 利 平 不 陷); school-specific tables switchable |
| **Four Transformations** | Natal, decade, annual transformations + flying-star self-transformations |
| **Twelve spirits** | Natal layer by year branch, annual layer by annual branch |
| **Pattern detection** | 1,100+ lines of pattern rules |

### 4.2 Core Files

| File | Description |
|------|-------------|
| `algorithm.ts` | Full charting pipeline |
| `sihua.ts` | Four Transformations flying-star system |
| `patterns.ts` | 1,100+ line pattern knowledge base |
| `true-solar-time.ts` | True solar time correction |
| `dst-cn.ts` | China DST |
| `lunar-solar.ts` | Lunar/solar conversion with leap month handling |
| `school-config.ts` | Brightness school configuration |
| `cities.ts` | Chinese city coordinates |

---

## 5. Module Details

### 5.1 Page Routes

| Route | Purpose |
|-------|---------|
| `/` | Home — philosophy intro, charting entry, tool showcase |
| `/chart` | Zi Wei chart |
| `/heming` | Compatibility chart |
| `/daily` | Daily fortune |
| `/cezi` | Word divination |
| `/chouqian` | Draw lots |
| `/tongqian` | Coin divination |
| `/mianxiang` | AI face reading |
| `/shouxiang` | AI palm reading |
| `/fengshui` | Feng shui analysis |
| `/library` | Classics library |
| `/library/search` | Classics search |
| `/knowledge` | Knowledge base (14 stars × 12 palaces) |
| `/recitation` | Recitation check-in |
| `/vegetarian` | Vegetarian check-in |
| `/meditation` | Meditation check-in |
| `/reflection` | Self-reflection check-in |
| `/taichi` | Tai Chi check-in |
| `/charity` | Charity check-in |
| `/prayer` | Prayer |
| `/wish` | Wish |
| `/repent` | Repentance |
| `/lamp` | Eternal lamp |
| `/incense` | Incense offering |
| `/ritual` | Ritual ceremony |
| `/login` | Web3 wallet login |
| `/profile` | Profile |
| `/dashboard` | Dashboard (check-in overview, achievements, calendar) |
| `/recharge` | Cryptocurrency recharge |
| `/ranking` | Feature popularity ranking |
| `/admin` | Admin dashboard |
| `/terms` | Terms of service |
| `/privacy` | Privacy policy |

### 5.2 API Endpoints

| Endpoint | Function |
|----------|----------|
| `/api/auth/*` | Authentication (nonce, verify, session, check, logout) |
| `/api/user/*` | User profile and usage limits |
| `/api/wallet/*` | Wallet verification, recharge, balance, history |
| `/api/credits/*` | Credits deduction and log |
| `/api/interpret` | AI chart interpretation (streaming) |
| `/api/ai-divine` | AI divination Q&A |
| `/api/heming` | Compatibility AI analysis |
| `/api/prayer` | Prayer records |
| `/api/recitation` | Recitation check-in |
| `/api/wellness` | Practice check-in |
| `/api/fengshui-analyze` | Feng shui AI analysis |
| `/api/shouxiang-analyze` | Palm reading AI analysis |
| `/api/mianxiang-analyze` | Face reading AI analysis |
| `/api/track` | Feature click tracking |
| `/api/ranking` | Feature popularity ranking |
| `/api/admin/*` | Admin API (stats, users, recharge, credits, checkins, prayers, membership, balance) |

---

## 6. Admin Dashboard

The admin dashboard at `/admin` is visible only to the admin wallet address. It contains 5 tabs:

| Tab | Features |
|-----|----------|
| **User Management** | Search, tier filter, edit user (membership/balance/expiry), personal center, credits detail |
| **Recharge Records** | Status filter (all/confirmed/pending), manual confirm/reject, auto-add balance |
| **Credits Management** | Search, sort (balance/gained/spent/count), feature type filter, view detail |
| **Check-in Records** | 6 type stat cards, type filter, user search, view all check-in details |
| **Prayer/Wish** | Type filter, search by user or content, view prayer/wish records |

The statistics popup includes:
- 5 summary cards (total users / new 7d / new 30d / premium ratio / recharge 30d)
- 3 SVG line charts (registration trend / DAU / check-in trend)
- Check-in type bar chart
- Feature usage popularity ranking

---

## 7. Datasets

### v4.0 Interpretation Dataset (2026-10-15)

| Item | Details |
|------|---------|
| Charts | **674,976** (solar dates 1950–2026 × 12 double-hours × male/female) |
| Readings | **8,774,688** (13 topics per chart) |
| Topics | Overview, personality, love, career, wealth, health, siblings, children, relocation, social, home, spirituality, parents |
| Size | 56.6 GB uncompressed; 161 MB compressed (77 per-year files) |
| License | CC BY 4.0, commercial use OK with attribution |

Download: [Release v4.0-13d](https://github.com/Renhuai123/ziwei-doushu/releases/tag/v4.0-13d)

### v3.0 Sample Dataset

518,400 samples covering 1924–1983 (one full 60-year cycle), 33.1 GB.

Download: [Release v3.0-samples](https://github.com/Renhuai123/ziwei-doushu/releases/tag/v3.0-samples)

---

## 8. Open-Source Boundary

| | Content |
|---|---------|
| ✅ **Open source** | Charting engine, public-domain classical texts, SEO knowledge graph, demo UI, datasets |
| ❌ **Not open source** | Judgment library (`db-analysis.ts` is a placeholder), AI prompts, backend API implementation details, deployment config |

---

## 9. License

| Content | License | Summary |
|---------|---------|---------|
| **Code** | [MIT License](./LICENSE) | Use freely, keep the LICENSE file |
| **Data** | [CC BY 4.0](./DATASET-LICENSE) | Commercial use OK with attribution |
| **Classical texts** | Public Domain | Ancient texts, no copyright |
| **Ni Haixia quotes** | [CC BY-NC-SA 4.0](./docs/tianji-ziwei/LICENSE.md) | Non-commercial only |

---

## 10. About & Contact

### Philosophy

See the top of this page. Want to build your own? The code is all here. Prefer to just use it? Visit [metisziwei.com](https://metisziwei.com/?from=gh-readme-en).

### Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Variables design system
- **Charting**: [iztro](https://github.com/SylarLong/iztro) + lunar-javascript
- **Animation**: Framer Motion
- **Database**: SQLite (better-sqlite3)
- **Web3**: SIWE + ethers + viem
- **AI**: Anthropic Claude SDK / Volcengine Ark

### Contact

- Live platform: [metisziwei.com](https://metisziwei.com/?from=gh-readme-en)
- Issues & fixes: see [CONTRIBUTING.md](./CONTRIBUTING.md)
- Discussions: [GitHub Discussions](https://github.com/Renhuai123/ziwei-doushu/discussions)
