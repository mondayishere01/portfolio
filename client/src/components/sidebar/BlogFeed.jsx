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
            <div className="h-3 w-16 rounded bg-white/5" />
            <div className="h-4 w-full rounded bg-white/5" />
            <div className="h-3 w-20 rounded bg-white/5" />
          </div>
        ))}
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <p className="text-white/30 text-xs text-center py-8">
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
          className="block rounded-lg px-3 py-3 transition-all duration-200 hover:bg-white/5 group"
          data-cursor-text="Read"
        >
          {/* Category */}
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#ffeb00]/80">
            {blog.category}
          </span>

          {/* Title */}
          <h4 className="text-sm font-medium text-white/80 group-hover:text-white leading-snug mt-1 line-clamp-2">
            {blog.title}
          </h4>

          {/* Date */}
          <span className="text-[11px] text-white/30 mt-1.5 block">
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
            className="flex items-center justify-center w-full py-2.5 rounded-lg border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-[#ffeb00] hover:border-[#ffeb00]/30 hover:bg-[#ffeb00]/5 transition-all duration-300"
            data-cursor-text="Archive"
          >
            Visit the blogs archive
          </Link>
        </div>
      )}
    </div>
  );
};

export default BlogFeed;
