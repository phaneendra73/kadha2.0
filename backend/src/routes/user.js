import { Hono } from 'hono';
import { hashPassword, verifyPassword } from './middleware.js';
import { sign } from 'hono/jwt';

export const userprofilesRoutes = new Hono();

userprofilesRoutes.post('/signup', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    // Check if user already exists in D1
    const existingUser = await c.env.DB.prepare(
      'SELECT id FROM userprofiles WHERE email = ?'
    )
      .bind(email)
      .first();

    if (existingUser) {
      return c.json({ error: 'userprofiles already exists with the same Email' }, 400);
    }

    const hashedPassword = await hashPassword(password);

    // Insert new user profile into D1
    const result = await c.env.DB.prepare(
      'INSERT INTO userprofiles (email, password, name) VALUES (?, ?, ?)'
    )
      .bind(email, hashedPassword, name || 'Kadha Author')
      .run();

    const userId = result.meta.last_row_id;
    const secret = c.env.JWT_SECRET || 'kadha2-super-secret-key-2026';
    const jwt = await sign({ id: userId }, secret);

    return c.json({ jwt, message: 'Signup successful' }, 201);
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: 'Failed to sign up user', details: error.message }, 500);
  }
});

userprofilesRoutes.post('/signin', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const user = await c.env.DB.prepare(
      'SELECT * FROM userprofiles WHERE email = ?'
    )
      .bind(email)
      .first();

    if (!user) {
      return c.json({ error: 'Invalid Email' }, 400);
    }

    const passwordIsValid = await verifyPassword(password, user.password);
    if (!passwordIsValid) {
      return c.json({ error: 'Invalid Password' }, 400);
    }

    const secret = c.env.JWT_SECRET || 'kadha2-super-secret-key-2026';
    const jwt = await sign({ id: user.id }, secret);

    return c.json(
      {
        jwt,
        message: 'Signed In',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          profileUrl: user.profileUrl,
        },
      },
      200
    );
  } catch (error) {
    console.error('Signin error:', error);
    return c.json({ error: 'Failed to sign in', details: error.message }, 500);
  }
});
