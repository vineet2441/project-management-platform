import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import ProjectsList from './pages/projects/ProjectsList';
import PublicExplorePage from './pages/PublicExplorePage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/explore" element={<ProtectedRoute><PublicExplorePage /></ProtectedRoute>} />
      <Route path="/projects" element={<ProtectedRoute><ProjectsList /></ProtectedRoute>} />
      <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetailPage /></ProtectedRoute>} />
    </Routes>
  );
}
export default App;