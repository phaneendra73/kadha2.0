import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { userprofilesRoutes } from './routes/user.js';
import { blogRoutes } from './routes/blog.js';

const app = new Hono();

// Enable CORS for all origins
app.use('/*', cors());

app.route('/user', userprofilesRoutes);
app.route('/blog', blogRoutes);

app.get('/', (c) => {
  return c.json({
    message: 'Welcome to the Kadha 2.0 API powered by Cloudflare D1!',
    status: 'ONLINE',
    version: '2.0.0',
  }, 200);
});

app.notFound((c) => {
  return c.json({ error: 'Endpoint Not Found' }, 404);
});

app.onError((err, c) => {
  console.error('API Error:', err);
  return c.json({ error: 'Internal Server Error', message: err.message }, 500);
});

export default app;
