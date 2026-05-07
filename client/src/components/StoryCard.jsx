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
    <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <span className="text-slate-400 text-sm font-medium pt-1 min-w-[32px]">
          {story.points}
        </span>
        <div className="flex-1 min-w-0">
          <a
            href={story.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-900 font-medium hover:text-indigo-600 transition-colors text-base leading-snug"
          >
            {story.title}
          </a>
          <div className="flex items-center gap-3 text-sm text-slate-500 mt-2 flex-wrap">
            <span className="text-slate-400">{domain}</span>
            <span>by {story.author}</span>
            <span>{new Date(story.postedAt).toLocaleDateString()}</span>
          </div>
        </div>
        {user && (
          <button
            onClick={handleBookmark}
            disabled={loading}
            className={`shrink-0 px-4 py-1.5 text-sm font-medium rounded-xl border transition-all ${
              bookmarked
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                : 'border-slate-300 text-slate-500 hover:border-indigo-300 hover:text-indigo-600'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? '...' : bookmarked ? 'Remove' : 'Save'}
          </button>
        )}
      </div>
    </div>
  );
};

export default StoryCard;
