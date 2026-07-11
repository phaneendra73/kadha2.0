import React, { useState } from 'react';
import BlogCard from './BlogCard.jsx';
import useBlogs from '../../hooks/useBlogs.js';
import useTags from '../../hooks/useTags.js';
import { Button } from './Button.jsx';
import { Skeleton } from './Skeleton.jsx';
import { FiLoader, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function HomeBlogs() {
  const [page, setPage] = useState(1);
  const [selectedTag, setSelectedTag] = useState('');
  const { blogs, totalPages, loading, error } = useBlogs(page, selectedTag ? [selectedTag] : []);
  const { tags } = useTags();

  return (
    <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem 6rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.875rem', fontWeight: 800, color: 'var(--fg)', marginBottom: 4 }}>
            Latest Stories
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--fg-muted)' }}>
            Fresh ideas delivered directly to you.
          </p>
        </div>

        {/* Tag filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[{ id: '', name: 'All' }, ...tags].map(tag => (
            <Button
              key={tag.id}
              variant={selectedTag === tag.name || (tag.id === '' && selectedTag === '') ? 'default' : 'outline'}
              size="sm"
              className="btn-pill"
              onClick={() => { setSelectedTag(tag.id === '' ? '' : (selectedTag === tag.name ? '' : tag.name)); setPage(1); }}
            >
              {tag.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Skeleton style={{ height: 190, borderRadius: 8 }} />
              <div style={{ display: 'flex', gap: 6 }}>
                <Skeleton style={{ width: 50, height: 18, borderRadius: 9999 }} />
                <Skeleton style={{ width: 60, height: 18, borderRadius: 9999 }} />
              </div>
              <Skeleton style={{ width: '85%', height: 20 }} />
              <Skeleton style={{ width: '65%', height: 20 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                <Skeleton style={{ width: 80, height: 14 }} />
                <Skeleton style={{ width: 40, height: 14 }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '4rem 0' }}>
          <FiAlertCircle size={36} style={{ color: '#ef4444' }} />
          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ef4444' }}>{error}</p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && blogs.length === 0 && (
        <p style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--fg-muted)', fontSize: '0.875rem' }}>
          No stories yet for this tag.
        </p>
      )}

      {/* Grid */}
      {!loading && !error && blogs.length > 0 && (
        <>
          <motion.div
            key={`${selectedTag}-${page}`}
            initial="hidden"
            animate="show"
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}
          >
            {blogs.map(blog => <BlogCard key={blog.id} blog={blog} />)}
          </motion.div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: '3.5rem' }}>
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Previous</Button>
              <span style={{ fontSize: '0.875rem', color: 'var(--fg-muted)' }}>
                Page <strong style={{ color: 'var(--fg)' }}>{page}</strong> / <strong style={{ color: 'var(--fg)' }}>{totalPages}</strong>
              </span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next →</Button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
