# Ruuh Web

Landing page and docs site for [Ruuh](https://github.com/perminder-klair/ruuh), an Android AI coding agent that runs in Termux.

## Tech Stack

- **Next.js 16** (App Router) + **React 19**
- **Tailwind CSS v4**
- **Motion** (animations)
- **Lucide** (icons)
- **shadcn/ui** (components)

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

| Route | Description |
|---|---|
| `/` | Landing page |
| `/docs` | Setup guide |
| `/sheet` | Command cheatsheet |
| `/ruuh-openclaw-android` | Ruuh vs OpenClaw comparison |

## Project Structure

```
app/
  page.tsx              # Landing page
  layout.tsx            # Root layout
  globals.css           # Global styles
  docs/                 # Setup guide
  sheet/                # Cheatsheet
  ruuh-openclaw-android/# Comparison page
components/
  header.tsx            # Site header
  footer.tsx            # Site footer
  motion.tsx            # Animation wrappers
  copy-button.tsx       # Clipboard copy button
  video-modal.tsx       # Video lightbox
  terminal-demo/        # Terminal animation component
lib/
  utils.ts              # Shared utilities
  terminal-script.ts    # Terminal demo script data
```
