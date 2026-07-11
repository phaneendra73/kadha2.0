import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from './Button.jsx';
import { FiZap, FiArrowRight, FiFeather } from 'react-icons/fi';

export default function Hero() {
  const navigate = useNavigate();
  return (
    <section style={{ position: 'relative', overflow: 'hidden', padding: '6rem 1.5rem', textAlign: 'center' }}>
      {/* Ambient blobs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', left: '50%', top: 0,
          transform: 'translateX(-50%)',
          width: 480, height: 480, borderRadius: '50%',
          background: 'radial-gradient(circle, var(--neon-subtle) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
        <div style={{
          position: 'absolute', right: 0, bottom: 0,
          width: 280, height: 280, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,180,216,0.07) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
        style={{ position: 'relative', zIndex: 1, maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        {/* Badge */}
        <motion.span
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15 }}
          style={{
            marginBottom: '1.75rem',
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '0.35rem 1rem', borderRadius: 9999,
            border: '1px solid var(--neon-border)',
            background: 'var(--neon-subtle)',
            color: 'var(--neon)',
            fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
          }}
        >
          <FiZap size={11} />
          Personal Publishing Platform
        </motion.span>

        {/* Headline */}
        <h1 style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: 'clamp(2.4rem, 7vw, 4.5rem)',
          fontWeight: 900,
          lineHeight: 1.06,
          letterSpacing: '-0.02em',
          marginBottom: '1.5rem',
          color: 'var(--fg)',
        }}>
          Ideas that travel at the{' '}
          <span className="gradient-text">speed of light.</span>
        </h1>

        <p style={{
          fontSize: '1.1rem', color: 'var(--fg-muted)', maxWidth: 580,
          lineHeight: 1.75, marginBottom: '2.5rem',
        }}>
          A minimalist canvas for sharing insights, deep stories, and articles. Experience distraction-free publishing and clean reading interfaces.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
          <Button size="lg" className="btn-pill" onClick={() => navigate('/BlogPosts')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Explore Stories
            <FiArrowRight size={16} />
          </Button>
          <Button size="lg" variant="outline" className="btn-pill" onClick={() => navigate('/Editor')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <FiFeather size={16} style={{ color: 'var(--neon)' }} />
            Write a Story
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
