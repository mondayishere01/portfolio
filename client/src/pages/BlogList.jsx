import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Tag } from "lucide-react";
import { getSettings } from "../api";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category");
  const tag = searchParams.get("tag");

  useEffect(() => {
    getSettings()
      .then(({ data }) => setSettings(data || {}))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        let url = "/blogs";
        const query = [];
        if (category) query.push(`category=${encodeURIComponent(category)}`);
        if (tag) query.push(`tag=${encodeURIComponent(tag)}`);
        if (query.length > 0) url += `?${query.join("&")}`;
        const { data } = await api.get(url);
        setBlogs(Array.isArray(data) ? data : []);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [category, tag]);

    return (
        <div className="min-h-screen px-6 pt-28 pb-12 md:px-12 md:py-20 lg:pl-3 lg:pr-12 text-left" style={{ backgroundColor: 'var(--surface-base)' }}>
            <div className="lg:max-w-none lg:mx-0">
                <header className="mb-12">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl" style={{ color: 'var(--content-body)' }}>Writings & Thoughts</h1>
                    <p className="mt-4 max-w-2xl text-lg" style={{ color: 'var(--content-muted)' }}>
                        Insights on software engineering, web development, and my technical journey.
                    </p>
                </header>

                {/* Filters */}
                {(category || tag) && (
                    <div className="mb-8 flex items-center gap-3">
                        <span className="text-sm font-medium" style={{ color: 'var(--content-muted)' }}>Filtered by:</span>
                        {category && (
                            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold" style={{ backgroundColor: 'var(--interactive-base-10)', color: 'var(--accent-brand)' }}>
                                Category: {category}
                            </span>
                        )}
                        {tag && (
                            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold" style={{ backgroundColor: 'var(--surface-accent)', border: '1px solid var(--border-alpha-05)', color: 'var(--content-body)' }}>
                                <Tag size={12} /> {tag}
                            </span>
                        )}
                        <button onClick={() => setSearchParams({})} className="font-bold uppercase tracking-widest text-[10px] ml-2" style={{ color: 'var(--accent-brand)' }}>
                            Clear all
                        </button>
                    </div>
                )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-80 w-full rounded-xl animate-pulse"
                style={{ backgroundColor: 'var(--skeleton)', border: '1px solid var(--border-alpha-05)' }}
              />
            ))
          ) : blogs.length === 0 ? (
            <p className="col-span-full font-medium italic" style={{ color: 'var(--content-tertiary)' }}>
              No articles found matching those filters.
            </p>
          ) : (
            blogs.map((blog) => (
              <div
                key={blog._id}
                className="group flex flex-col items-start justify-between rounded-xl transition-all duration-300 p-4"
                style={{
                  border: '1px solid var(--border-alpha-05)',
                  backgroundColor: 'var(--surface-card)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--interactive-base-20)'; e.currentTarget.style.boxShadow = '0 25px 50px -12px var(--shadow-subtle)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-alpha-05)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <Link to={`/blog/${blog._id}`} className="w-full">
                  <div className="w-full h-48 mb-4 overflow-hidden rounded-lg transition-colors" style={{ backgroundColor: 'var(--surface-base)', border: '1px solid var(--border-alpha-05)' }}>
                    {blog.imageUrl ? (
                      <img
                        src={blog.imageUrl}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold uppercase tracking-widest text-[10px]" style={{ color: 'var(--content-ghost)' }}>No Preview</div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setSearchParams({ category: blog.category });
                      }}
                      className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors"
                      style={{ backgroundColor: 'var(--interactive-base-10)', color: 'var(--accent-brand)' }}
                    >
                      {blog.category}
                    </button>
                    <span className="text-xs font-medium" style={{ color: 'var(--content-tertiary)' }}>
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold transition-colors line-clamp-2 leading-tight" style={{ color: 'var(--content-body)' }}>
                    {blog.title}
                  </h3>

                  <p className="mt-2 text-sm line-clamp-3 leading-relaxed" style={{ color: 'var(--content-muted)' }}>
                    {blog.content.replace(/[#*_>]/g, "")}
                  </p>
                </Link>

                <div className="mt-5 flex items-center gap-3 w-full pt-4" style={{ borderTop: '1px solid var(--border-alpha-05)' }}>
                  {blog.author?.imageUrl ? (
                    <img
                      src={blog.author.imageUrl}
                      alt={blog.author.name}
                      className="h-8 w-8 rounded-full object-cover ring-2 transition-all"
                      style={{ '--tw-ring-color': 'var(--border-alpha-05)' }}
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ring-2" style={{ backgroundColor: 'var(--surface-accent)', color: 'var(--accent-brand)', '--tw-ring-color': 'var(--border-alpha-05)' }}>
                      {blog.author?.name?.charAt(0) || "?"}
                    </div>
                  )}
                  <div className="text-xs font-bold transition-colors" style={{ color: 'var(--content-muted)' }}>
                    {blog.author?.name}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogList;
