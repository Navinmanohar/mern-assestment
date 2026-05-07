import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StoryCard from '../components/StoryCard';

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const abortRef = useRef(null);

  const fetchStories = async (page = 1) => {
    if (!user) return;

    // Cancel previous request
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const { data } = await api.get(`/stories?page=${page}&limit=10`, {
        signal: controller.signal,
      });
      // Only update state if component is still mounted and user is logged in
      if (user) {
        setStories(data.data.stories);
        setPagination(data.data.pagination);
      }
    } catch (err) {
      if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
        console.error('Failed to fetch stories:', err);
      }
    } finally {
      if (abortRef.current === controller) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchStories(pagination.page);
    } else {
      setStories([]);
      setLoading(false);
    }

    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
        abortRef.current = null;
      }
    };
  }, [user, pagination.page]);

  if (loading && !stories.length) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Top Stories</h1>
        <span className="text-sm text-slate-500">
          Page {pagination.page} of {pagination.totalPages}
        </span>
      </div>

      <div className="space-y-4">
        {stories.map((story) => (
          <StoryCard key={story._id} story={story} user={user} />
        ))}
      </div>

      {pagination.totalPages > 1 && user && (
        <div className="flex justify-center gap-3 mt-10">
          <button
            onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
            disabled={pagination.page <= 1}
            className="px-5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium 
                     text-slate-700 hover:bg-slate-50 transition-colors 
                     disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
            disabled={pagination.page >= pagination.totalPages}
            className="px-5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium 
                     text-slate-700 hover:bg-slate-50 transition-colors 
                     disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Stories;
