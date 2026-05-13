# 🧠 OKH — Ofem's Knowledge HuB

> *"A digital brain — where curiosity meets structure."*

**OKH** is a multi-source knowledge engine that fuses AI intelligence with live data from Wikipedia, news, books, videos, dictionary, and facts — delivering structured, cited answers in a fast, accessible, and beautifully designed interface.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [API Integrations](#api-integrations)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Usage Guide](#usage-guide)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Accessibility](#accessibility)
- [File Structure](#file-structure)
- [Customization](#customization)
- [Roadmap](#roadmap)
- [Credits & License](#credits--license)

---

## Overview

OKH is a single-file, zero-dependency web application. Open it in any modern browser and it instantly becomes your personal research assistant — pulling from **7 public APIs simultaneously**, organizing results into filterable cards, and presenting an AI-generated quick answer at the top of every search.

Think of it as a librarian, a teacher, and a researcher working together in harmony.

---

## Live Demo

Since OKH is a self-contained HTML file, there's nothing to install or deploy for basic use.

1. Download `OKH-Ofems-Knowledge-HuB.html`
2. Open it in any modern browser (Chrome, Firefox, Edge, Safari)
3. Start searching

> **Note:** The AI Oracle feature uses the Anthropic Claude API and requires a valid API key to be configured (see [Getting Started](#getting-started)).

---

## Features

### 🔍 Core Search
- Central search bar accepting natural language queries
- Parallel fetching from 7 data sources simultaneously
- Results auto-categorized into tabs: All, AI, Wiki, News, Books, Video, Dictionary, Facts

### 🔮 AI Quick Answer
- Instant AI-generated summary at the top of every search
- Context-aware — remembers up to 4 previous queries for follow-up continuity
- Auto-generates 4 intelligent follow-up question suggestions

### 💬 Follow-Up Questions
- Click any suggested follow-up chip to search instantly
- Or type a custom follow-up in the contextual input box
- AI maintains conversation context across follow-ups

### ⌨️ Autocomplete & Suggestions
- Real-time Wikipedia-powered autocomplete as you type
- Search history suggestions shown inline
- Arrow key navigation through suggestions

### 🎤 Voice Search
- One-click voice input via Web Speech API
- Visual feedback (pulsing mic) while listening
- Automatically triggers search on speech end

### 🗂️ Source Toggles
- Toggle individual data sources on/off before searching
- Sources: AI Oracle · Wikipedia · News · Books · Videos · Dictionary · Facts
- Visual indicators show which sources are active

### 🃏 Card System
- Each result rendered as a rich, source-coded card
- Thumbnail images where available (news, books, videos)
- Expandable "Read more" sections for deeper content
- Direct links to source pages

### 🔖 Bookmarks
- Save any result card with one click
- Persistent across sessions (localStorage)
- Dedicated slide-in bookmarks panel
- Click any bookmark to re-run that search

### 🕘 Search History
- Full searchable history stored locally
- Bottom drawer UI — easy to open and scan
- Delete individual entries or click to re-search

### 🌙 Dark / Light Mode
- Toggle between dark and light themes
- Preference persisted across sessions
- Smooth animated transition

### 📱 Responsive Design
- Fully optimized for mobile, tablet, and desktop
- Fluid grid layout adapts from 1 to 3 columns
- Touch-friendly interaction targets

### ♻️ Skeleton Loaders
- Animated skeleton cards shown while APIs respond
- Rotating loader messages keep the user informed of progress
- Results fade in with staggered animation once ready

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript (ES2022) |
| Fonts | Lora (serif display), Sora (UI sans-serif), JetBrains Mono (code) |
| AI | Anthropic Claude API (`claude-sonnet-4-20250514`) |
| Storage | Browser `localStorage` |
| Voice | Web Speech API (native browser) |
| Build | None — zero build step, zero dependencies |

---

## API Integrations

| Source | API | What it provides | Auth required |
|---|---|---|---|
| 🤖 AI Oracle | Anthropic Claude | Smart summaries, follow-up suggestions, context | ✅ API key |
| 📖 Wikipedia | Wikipedia REST API | Encyclopedia summaries, thumbnails | ❌ Free |
| 📰 News | GNews API | Current events, headlines | ⚠️ Free tier key |
| 📚 Books | Open Library API | Book search, cover art, author info | ❌ Free |
| ▶ Videos | YouTube RSS Feed | Video results, thumbnails | ❌ Free (RSS) |
| 🔤 Dictionary | Free Dictionary API | Definitions, phonetics, audio, examples | ❌ Free |
| 🔢 Facts | Numbers API | Historical year facts, numerical trivia | ❌ Free |

> All APIs used are publicly available and return only non-classified, freely accessible information.

---

## Architecture

OKH uses a clean **3-module separation of concerns** pattern, all within a single HTML file:

```
OKH Application
├── State Manager        — Single source of truth for app state
│   ├── query            Current search term
│   ├── cards            All fetched result cards
│   ├── bookmarks        Saved cards (persisted)
│   ├── history          Search history (persisted)
│   ├── sources          Active source toggles
│   ├── context          AI conversation history (last 4 turns)
│   └── theme            Dark/light preference (persisted)
│
├── API Handler          — All external data fetching
│   ├── fetchAI()        Claude summary + follow-up generation
│   ├── fetchWiki()      Wikipedia summary
│   ├── fetchNews()      GNews articles
│   ├── fetchBooks()     Open Library search
│   ├── fetchVideos()    YouTube RSS
│   ├── fetchDictionary() Free Dictionary entry
│   ├── fetchFacts()     Numbers API trivia
│   └── fetchSuggestions() Wikipedia autocomplete
│
├── UI Renderer          — All DOM operations
│   ├── renderCards()    Build and inject result cards
│   ├── renderTabs()     Source filter tab bar
│   ├── renderQuickAnswer() AI oracle panel
│   ├── renderBookmarks() Bookmarks panel
│   ├── renderHistory()  History drawer
│   ├── renderTrending() Trending topic pills
│   ├── setLoading()     Loader strip visibility
│   ├── setStatus()      Status bar update
│   └── createSkeletons() Skeleton loader cards
│
└── App Controller       — Search orchestration
    ├── search()         Run full search flow
    └── showHero()       Return to home screen
```

### Data Flow

```
User types query
       ↓
App.search(query)
       ↓
State updated → History saved → Hero hidden → Results page shown
       ↓
UIRenderer creates skeleton cards
       ↓
APIHandler fires all enabled sources in parallel (Promise.allSettled)
       ↓
Results collected → skeletons cleared → cards rendered with stagger
       ↓
AI card → QuickAnswer panel + Follow-up chips
Other cards → Tabbed grid with bookmark/expand controls
```

---

## Getting Started

### Option A — Run Instantly (No AI)

1. Download `OKH-Ofems-Knowledge-HuB.html`
2. Open in any modern browser
3. All sources except AI Oracle work immediately with no setup

### Option B — Full Setup with AI Oracle

The Anthropic API key is injected automatically in the Claude.ai environment. If running OKH outside of Claude.ai, you'll need to add your key:

1. Open the HTML file in a text editor
2. Find the `fetchAI` function in the `APIHandler` module
3. Add your key to the request headers:

```javascript
headers: {
  'Content-Type': 'application/json',
  'x-api-key': 'YOUR_ANTHROPIC_API_KEY_HERE',
  'anthropic-version': '2023-06-01'
}
```

4. Save and open in browser

> ⚠️ **Security note:** Never expose API keys in client-side code in production. For production deployment, proxy API calls through a backend server that securely holds your keys.

### Option C — Local Development with a Backend Proxy

For production-grade deployments, it's recommended to proxy API calls:

```bash
# Example Node.js/Express proxy setup
npm init -y
npm install express cors node-fetch

# Create server.js (see Customization section)
node server.js
```

---

## Usage Guide

### Basic Search
Type any query in the search bar and press **Enter** or click **Explore**. OKH will simultaneously query all active sources and display results.

### Filtering Results
After a search, use the **tab buttons** below the Quick Answer to filter results:
- **All** — show every result
- **📖 Wiki** — Wikipedia articles only
- **📰 News** — news articles only
- **📚 Books** — book results only
- **▶ Video** — YouTube videos only
- etc.

### Follow-Up Questions
After any search, scroll down to the **Ask a follow-up** section. Either:
- Click one of the AI-suggested chips, or
- Type a custom follow-up in the input box

The AI remembers the last 4 queries for context.

### Bookmarking
Click the **🔖 icon** on any result card to save it. Access your saved items anytime via the **Saved** button in the header.

### Voice Search
Click the **🎤 microphone** button and speak your query. OKH will transcribe and search automatically.

### Toggling Sources
Before searching, use the **source toggle chips** below the search bar to enable or disable specific data sources.

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + K` / `Cmd + K` | Focus the search bar |
| `Enter` | Submit search |
| `↑` / `↓` | Navigate autocomplete suggestions |
| `Escape` | Close autocomplete dropdown |

---

## Accessibility

OKH is built with accessibility as a core requirement:

- **ARIA labels** on all interactive elements
- **`aria-live="polite"`** region on results for screen reader announcements
- **`aria-pressed`** states on toggle buttons
- **`aria-expanded`** states on expandable card sections
- **`aria-selected`** states on tab buttons
- **`role="listbox"`** and `role="option"` on autocomplete
- **`role="tablist"`** and `role="tab"`  on result filters
- **Keyboard navigable** — full tab order, arrow key navigation in autocomplete
- **Screen reader announcer** — invisible `aria-live` element announces key events (search started, results found, bookmarked)
- **Color contrast** — text colors maintain WCAG AA contrast in both dark and light modes
- **Touch targets** — all interactive elements meet minimum 44×44px touch target size

---

## File Structure

OKH is intentionally a **single file** for maximum portability. Everything is self-contained:

```
OKH-Ofems-Knowledge-HuB.html
├── <head>
│   ├── Meta tags & SEO
│   └── Google Fonts (Lora, Sora, JetBrains Mono)
│
├── <style>
│   ├── Design Tokens (CSS custom properties)
│   ├── Dark / Light theme variables
│   ├── Base reset & scrollbar
│   ├── Header styles
│   ├── Hero section styles
│   ├── Search bar & autocomplete
│   ├── Source toggle chips
│   ├── Quick topic pills & trending
│   ├── Results page layout
│   ├── Quick Answer panel
│   ├── Tab bar
│   ├── Result cards
│   ├── Skeleton loaders
│   ├── Follow-up section
│   ├── Bookmarks panel
│   ├── History drawer
│   ├── Empty/error states
│   ├── Footer
│   └── Responsive breakpoints
│
├── <body>
│   ├── Header (logo, mini search, actions)
│   ├── Hero section (search, toggles, pills, trending)
│   ├── Results page (quick answer, tabs, grid, follow-up)
│   ├── Footer
│   ├── Bookmarks panel (slide-in)
│   └── History drawer (slide-up)
│
└── <script>
    ├── State Manager module
    ├── API Handler module
    ├── UI Renderer module
    ├── App Controller module
    ├── Autocomplete module
    ├── Voice search setup
    ├── Theme setup
    ├── Source toggles setup
    ├── Panels setup (bookmarks, history)
    ├── Follow-up setup
    ├── Search triggers setup
    ├── Keyboard shortcuts
    └── DOMContentLoaded init
```

---

## Customization

### Adding a New API Source

1. Add a fetch function to `APIHandler`:

```javascript
async function fetchMySource(query) {
  const res = await fetch(`https://api.example.com/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) return null;
  const data = await res.json();
  return {
    id: 'mysource-' + Date.now(),
    type: 'mysource',
    source: 'My Source',
    srcClass: 'src-mysource',   // add CSS class below
    icon: '🌐',
    title: data.title,
    body: data.summary,
    link: data.url,
    colors: ['#hexcolor1', '#hexcolor2']
  };
}
```

2. Add a CSS class for the source badge:

```css
.src-mysource { background: rgba(0,255,128,.12); color: #00ff80; }
```

3. Add a toggle button in the HTML sources row:

```html
<button class="src-toggle on" data-src="mysource" aria-pressed="true">
  <span class="src-indicator"></span>🌐 My Source
</button>
```

4. Add to `State.get('sources')` default and call in `App.search()`.

### Changing the Color Palette

All colors are defined as CSS custom properties in `:root` and `[data-theme]` blocks at the top of the `<style>` tag. Change `--blue-core`, `--purple`, `--teal`, etc. to retheme the entire app.

### Adding a Backend Proxy (Node.js example)

```javascript
// server.js
const express = require('express');
const app = express();
app.use(require('cors')());
app.use(express.json());

app.post('/api/claude', async (req, res) => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify(req.body)
  });
  const data = await response.json();
  res.json(data);
});

app.listen(3000);
```

---

## Roadmap

Potential enhancements for future versions:

- [ ] **User accounts** via Firebase Authentication
- [ ] **Personalized recommendations** based on search history
- [ ] **Multi-language support** (i18n)
- [ ] **Export results** as PDF or markdown
- [ ] **Collections** — organize bookmarks into named folders
- [ ] **Google Scholar / PubMed** integration for academic research
- [ ] **Image search** results tab
- [ ] **Share results** via URL (query string encoding)
- [ ] **Offline mode** with service worker caching
- [ ] **Browser extension** version

---

## Credits & License

**Built by:** Ofem's  
**Version:** 1.0.0  
**Copyright:** © 2025 Ofem's. All rights reserved.

### Data Sources & Credits

| Source | License |
|---|---|
| Wikipedia | Creative Commons Attribution-ShareAlike 4.0 |
| Open Library | Open Data Commons Open Database License |
| Free Dictionary API | MIT / Open Source |
| Numbers API | Free for public use |
| YouTube | YouTube Terms of Service |
| GNews | GNews Terms of Service |
| Anthropic Claude | Anthropic Terms of Service |

All data displayed by OKH is sourced from publicly available APIs. OKH does not store, redistribute, or claim ownership of any third-party content. All sources are clearly cited on every result card.

---

*OKH — Ofem's Knowledge HuB. Built with curiosity. Powered by knowledge.*
