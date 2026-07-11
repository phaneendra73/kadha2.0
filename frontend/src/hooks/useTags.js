import { useState, useEffect } from 'react';
import axios from 'axios';
import { getenv } from '../utils/getenv.js';

const useTags = (refreshTrigger = 0) => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTags = async () => {
      const apiUrl = getenv('APIURL');
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${apiUrl}/blog/tags`);
        setTags(response.data.tags || []);
      } catch (err) {
        setError('Error fetching tags');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, [refreshTrigger]);

  return { tags, loading, error };
};

export default useTags;
