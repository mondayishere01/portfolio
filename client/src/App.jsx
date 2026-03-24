import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Archive from './pages/Archive';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ManageExperiences from './pages/admin/ManageExperiences';
import ManageProjects from './pages/admin/ManageProjects';
import ManageAbout from './pages/admin/ManageAbout';
import ManageSkills from './pages/admin/ManageSkills';
import ManageCertifications from './pages/admin/ManageCertifications';
import ManageSettings from './pages/admin/ManageSettings';
import Messages from './pages/admin/Messages';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ── Public Routes ───────────────────────────── */}
          <Route path="/" element={<Home />} />
          <Route path="/archive" element={<Archive />} />

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
            <Route path="dashboard" element={<div className="text-slate-200"><h2 className="text-2xl font-bold mb-4">Dashboard</h2><p className="text-slate-400">Welcome to the admin panel. Use the sidebar to manage your portfolio content.</p></div>} />
            <Route path="experiences" element={<ManageExperiences />} />
            <Route path="projects" element={<ManageProjects />} />
            <Route path="skills" element={<ManageSkills />} />
            <Route path="certifications" element={<ManageCertifications />} />
            <Route path="about" element={<ManageAbout />} />
            <Route path="messages" element={<Messages />} />
            <Route path="settings" element={<ManageSettings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
