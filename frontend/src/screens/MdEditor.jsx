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
import { FiArrowLeft, FiSave, FiEye, FiEdit, FiLoader, FiFileText, FiImage, FiSettings, FiClock, FiBold, FiItalic, FiCode, FiLink, FiList, FiMessageSquare, FiMinus } from 'react-icons/fi';
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

  // Helper to insert markdown at the cursor
  const insertAtCursor = (before, after = "") => {
    const textarea = document.getElementById("editor-textarea");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = before + (selected || "text") + after;

    setContent(
      text.substring(0, start) +
      replacement +
      text.substring(end)
    );

    // Refocus textarea and select the text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + (selected || "text").length
      );
    }, 0);
  };

  // Word count stats
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;
  const readTime = Math.ceil(wordCount / 200) || 1;

  const modeBtnStyle = active => ({
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '0.375rem 0.875rem', borderRadius: 6, border: 'none',
    background: active ? 'var(--neon-subtle)' : 'transparent',
    color: active ? 'var(--primary)' : 'var(--muted-foreground)',
    fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.15s'
  });

  const toolbarBtnStyle = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 28, height: 28, borderRadius: 6, border: 'none',
    background: 'transparent', color: 'var(--muted-foreground)',
    cursor: 'pointer', transition: 'all 0.1s ease',
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Appbar />
      <main className="flex-1 flex flex-col lg:flex-row max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-6 gap-6">
        
        {/* LEFT COLUMN: Story configurations / Settings */}
        <div className="w-full lg:w-80 flex flex-col gap-5 flex-shrink-0">
          
          {/* Back Action */}
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => navigate('/Admin')} className="h-9 w-9">
              <FiArrowLeft size={15} />
            </Button>
            <span className="font-heading font-extrabold text-lg text-foreground">
              {id ? '✏️ Edit Story' : '✨ New Story'}
            </span>
          </div>

          {/* Configuration Card */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <FiSettings size={15} className="text-primary" />
              <span className="font-heading font-bold text-xs uppercase tracking-wider text-foreground">Story Settings</span>
            </div>

            {/* Title field */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="story-title">Story Title *</Label>
              <Input
                id="story-title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Story title..."
                className="w-full h-9 font-semibold text-sm border-border bg-transparent focus:border-primary"
              />
            </div>

            {/* Cover image field */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cover-url">Cover Image URL</Label>
              <div className="relative">
                <FiImage className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-3.5 h-3.5" />
                <Input
                  id="cover-url"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full h-9 pl-9 text-xs border-border bg-transparent focus:border-primary"
                />
              </div>
            </div>

            {/* Tag Selection */}
            <div className="flex flex-col gap-2 pt-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                {tags.map(tag => {
                  const selected = selectedTagIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      style={{
                        padding: '0.2rem 0.75rem', borderRadius: 9999, fontSize: '0.7rem', fontWeight: 700,
                        border: '1px solid', cursor: 'pointer', transition: 'all 0.15s ease',
                        background: selected ? 'var(--primary)' : 'transparent',
                        color: selected ? '#000000' : 'var(--muted-foreground)',
                        borderColor: selected ? 'var(--primary)' : 'var(--border)',
                        boxShadow: selected ? '0 2px 8px var(--neon-glow)' : 'none',
                      }}
                      onMouseEnter={e => { if (!selected) e.currentTarget.style.borderColor = 'var(--primary)'; }}
                      onMouseLeave={e => { if (!selected) e.currentTarget.style.borderColor = 'var(--border)'; }}
                    >
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <Button onClick={handleSave} disabled={loading} className="w-full h-9 mt-2">
              {loading ? <FiLoader size={15} className="spin mr-2" /> : <FiSave size={15} className="mr-2" />}
              Publish Story
            </Button>
          </div>
        </div>

        {/* RIGHT COLUMN: Writing Canvas */}
        <div className="flex-1 flex flex-col rounded-xl border border-border bg-card overflow-hidden shadow-sm min-h-[500px]">
          
          {/* Canvas Header toolbar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <FiFileText size={15} className="text-primary" />
              <span className="font-heading font-extrabold text-xs uppercase tracking-widest text-muted-foreground">Editor Workspace</span>
            </div>
            
            {/* View toggles */}
            <div className="flex gap-1 p-1 rounded-lg border border-border bg-background">
              <button style={modeBtnStyle(mode === 'write')} onClick={() => setMode('write')}>
                <FiEdit size={12} /> Write
              </button>
              <button style={modeBtnStyle(mode === 'split')} onClick={() => setMode('split')} className="hidden md:inline-flex">
                <FiEye size={12} /> Split
              </button>
              <button style={modeBtnStyle(mode === 'preview')} onClick={() => setMode('preview')}>
                <FiEye size={12} /> Preview
              </button>
            </div>
          </div>

          {/* Canvas Panels */}
          <div className="flex-1 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border">
            
            {/* Editor Workspace Panel */}
            {(mode === 'write' || mode === 'split') && (
              <div className="flex-1 flex flex-col min-h-[300px]">
                
                {/* Editor Text Formatting Toolbar */}
                <div style={{ display: 'flex', gap: 4, padding: '6px 12px', borderBottom: '1px solid var(--border)', background: 'var(--muted)', flexWrap: 'wrap', alignItems: 'center' }}>
                  <button
                    style={toolbarBtnStyle}
                    onClick={() => insertAtCursor('**', '**')}
                    title="Bold"
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--muted-foreground)'}
                  >
                    <FiBold size={14} />
                  </button>
                  <button
                    style={toolbarBtnStyle}
                    onClick={() => insertAtCursor('*', '*')}
                    title="Italic"
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--muted-foreground)'}
                  >
                    <FiItalic size={14} />
                  </button>
                  <button
                    onClick={() => insertAtCursor('# ')}
                    title="Heading 1"
                    style={{ ...toolbarBtnStyle, fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 800 }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--primary)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted-foreground)'; }}
                  >
                    H1
                  </button>
                  <button
                    onClick={() => insertAtCursor('## ')}
                    title="Heading 2"
                    style={{ ...toolbarBtnStyle, fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 800 }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--primary)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted-foreground)'; }}
                  >
                    H2
                  </button>
                  <button
                    style={toolbarBtnStyle}
                    onClick={() => insertAtCursor('`', '`')}
                    title="Inline Code"
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--muted-foreground)'}
                  >
                    <FiCode size={14} />
                  </button>
                  <button
                    style={toolbarBtnStyle}
                    onClick={() => insertAtCursor('[', '](https://)')}
                    title="Add Link"
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--muted-foreground)'}
                  >
                    <FiLink size={14} />
                  </button>
                  <button
                    style={toolbarBtnStyle}
                    onClick={() => insertAtCursor('\n- ')}
                    title="List Item"
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--muted-foreground)'}
                  >
                    <FiList size={14} />
                  </button>
                  <button
                    style={toolbarBtnStyle}
                    onClick={() => insertAtCursor('\n> ')}
                    title="Blockquote"
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--muted-foreground)'}
                  >
                    <FiMessageSquare size={13} />
                  </button>
                  <button
                    style={toolbarBtnStyle}
                    onClick={() => insertAtCursor('\n---\n')}
                    title="Horizontal Divider"
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--muted-foreground)'}
                  >
                    <FiMinus size={14} />
                  </button>
                </div>

                <textarea
                  id="editor-textarea"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder={'Start writing in Markdown... Use the toolbar above to style your content.'}
                  className="flex-1 w-full p-6 bg-transparent border-none outline-none resize-none text-sm text-foreground placeholder:text-muted-foreground font-mono leading-relaxed focus:ring-0"
                  style={{ minHeight: '100%', fontFamily: "'Fira Code', monospace" }}
                />
              </div>
            )}

            {/* Live Preview Panel */}
            {(mode === 'preview' || mode === 'split') && (
              <div className="flex-1 p-6 overflow-y-auto max-h-[600px] min-h-[300px] bg-background/20">
                <div
                  className="markdown-body text-foreground"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(content || '*No content yet. Start typing to see results.*') }}
                />
              </div>
            )}
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/20 text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
            <div className="flex gap-4">
              <span>Words: <strong className="text-foreground">{wordCount}</strong></span>
              <span>Characters: <strong className="text-foreground">{charCount}</strong></span>
            </div>
            <div className="flex items-center gap-1">
              <FiClock size={11} className="text-primary" />
              <span>Est. Read Time: <strong className="text-foreground">{readTime} min</strong></span>
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
