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
        <div className="min-h-screen bg-black px-6 pt-28 pb-12 md:px-12 md:py-20 lg:pl-3 lg:pr-12 text-left">
            <div className="lg:max-w-none lg:mx-0">
                <header className="mb-12">
                    <h1 className="text-4xl font-bold tracking-tight text-slate-200 sm:text-5xl">Writings & Thoughts</h1>
                    <p className="mt-4 max-w-2xl text-lg text-slate-400">
                        Insights on software engineering, web development, and my technical journey.
                    </p>
                </header>

                {/* Filters */}
                {(category || tag) && (
                    <div className="mb-8 flex items-center gap-3">
                        <span className="text-sm text-slate-400 font-medium">Filtered by:</span>
                        {category && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ffeb00]/10 px-3 py-1 text-sm font-bold text-[#ffeb00]">
                                Category: {category}
                            </span>
                        )}
                        {tag && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800 border border-white/5 px-3 py-1 text-sm font-bold text-slate-300">
                                <Tag size={12} /> {tag}
                            </span>
                        )}
                        <button onClick={() => setSearchParams({})} className="text-sm text-[#ffeb00] hover:underline font-bold uppercase tracking-widest text-[10px] ml-2">
                            Clear all
                        </button>
                    </div>
                )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-80 w-full bg-slate-800/20 rounded-xl animate-pulse border border-white/5"
              />
            ))
          ) : blogs.length === 0 ? (
            <p className="text-slate-500 col-span-full font-medium italic">
              No articles found matching those filters.
            </p>
          ) : (
            blogs.map((blog) => (
              <div
                key={blog._id}
                className="group flex flex-col items-start justify-between rounded-xl border border-white/5 bg-[#111111]/50 hover:bg-[#111111] hover:border-[#ffeb00]/20 hover:shadow-2xl hover:shadow-[#ffeb00]/5 transition-all duration-300 p-4"
              >
                <Link to={`/blog/${blog._id}`} className="w-full">
                  <div className="w-full h-48 mb-4 overflow-hidden rounded-lg bg-black border border-white/5 group-hover:border-white/10 transition-colors">
                    {blog.imageUrl ? (
                      <img
                        src={blog.imageUrl}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-700 font-bold uppercase tracking-widest text-[10px]">No Preview</div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setSearchParams({ category: blog.category });
                      }}
                      className="rounded-full bg-[#ffeb00]/10 hover:bg-[#ffeb00]/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#ffeb00] transition-colors"
                    >
                      {blog.category}
                    </button>
                    <span className="text-xs text-slate-500 font-medium">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-200 group-hover:text-[#ffeb00] transition-colors line-clamp-2 leading-tight">
                    {blog.title}
                  </h3>

                  <p className="mt-2 text-sm text-slate-400 line-clamp-3 leading-relaxed">
                    {blog.content.replace(/[#*_>]/g, "")}
                  </p>
                </Link>

                <div className="mt-5 flex items-center gap-3 w-full border-t border-white/5 pt-4">
                  {blog.author?.imageUrl ? (
                    <img
                      src={blog.author.imageUrl}
                      alt={blog.author.name}
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-white/5 group-hover:ring-[#ffeb00]/20 transition-all"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-[#ffeb00] font-bold text-xs ring-2 ring-white/5">
                      {blog.author?.name?.charAt(0) || "?"}
                    </div>
                  )}
                  <div className="text-xs font-bold text-slate-400 group-hover:text-slate-200 transition-colors">
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
