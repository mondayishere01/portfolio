import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBlogs } from "../../api";

const BlogFeed = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await getBlogs();
        const sorted = (Array.isArray(data) ? data : []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setBlogs(sorted);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 p-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse space-y-2">
            <div className="h-3 w-16 rounded" style={{ backgroundColor: 'var(--skeleton)' }} />
            <div className="h-4 w-full rounded" style={{ backgroundColor: 'var(--skeleton)' }} />
            <div className="h-3 w-20 rounded" style={{ backgroundColor: 'var(--skeleton)' }} />
          </div>
        ))}
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <p className="text-xs text-center py-8" style={{ color: 'var(--content-ghost)' }}>
        No posts yet.
      </p>
    );
  }

  const displayedBlogs = blogs.slice(0, 5);

  return (
    <div className="space-y-1">
      {displayedBlogs.map((blog) => (
        <Link
          key={blog._id}
          to={`/blog/${blog._id}`}
          className="block rounded-lg px-3 py-3 transition-all duration-200 group"
          data-cursor-text="Read"
          style={{ backgroundColor: 'transparent' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hover-bg)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          {/* Category */}
          <span
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{ color: 'var(--accent-brand)', opacity: 0.8 }}
          >
            {blog.category}
          </span>

          {/* Title */}
          <h4
            className="text-sm font-medium leading-snug mt-1 line-clamp-2"
            style={{ color: 'var(--content-body)', opacity: 0.8 }}
          >
            {blog.title}
          </h4>

          {/* Date */}
          <span
            className="text-[11px] mt-1.5 block"
            style={{ color: 'var(--content-ghost)' }}
          >
            {new Date(blog.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </Link>
      ))}

      {blogs.length > 5 && (
        <div className="pt-2 px-1">
          <Link
            to="/blog"
            className="flex items-center justify-center w-full py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-300"
            data-cursor-text="Archive"
            style={{
              color: 'var(--content-tertiary)',
              border: '1px solid var(--border-alpha-10)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--accent-brand)';
              e.currentTarget.style.borderColor = 'var(--interactive-base-30)';
              e.currentTarget.style.backgroundColor = 'var(--interactive-base-05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--content-tertiary)';
              e.currentTarget.style.borderColor = 'var(--border-alpha-10)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Visit the blogs archive
          </Link>
        </div>
      )}
    </div>
  );
};

export default BlogFeed;
