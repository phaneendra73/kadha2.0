-- Kadha 2.0 Seed Data for Cloudflare D1

INSERT INTO userprofiles (id, email, password, name, profileUrl, status)
VALUES (
  1,
  'phaneendra@kadha.io',
  'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', -- SHA-256 hash of 'password123'
  'Phaneendra Kumar',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  'ACTIVE'
);

INSERT INTO tags (id, name) VALUES
  (1, 'React'),
  (2, 'Cloudflare D1'),
  (3, 'Web Design'),
  (4, 'Architecture'),
  (5, 'Serverless');

-- Blog 1
INSERT INTO blogs (id, title, imageUrl, authorId, published) VALUES (
  1,
  'Why Cloudflare D1 is the Future of Edge Databases',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
  1,
  1
);

INSERT INTO blogmd (blogId, content) VALUES (
  1,
  '# Why Cloudflare D1 is the Future of Edge Databases

When building globally distributed web applications, latency to the database is often the bottleneck. **Cloudflare D1**, built on top of SQLite and running natively at the edge, changes the paradigm entirely.

## What Makes D1 Special?

1. **Zero Cold-Start Overhead**: SQLite files are exceptionally fast to query.
2. **Global Distribution**: Read replicas bring data directly to where your users are.
3. **Seamless Cloudflare Workers Integration**: Using `c.env.DB.prepare(sql)` gives you direct, type-safe SQL queries without ORM bloat.

```javascript
// Example D1 Query in Hono
const results = await c.env.DB.prepare(
  "SELECT * FROM blogs WHERE published = 1 ORDER BY createdAt DESC"
).all();
```

### Conclusion

Kadha 2.0 leverages Cloudflare D1 to deliver instant page loads and rock-solid reliability across all devices!'
);

INSERT INTO tagsonblogs (blogId, tagId) VALUES
  (1, 2),
  (1, 4),
  (1, 5);

-- Blog 2
INSERT INTO blogs (id, title, imageUrl, authorId, published) VALUES (
  2,
  'Mastering UI Micro-Interactions in React & Chakra UI',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200',
  1,
  1
);

INSERT INTO blogmd (blogId, content) VALUES (
  2,
  '# Mastering UI Micro-Interactions in React & Chakra UI

Great design is more than just static layout—it is about **feeling alive**. In Kadha 2.0, every button, card, and modal responds dynamically to user input.

## Key Principles for Engaging UI

* **Immediate Feedback**: Hover states should transition smoothly within `150ms` to `250ms`.
* **Glassmorphism**: Subtle background blurs (`backdrop-filter: blur(12px)`) create visual depth.
* **Harmonious Typography**: Pairing clean sans-serif headings with highly legible body fonts.

```jsx
<Box
  transition="all 0.3s ease"
  _hover={{ transform: "translateY(-6px)", shadow: "2xl" }}
>
  Interactive Card Component
</Box>
```

Start building experiences that wow your users at first glance!'
);

INSERT INTO tagsonblogs (blogId, tagId) VALUES
  (2, 1),
  (2, 3);

-- Blog 3
INSERT INTO blogs (id, title, imageUrl, authorId, published) VALUES (
  3,
  'Designing High-Performance Fullstack Architectures',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200',
  1,
  1
);

INSERT INTO blogmd (blogId, content) VALUES (
  3,
  '# Designing High-Performance Fullstack Architectures

In modern web development, keeping the frontend lightweight while executing complex queries at the edge ensures stellar Lighthouse scores.

## Architecture Breakdown

| Component | Technology | Benefit |
| :--- | :--- | :--- |
| Frontend | React 19 + Vite | Ultra-fast client-side routing & rich UI |
| Styling | Chakra UI + Vanilla CSS | Design token consistency & glassmorphic aesthetics |
| API Layer | Hono on Cloudflare Workers | Minimal memory footprint, <5ms execution |
| Database | Cloudflare D1 (SQLite) | Edge-native persistence with transactional consistency |

With Kadha 2.0, we combine these pillars into a truly state-of-the-art publishing platform.'
);

INSERT INTO tagsonblogs (blogId, tagId) VALUES
  (3, 1),
  (3, 2),
  (3, 4);
