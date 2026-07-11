import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getenv } from '../utils/getenv.js';
import { Appbar, Footer } from '../components/ui/index.js';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';
import { FiArrowLeft, FiShare2, FiCalendar, FiClock, FiLoader, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { renderMarkdown } from '../utils/markdown.js';
import { useToast } from '../components/Toaster.jsx';

export default function MdReader() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const blogId = new URLSearchParams(location.search).get('id');

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!blogId) { setError('Invalid story ID.'); setLoading(false); return; }
    axios.get(`${getenv('APIURL')}/blog/get/${blogId}`)
      .then(res => setBlog(res.data))
      .catch(() => setError('Unable to fetch this story.'))
      .finally(() => setLoading(false));
  }, [blogId]);

  // Code Copy Button Injector
  useEffect(() => {
    if (!loading && blog) {
      if (window.Prism) {
        window.Prism.highlightAll();
      }
      const preElements = document.querySelectorAll('.markdown-body pre');
      preElements.forEach((pre) => {
        if (pre.querySelector('.copy-code-btn')) return;

        pre.style.position = 'relative';

        const button = document.createElement('button');
        button.className = 'copy-code-btn';
        button.innerHTML = 'Copy';
        button.style.position = 'absolute';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.fontSize = '10px';
        button.style.fontWeight = '700';
        button.style.textTransform = 'uppercase';
        button.style.letterSpacing = '0.08em';
        button.style.padding = '4px 8px';
        button.style.borderRadius = '4px';
        button.style.border = '1px solid var(--border)';
        button.style.background = 'var(--card)';
        button.style.color = 'var(--muted-foreground)';
        button.style.cursor = 'pointer';
        button.style.transition = 'all 0.15s ease';

        button.addEventListener('mouseenter', () => {
          button.style.color = 'var(--primary)';
          button.style.borderColor = 'var(--primary)';
          button.style.boxShadow = '0 0 8px var(--neon-glow)';
        });
        button.addEventListener('mouseleave', () => {
          button.style.color = 'var(--muted-foreground)';
          button.style.borderColor = 'var(--border)';
          button.style.boxShadow = 'none';
        });

        button.addEventListener('click', async () => {
          const codeText = pre.querySelector('code')?.innerText || '';
          await navigator.clipboard.writeText(codeText);
          button.innerHTML = 'Copied!';
          setTimeout(() => {
            button.innerHTML = 'Copy';
          }, 2000);
        });

        pre.appendChild(button);
      });
    }
  }, [loading, blog]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: 'Link copied!', variant: 'success' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      {/* Scroll indicator */}
      <div id="reading-progress" style={{ width: `${scrollProgress}%` }} />

      <Appbar />
      <main style={{ flex: 1, maxWidth: 860, margin: '0 auto', width: '100%', padding: '2.5rem 1.5rem' }}>
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <FiArrowLeft size={14} /> Back to Stories
        </Button>

        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <Skeleton style={{ width: 60, height: 20, borderRadius: 9999 }} />
              <Skeleton style={{ width: 80, height: 20, borderRadius: 9999 }} />
            </div>
            <Skeleton style={{ width: '90%', height: 42, marginBottom: 8 }} />
            <Skeleton style={{ width: '60%', height: 42, marginBottom: 12 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', gap: 16 }}>
                <Skeleton style={{ width: 100, height: 16 }} />
                <Skeleton style={{ width: 80, height: 16 }} />
              </div>
              <Skeleton style={{ width: 90, height: 32, borderRadius: 6 }} />
            </div>
            <Skeleton style={{ height: 320, borderRadius: 12, marginTop: 16 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
              <Skeleton style={{ width: '100%', height: 16 }} />
              <Skeleton style={{ width: '95%', height: 16 }} />
              <Skeleton style={{ width: '98%', height: 16 }} />
              <Skeleton style={{ width: '70%', height: 16 }} />
            </div>
          </div>
        )}
        {!loading && error && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '4rem 0' }}>
            <FiAlertCircle size={36} style={{ color: '#ef4444' }} />
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ef4444' }}>{error}</p>
            <Button variant="outline" size="sm" onClick={() => navigate('/BlogPosts')}>Browse Stories</Button>
          </div>
        )}

        {!loading && !error && blog && (
          <motion.article initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '1.25rem' }}>
              {blog.tags?.map(tag => <Badge key={tag}>{tag}</Badge>)}
            </div>

            {/* Title */}
            <h1
              style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: 'var(--fg)', lineHeight: 1.2, marginBottom: '1.5rem' }}
            >
              {blog.title}
            </h1>

            {/* Meta */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', paddingBottom: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: '0.875rem', color: 'var(--fg-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FiCalendar size={14} style={{ color: 'var(--neon)' }} />
                  {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FiClock size={14} style={{ color: 'var(--neon)' }} />
                  4 min read
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={copyLink} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <FiShare2 size={13} /> Copy Link
              </Button>
            </div>

            {/* Cover image */}
            {blog.imageUrl && (
              <div style={{ marginBottom: '2.5rem', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  style={{ width: '100%', maxHeight: 440, objectFit: 'cover' }}
                />
              </div>
            )}

            {/* Content card */}
            <div
              className="card markdown-body"
              style={{ padding: '2rem' }}
              dangerouslySetInnerHTML={{ __html: renderMarkdown(blog.markdownContent) }}
            />
          </motion.article>
        )}
      </main>
      <Footer />
    </div>
  );
}
