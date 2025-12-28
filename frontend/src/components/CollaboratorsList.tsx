import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchCollaborators, addCollaborator, removeCollaborator } from '../store/collaboratorsSlice';
import './CollaboratorsList.css';

interface CollaboratorsListProps {
  projectId: number;
  isOwner: boolean;
}

const CollaboratorsList: React.FC<CollaboratorsListProps> = ({ projectId, isOwner }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: collaborators, loading, error } = useSelector((state: RootState) => state.collaborators);
  const [showAddForm, setShowAddForm] = useState(false);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<'MAINTAINER' | 'CONTRIBUTOR' | 'VIEWER'>('CONTRIBUTOR');

  useEffect(() => {
    if (isOwner) {
      dispatch(fetchCollaborators(projectId));
    }
  }, [dispatch, projectId, isOwner]);

  const handleAddCollaborator = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(addCollaborator({ projectId, data: { username, role } })).unwrap();
      setUsername('');
      setRole('CONTRIBUTOR');
      setShowAddForm(false);
    } catch (err) {
      console.error('Failed to add collaborator:', err);
    }
  };

  const handleRemove = async (collaboratorId: number) => {
    if (window.confirm('Are you sure you want to remove this collaborator?')) {
      try {
        await dispatch(removeCollaborator({ projectId, collaboratorId })).unwrap();
      } catch (err) {
        console.error('Failed to remove collaborator:', err);
      }
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'OWNER': return 'badge-warning';
      case 'MAINTAINER': return 'badge-primary';
      case 'CONTRIBUTOR': return 'badge-success';
      case 'VIEWER': return 'badge-danger';
      default: return 'badge-primary';
    }
  };

  return (
    <div className="collaborators-container">
      <div className="collaborators-header">
        <h3>Team Members</h3>
        {isOwner && (
          <button onClick={() => setShowAddForm(!showAddForm)} className="btn-add">
            {showAddForm ? '✕ Cancel' : '+ Add Member'}
          </button>
        )}
      </div>

      {showAddForm && (
        <form onSubmit={handleAddCollaborator} className="add-collaborator-form card">
          <div className="form-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <select value={role} onChange={(e) => setRole(e.target.value as any)} required>
              <option value="MAINTAINER">Maintainer</option>
              <option value="CONTRIBUTOR">Contributor</option>
              <option value="VIEWER">Viewer</option>
            </select>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Collaborator'}
          </button>
        </form>
      )}

      {error && <div className="error-message">{error}</div>}

      {!isOwner && (
        <div className="empty-state">Collaborators are visible to project owners only.</div>
      )}

      {isOwner && (
        loading && !showAddForm ? (
          <div className="loading">Loading collaborators...</div>
        ) : (
          <div className="collaborators-grid">
            {collaborators.map((collab) => (
              <div key={collab.id} className="collaborator-card card">
                <div className="collaborator-info">
                  <div className="collaborator-avatar">{collab.username.charAt(0).toUpperCase()}</div>
                  <div className="collaborator-details">
                    <h4>{collab.username}</h4>
                    <span className={`badge ${getRoleBadgeClass(collab.role)}`}>
                      {collab.role}
                    </span>
                  </div>
                </div>
                {isOwner && collab.role !== 'OWNER' && (
                  <button
                    onClick={() => handleRemove(collab.id)}
                    className="btn-remove"
                    title="Remove collaborator"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        )
      )}

      {isOwner && !loading && collaborators.length === 0 && (
        <div className="empty-state">No collaborators yet</div>
      )}
    </div>
  );
};

export default CollaboratorsList;
