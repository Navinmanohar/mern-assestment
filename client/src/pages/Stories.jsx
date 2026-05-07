import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import StoryCard from '../components/StoryCard';

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchStories = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/stories?page=${page}&limit=10`);
      setStories(data.data.stories);
      setPagination(data.data.pagination);
    } catch (err) {
      console.error('Failed to fetch stories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories(pagination.page);
  }, []);

  if (loading && !stories.length) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Top Stories</h1>
        <span className="text-sm text-gray-500">
          Page {pagination.page} of {pagination.totalPages}
        </span>
      </div>

      <div className="space-y-3">
        {stories.map((story) => (
          <StoryCard key={story._id} story={story} user={user} />
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => fetchStories(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="px-4 py-2 border rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
          >
            Previous
          </button>
          <button
            onClick={() => fetchStories(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="px-4 py-2 border rounded disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Stories;
