# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Hugo static blog using the Ananke theme. Hugo is a fast static site generator written in Go.

## Key Commands

**Development server with live reload:**
```bash
hugo server
```

**Build production site (outputs to `public/`):**
```bash
hugo
```

**Create new blog post:**
```bash
hugo new posts/post-name.md
```

**Update theme submodule:**
```bash
git submodule update --remote themes/ananke
```

## Architecture

### Theme Management
- The Ananke theme is installed as a git submodule at `themes/ananke`
- Theme is specified in `hugo.toml` with `theme = 'ananke'`
- Custom layouts in `layouts/` will override theme templates with the same name

### Content Structure
- Blog posts live in `content/posts/` as Markdown files
- Posts use TOML front matter (delimited by `+++`)
- Key front matter fields: `title`, `date`, `draft`
- Set `draft = false` to publish a post

### Configuration
- `hugo.toml`: Main site configuration (baseURL, title, languageCode, theme)
- `archetypes/default.md`: Template for new content files

### Directory Purposes
- `content/`: Markdown content files
- `layouts/`: Custom HTML templates (overrides theme)
- `static/`: Static files copied directly to output (images, CSS, JS)
- `assets/`: Files to be processed by Hugo Pipes (SCSS, TypeScript)
- `data/`: Data files (JSON/YAML/TOML) accessible in templates
- `i18n/`: Translation files for internationalization
- `public/`: Generated static site (git ignored, do not edit)
- `resources/`: Hugo-generated cache (git ignored)

## Important Notes

- Never modify files in `public/` or `resources/` directories - they are auto-generated
- When updating the theme, use git submodule commands rather than direct file edits
- Content files must be in `content/` to be processed by Hugo
- The development server watches for changes and rebuilds automatically
