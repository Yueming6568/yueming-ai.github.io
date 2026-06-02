# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static single-page website for Prof. Yueming Lyu at Nanjing University, School of Intelligence Science and Technology. Deployed via GitHub Pages at yueming-ai.top.

## Tech Stack

- Vanilla HTML/CSS/JavaScript (no build tools, no bundler, no npm)
- Bootstrap 4/5 + Bootstrap Icons
- jQuery 3.3.1
- Python 3.6+ for member data automation

## Key Commands

```bash
# Generate member data from markdown files
python generate_members_data.py

# Windows batch alternative
update_members.bat
```

There are no test, lint, or build commands. The site is plain static files served as-is via GitHub Pages.

## Architecture

**Single-page app**: `index.html` (~2200 lines) contains all sections, navigated via anchor links with a sticky header using ScrollSpy.

**Member management pipeline**:
1. Markdown files with YAML front matter live in `people/` (one per member)
2. `generate_members_data.py` parses them and generates `assets/js/members-data.js`
3. `assets/js/members.js` renders member cards into `#members-container` on page load
4. A git pre-commit hook (`.git/hooks/pre-commit`) auto-runs the Python script on commit

**Member categorization** (based on `title` field in YAML):
- "Ph.D." or "PhD" → `phd_students`
- "Master" → `master_students`
- "Intern" → `research_interns`
- "Visiting" → `visiting_scholars`

## Key Files

| File | Purpose |
|------|---------|
| `index.html` | Main single-page site with all sections |
| `assets/css/style.css` | Custom styles |
| `assets/js/members.js` | Client-side member card renderer |
| `assets/js/members-data.js` | **Auto-generated** — do not edit manually |
| `generate_members_data.py` | Markdown → JS data generator |
| `people/*.md` | Member data source files (YAML front matter) |
| `guidance/` | Internal design specs and restructuring guides |

## Important Conventions

- `assets/js/members-data.js` is auto-generated. Edit `people/*.md` files instead, then run `python generate_members_data.py`.
- Member photos go in `assets/img/people/`.
- Documentation files in `people/` (`README.md`, `HOW_TO_ADD_MEMBER.md`) are excluded from processing.
- Commit messages use the format `type:description` (e.g., `docs:renew index`, `feat: delete animation`).
- The site uses bilingual content (Chinese and English).

## Design Context

### Users
Academic audience: prospective PhD/Master students considering the lab, peer researchers and collaborators in computer vision and AI, conference attendees checking the PI's work, and industry partners. They visit to quickly assess research quality, find papers, and understand the lab's focus areas. The experience should feel effortless and modern — not like a typical academic site.

### Brand Personality
**活力 · 创新 · 年轻** (Vibrant · Innovative · Young)

The lab is led by a young, rising PI working on cutting-edge generative AI. The site should feel energetic and forward-looking, not stodgy or overly formal. It should communicate "this is where exciting research happens" while maintaining academic credibility.

### Aesthetic Direction

**Visual tone**: Clean, airy minimalist with a refined purple accent system inspired by Nanjing University's identity. Not monotone black-and-white — use purple tones to bring warmth, identity, and sophistication to key moments (like Claude.ai uses warm terracotta/coral touches). Generous whitespace, inspired by Claude.ai's breathing room and MMLab's information density balance.

**Color palette**:
- Primary: `#111827` (near-black for headings and emphasis)
- Accent: `#7C3AED` (NJU-inspired violet — for buttons, links, interactive highlights)
- Accent light: `#EDE9FE` (soft lavender — for badges, tag backgrounds, hover states)
- Accent dark: `#5B21B6` (deep purple — for hover emphasis, active states)
- Accent subtle: `#F5F3FF` (barely-there violet — for section alternating backgrounds, cards)
- Background: `#FFFFFF` (pure white) with `#F9FAFB` and `#F5F3FF` alternating sections
- Text body: `#374151` (deep gray for comfortable reading)
- Text secondary: `#6B7280` (medium gray for dates, captions)
- Borders: `#E5E7EB` (light gray, understated)

**Color usage philosophy**: The site is predominantly white/gray for breathing room, but purple appears as a consistent thread — in links, buttons, section accents, tag backgrounds, card top-borders, and the Hero/Footer. Think of it like Claude.ai: mostly clean white space, but the brand color surfaces at just the right moments to create identity and warmth.

**Theme**: Light mode only.

**References**:
- **Claude.ai**: Airy layout, generous padding, breathing room between elements, grand and calm feel
- **MMLab@NTU**: Information-dense but well-structured academic lab site, clear section hierarchy

**Anti-references**:
- Cramped, dense academic pages with tiny fonts and no whitespace
- Generic Bootstrap templates with default blue buttons
- The current red/crimson theme — this copy should feel completely distinct

### Design Principles

1. **Breathe**: Generous whitespace and padding everywhere. Sections should feel spacious, not stuffed. When in doubt, add more space.

2. **Purple as identity**: NJU purple is the soul of the site — it appears in links, buttons, badges, card accents, section highlights, and the Hero/Footer. Not overwhelming, but present enough to feel like a cohesive brand. White space is the canvas; purple is the brushstroke.

3. **Typography-first hierarchy**: Let font size, weight, and spacing create visual structure rather than borders, backgrounds, or decorations. Large bold headings, comfortable body text, clear visual levels.

4. **Content density with elegance**: Show meaningful information (papers, research areas, team) without clutter. Each element earns its space. Avoid filler; every pixel of content should be purposeful.

5. **Youthful confidence**: Subtle animations, modern rounded corners, smooth transitions. The site should feel alive and polished — like a product, not a document.
