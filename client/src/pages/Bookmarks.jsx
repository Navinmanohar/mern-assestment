import { useEffect, useState } from 'react';
import api from '../services/api';
import StoryCard from '../components/StoryCard';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const { data } = await api.get('/stories/bookmarks');
        setBookmarks(data.data);
      } catch (err) {
        console.error('Failed to fetch bookmarks:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  const handleRemove = (id) => {
    setBookmarks((prev) => prev.filter((s) => s._id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Bookmarks</h1>

      {bookmarks.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-500 text-sm">No bookmarks yet.</p>
          <p className="text-slate-400 text-sm mt-1">Save stories to see them here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((story) => (
            <StoryCard
              key={story._id}
              story={story}
              user={{ bookmarks: bookmarks.map((b) => b._id) }}
              onToggleBookmark={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
