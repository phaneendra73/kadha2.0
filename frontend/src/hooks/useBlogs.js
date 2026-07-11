import { useState, useEffect } from 'react';
import axios from 'axios';
import { getenv } from '../utils/getenv.js';

const useBlogs = (
  page = 1,
  selectedTags = [],
  searchQuery = '',
  enabled = true
) => {
  const [blogs, setBlogs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) return;
    const fetchBlogs = async () => {
      const apiUrl = getenv('APIURL');
      const blogLimit = getenv('BLOGSLIMIT');

      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${apiUrl}/blog/getall`, {
          params: {
            tags: selectedTags.join(','),
            query: searchQuery,
            page,
            limit: blogLimit,
          },
        });
        setBlogs(response.data.blogs || []);
        setTotalCount(response.data.pagination?.totalCount || 0);
        setTotalPages(response.data.pagination?.totalPages || 1);
      } catch (err) {
        setError('Error fetching blogs from Cloudflare D1');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [page, selectedTags.join(','), searchQuery, enabled]);

  return { blogs, totalCount, totalPages, loading, error };
};

export default useBlogs;
