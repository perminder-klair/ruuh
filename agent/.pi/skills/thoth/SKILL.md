---
name: thoth
description: Create and optimize social media content for multiple platforms using the Thoth API. Use when the user wants to create social media posts, optimize content for Twitter/LinkedIn/Instagram, generate hashtags, create AI images for posts, schedule social media content, or work with brand-consistent content creation. Supports single-post creation, content review workflows, and brand style integration.
---

# Thoth Social Media Optimization Skill

## Quick Start

Thoth helps you create optimized social media content for multiple platforms (Twitter, LinkedIn, Instagram, etc.) in a single API call. It applies brand styles, generates hashtags, creates AI images, and adapts content to each platform's best practices.

**Primary use case:** Quick, ad-hoc single-post creation when ideas come up. Provide content and platforms, receive optimized variations ready to post.

## Setup

### Dependencies

The wrapper script requires the `requests` Python library:

```bash
pip install requests
```

### First-Time Configuration

Create a config file with your Thoth API key:

```bash
mkdir -p ~/.config/thoth
echo "THOTH_API_KEY=your_api_key_here" > ~/.config/thoth/config
```

**Note:** The wrapper script will automatically read from this config file. You only need to set this up once.

### Brand Style Setup (Recommended)

After setting up your API key, configure your brand style:

1. **Visit Thoth Web App:** https://www.usethoth.com/brand-styles
2. **Create Your Brand Style:**
   - Define brand colors (used for AI-generated images)
   - Set brand tone and voice (applied to written content)
   - Choose content mode (professional vs. casual)
3. **Set as Default:** Mark one style as default for automatic application
4. **Verify Configuration:**
   ```bash
   python .claude/skills/thoth/scripts/thoth.py get-brand-styles
   ```

**Why it matters:** Brand styles ensure all your social media content has consistent colors, tone, and personality across platforms. Without a configured brand style, posts will use generic defaults.

## Common Workflows

### 1. Create Single Post for Multiple Platforms

**Use case:** You have an idea and want to post it across Twitter, LinkedIn, and Instagram.

```bash
python .claude/skills/thoth/scripts/thoth.py create-post \
  "Just launched our new AI tool for content creators!" \
  --platforms twitter linkedin instagram \
  --hashtags \
  --image \
  --length medium
```

**What it does:**
- Creates platform-specific optimized versions of your content
- Generates relevant hashtags for each platform
- Creates AI-generated images matching your brand style
- Returns content ready to copy/paste or schedule

**Output example:**
```
Post ID: post_abc123

Original Content:
Just launched our new AI tool for content creators!

Platform-Specific Content:

  TWITTER:
    🚀 Just launched our new AI tool for content creators! Transform your workflow with intelligent automation...
    Hashtags: #AI #ContentCreation #Innovation

  LINKEDIN:
    Excited to announce the launch of our new AI-powered tool for content creators...
    Hashtags: #ArtificialIntelligence #ContentMarketing #TechInnovation

Status: draft
```

### 2. Create Post with Scheduling

**Use case:** Prepare content to be published at a specific time.

```bash
python .claude/skills/thoth/scripts/thoth.py create-post \
  "Exciting product update coming soon!" \
  --platforms twitter linkedin \
  --schedule "2024-02-15T10:00:00Z" \
  --hashtags
```

**Note:** The schedule time must be in ISO 8601 format (UTC timezone).

### 3. Review and Update Post Before Publishing

**Use case:** Create a draft, review it, then update before publishing.

```bash
# 1. Create draft
python .claude/skills/thoth/scripts/thoth.py create-post \
  "New feature announcement" \
  --platforms twitter

# 2. Review the post
python .claude/skills/thoth/scripts/thoth.py get-post post_abc123

# 3. Update if needed
python .claude/skills/thoth/scripts/thoth.py update-post post_abc123 \
  --status published
```

### 4. Work with Brand Styles

Brand styles are visual and tonal identity configurations in Thoth that ensure consistent branding across all generated posts.

#### What Brand Styles Control

- **Colors** — Primary, secondary, and accent colors for AI-generated images
- **Tone** — Voice, style, and personality for written content
- **Content Mode** — How content is generated (brand-focused vs. casual)
- **Platform Optimization** — Brand guidelines influence how content is adapted for each platform

#### Understanding Brand Style Properties

When you fetch a brand style, the API returns:

- **id** — Unique identifier for the brand style
- **name** — Display name (e.g., "Default Style", "Professional Brand")
- **contentMode** — How content is generated:
  - `brand` — Brand-focused, professional tone
  - `casual` — More relaxed, conversational tone
- **isDefault** — Whether this is your default style (auto-applied to new posts)
- **colors** — Color palette for AI image generation:
  - `primary1`, `primary2` — Main brand colors
  - Additional color keys as configured
- **tone** — Writing style settings:
  - `voice` — Overall personality (e.g., "Professional and friendly")
  - `style` — Writing approach (e.g., "Informative", "Conversational")
  - Additional tone properties as configured
- **createdAt** — When the brand style was created

#### Check Your Brand Styles

```bash
# List all brand styles
python .claude/skills/thoth/scripts/thoth.py get-brand-styles

# Get details of a specific style
python .claude/skills/thoth/scripts/thoth.py get-brand-style style_abc123
```

#### Configure Your Brand Style (One-Time Setup)

Before creating posts, configure your brand style in the Thoth web app:

1. **Access Thoth:** Go to https://www.usethoth.com/brand-styles
2. **Create/Edit Style:**
   - Choose colors that represent your brand
   - Define your brand voice and tone
   - Set content mode (brand/casual)
3. **Set Default:** Mark one style as default for automatic application
4. **Verify via API:**
   ```bash
   python scripts/thoth.py get-brand-styles
   ```

Once configured, all posts created via the API will automatically use your default brand style for:
- AI image colors and themes
- Content tone and personality
- Hashtag style and voice
- Platform-specific optimization

### 5. List and Filter Posts

**Use case:** Review previously created posts.

```bash
# List all posts (paginated)
python .claude/skills/thoth/scripts/thoth.py list-posts

# List only drafts
python .claude/skills/thoth/scripts/thoth.py list-posts --status draft

# List with custom pagination
python .claude/skills/thoth/scripts/thoth.py list-posts --page 2 --limit 20
```

## Wrapper Script Reference

### Commands

#### `create-post`

Create optimized post for multiple platforms.

```bash
python scripts/thoth.py create-post CONTENT --platforms PLATFORM [PLATFORM ...]
  [--schedule DATETIME] [--image] [--hashtags] [--length {short,medium,long}] [--post-now]
```

**Required:**
- `CONTENT` — Post content (quote if contains spaces)
- `--platforms` — One or more platforms: `twitter linkedin instagram`

**Optional:**
- `--schedule DATETIME` — ISO 8601 datetime to schedule post (e.g., "2024-02-15T10:00:00Z")
- `--image` — Generate AI images for the post
- `--hashtags` — Generate relevant hashtags
- `--length` — Content length: `short`, `medium`, or `long` (default: `medium`)
- `--post-now` — Immediately post to connected social accounts (requires social account connection in Thoth)

**Example:**
```bash
python scripts/thoth.py create-post "Product launch announcement" \
  --platforms twitter linkedin \
  --image --hashtags --length long
```

#### `get-post`

Retrieve details of a specific post.

```bash
python scripts/thoth.py get-post POST_ID
```

**Example:**
```bash
python scripts/thoth.py get-post post_abc123
```

#### `list-posts`

List all posts with optional filtering and pagination.

```bash
python scripts/thoth.py list-posts [--page N] [--limit N] [--status STATUS]
```

**Optional:**
- `--page N` — Page number (default: 1)
- `--limit N` — Posts per page (default: 10)
- `--status STATUS` — Filter by status: `draft` or `published`

**Example:**
```bash
python scripts/thoth.py list-posts --status draft --limit 20
```

#### `update-post`

Update an existing post.

```bash
python scripts/thoth.py update-post POST_ID [--title TITLE] [--content CONTENT] [--status STATUS]
```

**Optional:**
- `--title TITLE` — Updated title
- `--content CONTENT` — Updated original content
- `--status STATUS` — Updated status (`draft` or `published`)

**Example:**
```bash
python scripts/thoth.py update-post post_abc123 --status published
```

#### `get-brand-styles`

Fetch all brand styles configured in your account.

```bash
python scripts/thoth.py get-brand-styles
```

#### `get-brand-style`

Get detailed information about a specific brand style.

```bash
python scripts/thoth.py get-brand-style STYLE_ID
```

**Example:**
```bash
python scripts/thoth.py get-brand-style style_abc123
```

### Global Options

All commands support:

- `--api-key KEY` — Override API key from config file for one-off usage
- `--json` — Output raw JSON instead of human-readable format (useful for scripting)

**Example:**
```bash
python scripts/thoth.py create-post "Test post" --platforms twitter --json
```

## Tips and Best Practices

1. **Start with drafts:** Don't use `--post-now` until you've reviewed the generated content. The default behavior creates drafts.

2. **Configure brand styles first:** Before creating posts, set up your brand style in the Thoth web app. This ensures:
   - AI-generated images match your brand colors
   - Content tone reflects your brand voice
   - Hashtags align with your brand personality
   - Consistent look and feel across all platforms

   Fetch your configured style to verify:
   ```bash
   python scripts/thoth.py get-brand-style style_abc123
   ```

3. **Platform selection:** Choose platforms based on your audience. LinkedIn for professional content, Twitter for quick updates, Instagram for visual content.

4. **Length parameter:** Use `short` for Twitter-focused content, `medium` for general use, `long` for detailed LinkedIn posts.

5. **Hashtags:** The `--hashtags` flag generates platform-appropriate hashtags. On Twitter, you'll get more hashtags; on LinkedIn, fewer and more professional.

6. **Images:** The `--image` flag generates AI images based on your content and brand style. Great for Instagram and LinkedIn.

7. **Scheduling:** Schedule posts for optimal engagement times (e.g., weekday mornings for LinkedIn, evenings for Twitter).

## Error Handling

The wrapper script provides clear error messages:

- **Missing API key:** If config file doesn't exist, you'll see instructions to create it.
- **Invalid platforms:** Must use valid platform names: `twitter`, `linkedin`, `instagram`.
- **HTTP errors:** API errors include status codes and response messages.
- **Network errors:** Connection failures show clear error descriptions.

## Complete API Documentation

For full API endpoint specifications, request/response schemas, and advanced parameters, see:

**[references/api.md](references/api.md)**

The reference documentation includes:
- Detailed parameter tables for all endpoints
- Complete request/response examples
- Authentication details
- Error response formats
- Advanced usage patterns

## Integration Examples

### With Vikunja Task Management

Create a post when completing a task:

```bash
# After marking task done in Vikunja, create announcement
python scripts/thoth.py create-post \
  "Completed Q1 feature roadmap! 🎉" \
  --platforms twitter linkedin \
  --hashtags
```

### With Telegram Bot

Trigger post creation from Telegram command:

```bash
# In Telegram bot handler
python scripts/thoth.py create-post "$MESSAGE_TEXT" \
  --platforms twitter \
  --json > /tmp/post_result.json
```

### Batch Content Creation

Create multiple posts from a list:

```bash
# Create posts for each announcement
for content in "${announcements[@]}"; do
  python scripts/thoth.py create-post "$content" \
    --platforms twitter linkedin \
    --hashtags --image
done
```

## Troubleshooting

### "API key not found"

**Solution:** Create config file at `~/.config/thoth/config` with:
```
THOTH_API_KEY=your_api_key_here
```

### "HTTP Error 401"

**Solution:** Check that your API key is correct and hasn't expired.

### "HTTP Error 429"

**Solution:** You've hit rate limits. Wait a few minutes before retrying.

### Import errors (requests module)

**Solution:** Install required Python packages:
```bash
pip install requests
```

## Related Skills

- **vikunja** — Create tasks for post follow-ups (engagement monitoring, response management)
- **telegram-bot** — Integrate post creation into Telegram workflows
- **gmail** — Email post summaries or content approvals
- **brand-guidelines** — While Thoth has built-in brand styles, use this for non-social content

## Notes

- **Brand styles are managed in Thoth web app** — The API uses these styles automatically but doesn't create or modify them.
- **Social account connection** — The `--post-now` flag only works if you've connected social accounts in Thoth.
- **Image generation** — AI images are stored in Thoth and returned as URLs in the response.
- **Default behavior** — Posts are created as drafts unless `--post-now` is used or status is updated to `published`.
