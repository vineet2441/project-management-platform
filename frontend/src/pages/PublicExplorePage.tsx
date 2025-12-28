import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPublicProjects } from '../services/projectService';
import type { Project } from '../services/projectService';
import './PublicExplorePage.css';

const PublicExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublicProjects = async () => {
      try {
        setLoading(true);
        const data = await getPublicProjects();
        setProjects(data);
      } catch (err) {
        console.error('Failed to fetch public projects:', err);
        setError('Failed to load public projects');
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProjects();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="public-explore-page">
      <div className="page-header">
        <h1>Explore Public Projects</h1>
        <p className="text-secondary">Discover and collaborate on open projects</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-container">
          <div className="loading">Loading public projects...</div>
        </div>
      ) : projects.length === 0 ? (
        <div className="empty-state card">
          <h3>No Public Projects</h3>
          <p className="text-muted">There are no public projects to explore yet.</p>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="project-card card"
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              <div className="project-header">
                <h3>{project.name}</h3>
                <span className="badge badge-success">PUBLIC</span>
              </div>
              <p className="project-description">{project.description}</p>
              <div className="project-footer">
                <div className="project-owner">
                  <span className="owner-avatar">
                    {project.ownerUsername.charAt(0).toUpperCase()}
                  </span>
                  <span className="owner-name">{project.ownerUsername}</span>
                </div>
                <span className="project-date text-muted">
                  {formatDate(project.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicExplorePage;
