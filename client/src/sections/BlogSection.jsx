import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import SectionHeader from "../components/SectionHeader";
import { sectionVariants, staggerContainer } from "../utils/animations";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await api.get('/blogs');
        setBlogs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (!loading && blogs.length === 0) return null;

  return (
    <motion.section
      id="blog"
      className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
      aria-label="Latest Articles"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={sectionVariants}
    >
      <SectionHeader label="Writings" />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {loading ? (
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 w-full rounded-xl bg-slate-800/50 animate-pulse border border-slate-700/50" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-6 group/list">
            {blogs.slice(0, 4).map((blog) => (
              <motion.div
                key={blog._id}
                variants={sectionVariants}
                className="group flex flex-col sm:flex-row gap-4 sm:gap-6 rounded-xl border border-transparent hover:border-white/10 hover:bg-[#111111] hover:shadow-2xl transition-all duration-300 p-4 relative"
              >
                <Link to={`/blog/${blog._id}`} className="absolute inset-x-0 inset-y-0 z-10" aria-label={blog.title} />
                <div className="w-full sm:w-40 h-32 shrink-0 overflow-hidden rounded-lg bg-slate-800 relative z-0 pointer-events-none border border-slate-700/50 group-hover:border-slate-600 transition-colors">
                  {blog.imageUrl ? (
                    <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 font-medium text-[10px] uppercase tracking-widest bg-slate-800/50">Article</div>
                  )}
                </div>
                <div className="flex flex-col py-1 relative z-0 pointer-events-none">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#ffeb00] bg-[#ffeb00]/10 px-2 py-0.5 rounded-sm">
                        {blog.category}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                        {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-200 group-hover:text-[#ffeb00] transition line-clamp-2 leading-tight mb-2">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                    {blog.content.replace(/[#*_>]/g, '')}
                  </p>
                </div>
              </motion.div>
            ))}

            {blogs.length > 4 && (
              <div className="mt-8 flex justify-start sm:ml-4 lg:ml-0 z-20 relative px-4">
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 rounded-md bg-[#ffeb00] px-8 py-3 text-sm font-bold uppercase tracking-widest text-slate-900 hover:bg-[#ffdb00] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#ffeb00]/10"
                >
                  View All Articles
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  >
                    <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </motion.section>
  );
};

export default BlogSection;
