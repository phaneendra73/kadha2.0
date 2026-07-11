import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { getenv } from '../utils/getenv.js';
import { Appbar, Footer } from '../components/ui/index.js';
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Label } from '../components/ui/Label.jsx';
import useTags from '../hooks/useTags.js';
import { useToast } from '../components/Toaster.jsx';
import { FiArrowLeft, FiSave, FiEye, FiEdit, FiLoader } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { renderMarkdown } from '../utils/markdown.js';

export default function MdEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { tags } = useTags();

  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [content, setContent] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('split');

  useEffect(() => {
    if (!localStorage.getItem('jwt')) navigate('/Signin');
  }, [navigate]);

  useEffect(() => {
    if (id && tags.length > 0) {
      axios.get(`${getenv('APIURL')}/blog/get/${id}`)
        .then(res => {
          setTitle(res.data.title || '');
          setImageUrl(res.data.imageUrl || '');
          setContent(res.data.markdownContent || '');
          if (res.data.tags) {
            setSelectedTagIds(tags.filter(t => res.data.tags.includes(t.name)).map(t => t.id));
          }
        })
        .catch(() => toast({ title: 'Error loading story', variant: 'destructive' }));
    }
  }, [id, tags]);

  const toggleTag = tagId =>
    setSelectedTagIds(prev =>
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
    );

  const handleSave = async () => {
    if (!title.trim() || !content.trim())
      return toast({ title: 'Missing fields', description: 'Title and content are required.', variant: 'destructive' });
    setLoading(true);
    const token = localStorage.getItem('jwt');
    try {
      if (id) {
        await axios.put(`${getenv('APIURL')}/blog/edit/${id}`, { title, imageUrl, content, tagIds: selectedTagIds }, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post(`${getenv('APIURL')}/blog/add`, { title, imageUrl, content, tagIds: selectedTagIds }, { headers: { Authorization: `Bearer ${token}` } });
      }
      toast({ title: id ? 'Story updated!' : 'Story published!', variant: 'success' });
      navigate('/Admin');
    } catch {
      toast({ title: 'Save failed', description: 'Please check your connection and try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const modeBtnStyle = active => ({
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '0.375rem 0.75rem', borderRadius: 6, border: 'none',
    background: active ? 'var(--neon-subtle)' : 'transparent',
    color: active ? 'var(--neon)' : 'var(--fg-muted)',
    fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.15s'
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <Appbar />
      <main style={{ flex: 1, maxWidth: 1280, margin: '0 auto', width: '100%', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
        {/* Header toolbar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Button variant="outline" size="icon" onClick={() => navigate('/Admin')}>
              <FiArrowLeft size={16} />
            </Button>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: 'var(--fg)' }}>
              {id ? '✏️ Edit Story' : '✨ New Story'}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Mode switch */}
            <div style={{ display: 'flex', gap: 2, padding: 4, borderRadius: 8, background: 'var(--bg-alt)', border: '1px solid var(--border)' }}>
              <button style={modeBtnStyle(mode === 'write')} onClick={() => setMode('write')}>
                <FiEdit size={13} /> Write
              </button>
              <button style={modeBtnStyle(mode === 'split')} onClick={() => setMode('split')} className="hidden md:inline-flex">
                <FiEye size={13} /> Split
              </button>
              <button style={modeBtnStyle(mode === 'preview')} onClick={() => setMode('preview')}>
                <FiEye size={13} /> Preview
              </button>
            </div>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? <FiLoader size={15} className="spin" /> : <FiSave size={15} />}
              Publish
            </Button>
          </div>
        </div>

        {/* Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Label htmlFor="story-title">Story Title *</Label>
            <Input
              id="story-title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Give your story an inspiring title..."
              style={{ fontWeight: 600 }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Label htmlFor="cover-url">Cover Image URL</Label>
            <Input
              id="cover-url"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
            />
          </div>
        </div>

        {/* Tag pills select */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
          <Label style={{ marginBottom: 12, display: 'block' }}>Select Tags</Label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {tags.map(tag => {
              const selected = selectedTagIds.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  style={{
                    padding: '0.25rem 0.875rem', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 700,
                    border: '1px solid', cursor: 'pointer', transition: 'all 0.15s ease',
                    background: selected ? 'var(--neon)' : 'transparent',
                    color: selected ? '#000' : 'var(--fg-muted)',
                    borderColor: selected ? 'var(--neon)' : 'var(--border)',
                    boxShadow: selected ? '0 2px 8px var(--neon-glow)' : 'none',
                  }}
                  onMouseEnter={e => { if (!selected) e.currentTarget.style.borderColor = 'var(--neon)'; }}
                  onMouseLeave={e => { if (!selected) e.currentTarget.style.borderColor = 'var(--border)'; }}
                >
                  {tag.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Editor Workspace */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'row', gap: '1rem', minHeight: 400 }}>
          {/* Write */}
          {(mode === 'write' || mode === 'split') && (
            <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.5rem 1rem', background: 'var(--bg-alt)', borderBottom: '1px solid var(--border)' }}>
                <FiEdit size={13} style={{ color: 'var(--neon)' }} />
                <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-muted)' }}>Markdown</span>
              </div>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder={'# Heading\n\nStart writing Markdown...\n\n**Bold** | *Italic* | `code` | [link](url)'}
                style={{
                  flex: 1, width: '100%', padding: '1.25rem', background: 'transparent', border: 'none', outline: 'none',
                  resize: 'none', fontSize: '0.875rem', color: 'var(--fg)', fontFamily: "'Fira Code', monospace", lineHeight: 1.6,
                }}
              />
            </div>
          )}

          {/* Preview */}
          {(mode === 'preview' || mode === 'split') && (
            <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.5rem 1rem', background: 'var(--bg-alt)', borderBottom: '1px solid var(--border)' }}>
                <FiEye size={13} style={{ color: 'var(--neon)' }} />
                <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-muted)' }}>Live Preview</span>
              </div>
              <div
                className="markdown-body"
                style={{ flex: 1, padding: '1.25rem', overflowY: 'auto' }}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
              />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
