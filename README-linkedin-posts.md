# LinkedIn Posts Integration

This guide explains how to add LinkedIn posts to the VisionWorks website.

## Quick Start

Edit `content.js` and add entries to the `POSTS` array. Two formats are supported:

### 1. Embedded Posts (Recommended)

Embedded posts auto-sync with LinkedIn - likes, comments, and content update automatically.

```javascript
{
    embed: "https://www.linkedin.com/embed/feed/update/urn:li:activity:XXXXX"
}
```

**How to get the embed URL:**

1. Open the LinkedIn post you want to embed
2. Click the `•••` menu in the top-right corner
3. Select **"Embed this post"**
4. Copy the URL from the `src` attribute in the iframe code
5. Paste it as the `embed` value

### 2. Text Cards

Text cards display custom bilingual content with a link to LinkedIn.

```javascript
{
    href: "https://www.linkedin.com/feed/update/urn:li:activity:XXXXX",
    en: "English description of the post",
    ar: "Arabic description of the post"
}
```

## Examples

```javascript
const POSTS = [
    // Embedded post - shows live LinkedIn content
    {
        embed: "https://www.linkedin.com/embed/feed/update/urn:li:activity:7437373275476992000"
    },

    // Text card - custom bilingual content
    {
        href: "https://www.linkedin.com/company/vision-works-ltd/",
        en: "Exciting news about our latest project!",
        ar: "أخبار مثيرة عن أحدث مشاريعنا!"
    },
];
```

## Tips

- Add newest posts at the **top** of the array
- Embedded posts are preferred as they stay in sync with LinkedIn
- Use text cards when you need custom translations or styling
- The embed URL format is always: `https://www.linkedin.com/embed/feed/update/urn:li:activity:XXXXX`
