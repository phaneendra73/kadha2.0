import { Hono } from 'hono';
import { authenticateUser } from './middleware.js';

export const blogRoutes = new Hono();

// Helper to fetch tags for a list of blog IDs
async function getTagsForBlogs(db, blogIds) {
  if (!blogIds || blogIds.length === 0) return {};
  const placeholders = blogIds.map(() => '?').join(',');
  const query = `
    SELECT tb.blogId, t.name
    FROM tagsonblogs tb
    JOIN tags t ON tb.tagId = t.id
    WHERE tb.blogId IN (${placeholders})
  `;
  const result = await db.prepare(query).bind(...blogIds).all();
  const tagMap = {};
  blogIds.forEach((id) => (tagMap[id] = []));
  (result.results || []).forEach((row) => {
    if (tagMap[row.blogId]) {
      tagMap[row.blogId].push(row.name);
    }
  });
  return tagMap;
}

// 1. Get All Published Blogs
blogRoutes.get('/getall', async (c) => {
  try {
    const page = parseInt(c.req.query('page')) || 1;
    const limit = parseInt(c.req.query('limit')) || 10;
    const query = c.req.query('query') || '';
    const tagsParam = c.req.query('tags') ? c.req.query('tags').split(',').filter(Boolean) : [];
    const skip = (page - 1) * limit;

    let whereClauses = ['published = 1'];
    let bindArgs = [];

    if (query) {
      whereClauses.push('title LIKE ?');
      bindArgs.push(`%${query}%`);
    }

    if (tagsParam.length > 0) {
      const tagPlaceholders = tagsParam.map(() => '?').join(',');
      whereClauses.push(`
        id IN (
          SELECT tb.blogId FROM tagsonblogs tb
          JOIN tags t ON tb.tagId = t.id
          WHERE t.name IN (${tagPlaceholders})
        )
      `);
      bindArgs.push(...tagsParam);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Count total blogs matching filters
    const countSql = `SELECT COUNT(*) as total FROM blogs ${whereSql}`;
    const countRow = await c.env.DB.prepare(countSql).bind(...bindArgs).first();
    const totalCount = countRow ? countRow.total : 0;

    // Fetch paginated blogs
    const selectSql = `
      SELECT id, title, imageUrl, createdAt, updatedAt, authorId, published
      FROM blogs
      ${whereSql}
      ORDER BY createdAt DESC
      LIMIT ? OFFSET ?
    `;
    const blogsRow = await c.env.DB.prepare(selectSql)
      .bind(...bindArgs, limit, skip)
      .all();
    const blogs = blogsRow.results || [];

    const blogIds = blogs.map((b) => b.id);
    const tagMap = await getTagsForBlogs(c.env.DB, blogIds);

    const mappedBlogs = blogs.map((blog) => ({
      ...blog,
      published: Boolean(blog.published),
      tags: tagMap[blog.id] || [],
    }));

    return c.json({
      blogs: mappedBlogs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit) || 1,
        totalCount,
      },
    });
  } catch (error) {
    console.error('Error in /blog/getall:', error);
    return c.json({ error: 'Failed to fetch blogs', details: error.message }, 500);
  }
});

// 2. Add a New Blog
blogRoutes.post('/add', authenticateUser, async (c) => {
  try {
    const body = await c.req.json();
    const { title, imageUrl, tagIds = [], content } = body;
    const authorId = c.get('UserId');

    if (!title || !content) {
      return c.json({ error: 'Title and content are required.' }, 400);
    }

    // Insert blog
    const blogRes = await c.env.DB.prepare(
      'INSERT INTO blogs (title, imageUrl, authorId, published) VALUES (?, ?, ?, 1)'
    )
      .bind(title, imageUrl || '', parseInt(authorId))
      .run();

    const blogId = blogRes.meta.last_row_id;

    // Insert blog content
    await c.env.DB.prepare(
      'INSERT INTO blogmd (blogId, content) VALUES (?, ?)'
    )
      .bind(blogId, content)
      .run();

    // Insert tag associations in batch
    if (Array.isArray(tagIds) && tagIds.length > 0) {
      const batchStmts = tagIds.map((tagId) =>
        c.env.DB.prepare('INSERT OR IGNORE INTO tagsonblogs (blogId, tagId) VALUES (?, ?)').bind(
          blogId,
          parseInt(tagId)
        )
      );
      await c.env.DB.batch(batchStmts);
    }

    const newBlog = await c.env.DB.prepare('SELECT * FROM blogs WHERE id = ?').bind(blogId).first();
    const newContent = await c.env.DB.prepare('SELECT * FROM blogmd WHERE blogId = ?').bind(blogId).first();

    return c.json(
      {
        message: 'Blog created successfully',
        blog: { ...newBlog, published: Boolean(newBlog.published) },
        blogContent: newContent,
      },
      201
    );
  } catch (error) {
    console.error('Error adding blog:', error);
    return c.json({ error: 'Failed to create blog', details: error.message }, 500);
  }
});

// 3. Edit Blog
blogRoutes.put('/edit/:id', authenticateUser, async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const body = await c.req.json();
    const { title, imageUrl, tagIds = [], content } = body;
    const authorId = c.get('UserId');

    const blog = await c.env.DB.prepare('SELECT * FROM blogs WHERE id = ?').bind(id).first();
    if (!blog) {
      return c.json({ error: 'Blog not found' }, 404);
    }
    if (blog.authorId !== parseInt(authorId)) {
      return c.json({ error: 'Unauthorized: You can only edit your own blogs' }, 403);
    }

    await c.env.DB.prepare(
      'UPDATE blogs SET title = ?, imageUrl = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?'
    )
      .bind(title, imageUrl || '', id)
      .run();

    await c.env.DB.prepare(
      'UPDATE blogmd SET content = ?, updatedAt = CURRENT_TIMESTAMP WHERE blogId = ?'
    )
      .bind(content, id)
      .run();

    // Reset tag associations
    await c.env.DB.prepare('DELETE FROM tagsonblogs WHERE blogId = ?').bind(id).run();

    if (Array.isArray(tagIds) && tagIds.length > 0) {
      const batchStmts = tagIds.map((tagId) =>
        c.env.DB.prepare('INSERT OR IGNORE INTO tagsonblogs (blogId, tagId) VALUES (?, ?)').bind(
          id,
          parseInt(tagId)
        )
      );
      await c.env.DB.batch(batchStmts);
    }

    return c.json({ message: 'Blog updated successfully' }, 200);
  } catch (error) {
    console.error('Error editing blog:', error);
    return c.json({ error: 'Failed to update blog', details: error.message }, 500);
  }
});

// 4. Delete / Toggle Publish Blog
blogRoutes.delete('/delete/:id', authenticateUser, async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const authorId = c.get('UserId');

    const blog = await c.env.DB.prepare('SELECT * FROM blogs WHERE id = ?').bind(id).first();
    if (!blog) {
      return c.json({ error: 'Blog not found' }, 404);
    }
    if (blog.authorId !== parseInt(authorId)) {
      return c.json({ error: 'Unauthorized: You can only modify your own blogs' }, 403);
    }

    const newPublished = blog.published ? 0 : 1;
    await c.env.DB.prepare('UPDATE blogs SET published = ? WHERE id = ?')
      .bind(newPublished, id)
      .run();

    const action = newPublished ? 'published' : 'unpublished';
    return c.json({ message: `Blog ${action} successfully` }, 200);
  } catch (error) {
    console.error('Error toggling blog status:', error);
    return c.json({ error: 'Failed to update blog publication status' }, 500);
  }
});

// 5. Get Single Blog for Reading
blogRoutes.get('/get/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    if (!id || isNaN(id)) {
      return c.json({ error: 'Invalid blog ID' }, 400);
    }

    const blog = await c.env.DB.prepare('SELECT * FROM blogs WHERE id = ?').bind(id).first();
    if (!blog) {
      return c.json({ error: 'Blog not found' }, 404);
    }

    const mdRow = await c.env.DB.prepare('SELECT content FROM blogmd WHERE blogId = ?').bind(id).first();
    const tagMap = await getTagsForBlogs(c.env.DB, [id]);

    return c.json({
      ...blog,
      published: Boolean(blog.published),
      tags: tagMap[id] || [],
      markdownContent: mdRow ? mdRow.content : '',
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return c.json({ error: 'Failed to fetch blog data' }, 500);
  }
});

// 6. Get All Tags
blogRoutes.get('/tags', async (c) => {
  try {
    const result = await c.env.DB.prepare('SELECT * FROM tags ORDER BY name ASC').all();
    return c.json({ tags: result.results || [] }, 200);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return c.json({ error: 'Failed to fetch tags' }, 500);
  }
});

// 7. Create Tags
blogRoutes.post('/tags/create', authenticateUser, async (c) => {
  try {
    const body = await c.req.json();
    const { tags } = body;

    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return c.json({ error: 'Please provide an array of tag names' }, 400);
    }

    const results = [];
    for (const rawName of tags) {
      const tagName = rawName.trim();
      if (!tagName) continue;

      const existing = await c.env.DB.prepare('SELECT * FROM tags WHERE name = ?').bind(tagName).first();
      if (existing) {
        results.push({ id: existing.id, name: existing.name, created: false });
      } else {
        const insertRes = await c.env.DB.prepare('INSERT INTO tags (name) VALUES (?)').bind(tagName).run();
        results.push({ id: insertRes.meta.last_row_id, name: tagName, created: true });
      }
    }

    const newTagsCount = results.filter((t) => t.created).length;
    return c.json(
      {
        message: `Tags processed successfully. Created ${newTagsCount} new tags.`,
        tags: results,
      },
      201
    );
  } catch (error) {
    console.error('Error creating tags:', error);
    return c.json({ error: 'Failed to create tags', details: error.message }, 500);
  }
});

// 8. Delete Tag
blogRoutes.delete('/tags/:id', authenticateUser, async (c) => {
  try {
    const tagId = parseInt(c.req.param('id'));
    if (!tagId) {
      return c.json({ error: 'Tag ID is required' }, 400);
    }

    const existingTag = await c.env.DB.prepare('SELECT * FROM tags WHERE id = ?').bind(tagId).first();
    if (!existingTag) {
      return c.json({ error: 'Tag not found' }, 404);
    }

    const assocCount = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM tagsonblogs WHERE tagId = ?'
    )
      .bind(tagId)
      .first();

    if (assocCount && assocCount.count > 0) {
      return c.json({ error: 'Cannot delete tag because it is associated with one or more blogs' }, 400);
    }

    await c.env.DB.prepare('DELETE FROM tags WHERE id = ?').bind(tagId).run();
    return c.json({ message: 'Tag deleted successfully', tag: existingTag }, 200);
  } catch (error) {
    console.error('Error deleting tag:', error);
    return c.json({ error: 'Failed to delete tag', details: error.message }, 500);
  }
});

// 9. Get All Blogs for Admin (Both Published & Unpublished)
blogRoutes.get('/getallForadmin', authenticateUser, async (c) => {
  try {
    const page = parseInt(c.req.query('page')) || 1;
    const limit = parseInt(c.req.query('limit')) || 10;
    const query = c.req.query('query') || '';
    const tagsParam = c.req.query('tags') ? c.req.query('tags').split(',').filter(Boolean) : [];
    const skip = (page - 1) * limit;

    let whereClauses = [];
    let bindArgs = [];

    if (query) {
      whereClauses.push('title LIKE ?');
      bindArgs.push(`%${query}%`);
    }

    if (tagsParam.length > 0) {
      const tagPlaceholders = tagsParam.map(() => '?').join(',');
      whereClauses.push(`
        id IN (
          SELECT tb.blogId FROM tagsonblogs tb
          JOIN tags t ON tb.tagId = t.id
          WHERE t.name IN (${tagPlaceholders})
        )
      `);
      bindArgs.push(...tagsParam);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const countSql = `SELECT COUNT(*) as total FROM blogs ${whereSql}`;
    const countRow = await c.env.DB.prepare(countSql).bind(...bindArgs).first();
    const totalCount = countRow ? countRow.total : 0;

    const selectSql = `
      SELECT id, title, imageUrl, createdAt, updatedAt, authorId, published
      FROM blogs
      ${whereSql}
      ORDER BY createdAt DESC
      LIMIT ? OFFSET ?
    `;
    const blogsRow = await c.env.DB.prepare(selectSql)
      .bind(...bindArgs, limit, skip)
      .all();
    const blogs = blogsRow.results || [];

    const blogIds = blogs.map((b) => b.id);
    const tagMap = await getTagsForBlogs(c.env.DB, blogIds);

    const mappedBlogs = blogs.map((blog) => ({
      ...blog,
      published: Boolean(blog.published),
      tags: tagMap[blog.id] || [],
    }));

    return c.json({
      blogs: mappedBlogs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit) || 1,
        totalCount,
      },
    });
  } catch (error) {
    console.error('Error in /blog/getallForadmin:', error);
    return c.json({ error: 'Failed to fetch blogs for admin', details: error.message }, 500);
  }
});
