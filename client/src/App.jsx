import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Public Pages
import Home from "./pages/Home";
import Archive from "./pages/Archive";
import ExperienceArchive from "./pages/ExperienceArchive";
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";

// Layout
import PublicLayout from "./components/PublicLayout";

// Admin Pages
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ManageExperiences from "./pages/admin/ManageExperiences";
import ManageProjects from "./pages/admin/ManageProjects";
import ManageAbout from "./pages/admin/ManageAbout";
import ManageSkills from "./pages/admin/ManageSkills";
import ManageCertifications from "./pages/admin/ManageCertifications";
import ManageSettings from "./pages/admin/ManageSettings";
import Messages from "./pages/admin/Messages";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageProfile from "./pages/admin/ManageProfile";
import ManageBlogs from "./pages/admin/ManageBlogs";
import ManageResources from "./pages/admin/ManageResources";

import CustomCursor from "./components/CustomCursor";

function App() {
  return (
    <AuthProvider>
      <CustomCursor />
      <Router>
        <Routes>
          {/* ── Public Routes ───────────────────────────── */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/experience-archive" element={<ExperienceArchive />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:id" element={<BlogPost />} />
          </Route>

          {/* ── Admin Routes ────────────────────────────── */}
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route
              path="dashboard"
              element={
                <div className="text-slate-200">
                  <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
                  <p className="text-slate-400">
                    Welcome to the admin panel. Use the sidebar to manage your
                    portfolio content.
                  </p>
                </div>
              }
            />
            <Route path="experiences" element={<ManageExperiences />} />
            <Route path="projects" element={<ManageProjects />} />
            <Route path="skills" element={<ManageSkills />} />
            <Route path="certifications" element={<ManageCertifications />} />
            <Route path="about" element={<ManageAbout />} />
            <Route path="messages" element={<Messages />} />
            <Route path="settings" element={<ManageSettings />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="profile" element={<ManageProfile />} />
            <Route path="blogs" element={<ManageBlogs />} />
            <Route path="resources" element={<ManageResources />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
