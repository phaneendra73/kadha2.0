import { useState, useEffect } from 'react';
import axios from 'axios';
import { getenv } from '../utils/getenv.js';
import { useDebounce } from 'use-debounce';

const useSearch = (query) => {
  const [debouncedQuery] = useDebounce(query, 350);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.trim().length === 0) {
      setResults([]);
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      const apiUrl = getenv('APIURL');
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${apiUrl}/blog/getall`, {
          params: {
            query: debouncedQuery,
            limit: 8,
          },
        });
        setResults(response.data.blogs || []);
      } catch (err) {
        setError('Error searching blogs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  return { results, loading, error };
};

export default useSearch;
