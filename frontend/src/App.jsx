import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './screens/LandingPage.jsx';
import MdReader from './screens/MdReader.jsx';
import MdEditor from './screens/MdEditor.jsx';
import BlogPosts from './screens/BlogPosts.jsx';
import AdminPage from './screens/AdminPage.jsx';
import TagManager from './screens/TagManager.jsx';
import Signin from './screens/Signin.jsx';
import NotFound from './screens/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/Read" element={<MdReader />} />
      <Route path="/Editor/:id?" element={<MdEditor />} />
      <Route path="/BlogPosts" element={<BlogPosts />} />
      <Route path="/Admin" element={<AdminPage />} />
      <Route path="/Tag" element={<TagManager />} />
      <Route path="/Signin" element={<Signin />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
