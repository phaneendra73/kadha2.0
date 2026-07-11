import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from './Card.jsx';
import { Badge } from './Badge.jsx';
import { FiClock, FiArrowUpRight } from 'react-icons/fi';

export default function BlogCard({ blog }) {
  const navigate = useNavigate();
  const date = new Date(blog.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      onClick={() => navigate(`/Read?id=${blog.id}`)}
      style={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <Card style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Image */}
        <div style={{ position: 'relative', height: 190, overflow: 'hidden', flexShrink: 0 }}>
          <img
            src={blog.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800'}
            alt={blog.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.45s ease' }}
            loading="lazy"
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          />
          <div style={{
            position: 'absolute', top: 10, right: 10,
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '3px 10px', borderRadius: 9999,
            background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)',
            fontSize: '0.68rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)',
          }}>
            <FiClock size={11} style={{ color: 'var(--neon)' }} />
            4 min
          </div>
        </div>

        <CardContent style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingTop: '1.25rem' }}>
          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
            {(blog.tags?.length ? blog.tags : ['Edge']).slice(0, 3).map(tag => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>

          {/* Title */}
          <h3 style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '1rem', fontWeight: 700,
            color: 'var(--fg)', lineHeight: 1.4,
            marginBottom: '0.75rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {blog.title}
          </h3>

          <div style={{ flex: 1 }} />

          {/* Footer */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginTop: '1rem', paddingTop: '0.875rem',
            borderTop: '1px solid var(--border)',
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--fg-muted)' }}>{date}</span>
            <span style={{
              display: 'flex', alignItems: 'center', gap: 3,
              fontSize: '0.75rem', fontWeight: 600, color: 'var(--neon)',
            }}>
              Read <FiArrowUpRight size={13} />
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
