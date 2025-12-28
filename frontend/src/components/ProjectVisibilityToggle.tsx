import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { fetchProjects } from '../store/projectsSlice';
import { setVisibility } from '../services/projectService';

interface ProjectVisibilityToggleProps {
  projectId: number;
  currentVisibility: 'PUBLIC' | 'PRIVATE';
}

const ProjectVisibilityToggle: React.FC<ProjectVisibilityToggleProps> = ({ 
  projectId, 
  currentVisibility 
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [visibility, setLocalVisibility] = useState<'PUBLIC' | 'PRIVATE'>(currentVisibility);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    const newVisibility = visibility === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC';
    setLoading(true);
    try {
      await setVisibility(projectId, newVisibility);
      setLocalVisibility(newVisibility);
      dispatch(fetchProjects());
    } catch (error) {
      console.error('Failed to update visibility:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <span className="text-secondary">Visibility:</span>
      <button
        onClick={handleToggle}
        disabled={loading}
        className={visibility === 'PUBLIC' ? 'badge-success' : 'badge-warning'}
        style={{
          padding: '0.5em 1em',
          fontSize: '0.9rem',
          minWidth: '100px',
        }}
      >
        {loading ? 'Updating...' : visibility}
      </button>
    </div>
  );
};

export default ProjectVisibilityToggle;
