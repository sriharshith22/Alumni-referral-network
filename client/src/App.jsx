import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import AlumniDirectory from './pages/Student/AlumniDirectory';
import AlumniProfile from './pages/Student/AlumniProfile';
import StudentDashboard from './pages/Student/StudentDashboard';
import AlumniDashboard from './pages/Alumni/AlumniDashboard';
import AlumniRequests from './pages/Alumni/AlumniRequests';
import AlumniProfileSetup from './pages/Alumni/AlumniProfileSetup';
import AdminDashboard from './pages/Admin/AdminDashboard';
import Messages from './pages/Messages';

import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1, padding: '24px 0' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/alumni" element={
                <ProtectedRoute roles={['student']}>
                  <AlumniDirectory />
                </ProtectedRoute>
              } />
              <Route path="/alumni/:id" element={
                <ProtectedRoute roles={['student']}>
                  <AlumniProfile />
                </ProtectedRoute>
              } />
              <Route path="/student/dashboard" element={
                <ProtectedRoute roles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } />
              <Route path="/alumni/dashboard" element={
                <ProtectedRoute roles={['alumni']}>
                  <AlumniDashboard />
                </ProtectedRoute>
              } />
              <Route path="/alumni/requests" element={
                <ProtectedRoute roles={['alumni']}>
                  <AlumniRequests />
                </ProtectedRoute>
              } />
              <Route path="/alumni/setup" element={
                <ProtectedRoute roles={['alumni']}>
                  <AlumniProfileSetup />
                </ProtectedRoute>
              } />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute roles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/messages" element={
                <ProtectedRoute roles={['student', 'alumni']}>
                  <Messages />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </AuthProvider>
  );
}

export default App;