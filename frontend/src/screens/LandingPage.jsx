import React from 'react';
import { Appbar, Hero, SearchBar, HomeBlogs, Footer } from '../components/ui/index.js';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[rgb(var(--background))]">
      <Appbar />
      <main className="flex-grow">
        <Hero />
        <SearchBar />
        <HomeBlogs />
      </main>
      <Footer />
    </div>
  );
}
