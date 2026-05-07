import { useState } from 'react';
import api from '../services/api';

const StoryCard = ({ story, user, onToggleBookmark }) => {
  const [loading, setLoading] = useState(false);
  const [bookmarked, setBookmarked] = useState(
    user?.bookmarks?.includes(story._id) ?? false
  );

  const handleBookmark = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await api.post(`/stories/${story._id}/bookmark`);
      setBookmarked((prev) => !prev);
      if (onToggleBookmark) onToggleBookmark(story._id);
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    } finally {
      setLoading(false);
    }
  };

  const domain = (() => {
    try {
      return new URL(story.url).hostname.replace('www.', '');
    } catch {
      return '';
    }
  })();

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
      <div className="flex items-start gap-3">
        <span className="text-gray-400 text-sm pt-0.5 min-w-[20px]">
          {story.points}
        </span>
        <div className="flex-1 min-w-0">
          <a
            href={story.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-900 font-medium hover:underline text-lg leading-snug"
          >
            {story.title}
          </a>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
            <span>{domain}</span>
            <span>by {story.author}</span>
            <span>{new Date(story.postedAt).toLocaleDateString()}</span>
          </div>
        </div>
        {user && (
          <button
            onClick={handleBookmark}
            disabled={loading}
            className={`shrink-0 px-3 py-1 text-sm rounded border transition ${
              bookmarked
                ? 'bg-orange-100 border-orange-300 text-orange-700'
                : 'border-gray-300 text-gray-500 hover:border-orange-300 hover:text-orange-500'
            }`}
          >
            {loading ? '...' : bookmarked ? 'Saved' : 'Save'}
          </button>
        )}
      </div>
    </div>
  );
};

export default StoryCard;
