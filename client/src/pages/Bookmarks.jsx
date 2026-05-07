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
        <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-6">Bookmarks</h1>

      {bookmarks.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No bookmarks yet.</p>
      ) : (
        <div className="space-y-3">
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
