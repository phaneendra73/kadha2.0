import { useState, useEffect } from 'react';
import axios from 'axios';
import { getenv } from '../utils/getenv.js';

const useAdminBlogs = (
  page = 1,
  selectedTags = [],
  searchQuery = '',
  enabled = true,
  refreshTrigger = 0
) => {
  const [blogs, setBlogs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) return;
    const fetchAdminBlogs = async () => {
      const apiUrl = getenv('APIURL');
      const blogLimit = getenv('BLOGSLIMIT');
      const token = localStorage.getItem('jwt');

      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${apiUrl}/blog/getallForadmin`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
        setError('Error fetching admin blogs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminBlogs();
  }, [page, selectedTags.join(','), searchQuery, enabled, refreshTrigger]);

  return { blogs, totalCount, totalPages, loading, error };
};

export default useAdminBlogs;
