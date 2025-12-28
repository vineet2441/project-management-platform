import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { 
  fetchPullRequests, 
  createPullRequest, 
  mergePullRequest, 
  closePullRequest 
} from '../store/pullRequestsSlice';
import './PullRequestsList.css';

interface PullRequestsListProps {
  projectId: number;
  canManage: boolean;
  currentUserId: number;
}

const PullRequestsList: React.FC<PullRequestsListProps> = ({ 
  projectId, 
  canManage,
  currentUserId 
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: pullRequests, loading, error } = useSelector((state: RootState) => state.pullRequests);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sourceBranch: '',
    targetBranch: 'main',
  });

  useEffect(() => {
    dispatch(fetchPullRequests(projectId));
  }, [dispatch, projectId]);

  const handleRefresh = () => {
    dispatch(fetchPullRequests(projectId));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(createPullRequest({ projectId, data: formData })).unwrap();
      setFormData({ title: '', description: '', sourceBranch: '', targetBranch: 'main' });
      setShowCreateForm(false);
    } catch (err) {
      console.error('Failed to create pull request:', err);
    }
  };

  const handleMerge = async (prId: number) => {
    if (window.confirm('Are you sure you want to merge this pull request?')) {
      try {
        await dispatch(mergePullRequest({ projectId, prId })).unwrap();
      } catch (err) {
        console.error('Failed to merge pull request:', err);
      }
    }
  };

  const handleClose = async (prId: number) => {
    if (window.confirm('Are you sure you want to close this pull request?')) {
      try {
        await dispatch(closePullRequest({ projectId, prId })).unwrap();
      } catch (err) {
        console.error('Failed to close pull request:', err);
      }
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'OPEN': return 'badge-success';
      case 'MERGED': return 'badge-primary';
      case 'CLOSED': return 'badge-danger';
      default: return 'badge-warning';
    }
  };

  return (
    <div className="pull-requests-container">
      <div className="pull-requests-header">
        <h3>Pull Requests</h3>
        <button onClick={() => setShowCreateForm(!showCreateForm)} className="btn-create">
          {showCreateForm ? '✕ Cancel' : '+ New PR'}
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreate} className="create-pr-form card">
          <div className="form-group">
            <input
              type="text"
              placeholder="Pull Request Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                placeholder="Source Branch"
                value={formData.sourceBranch}
                onChange={(e) => setFormData({ ...formData, sourceBranch: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Target Branch"
                value={formData.targetBranch}
                onChange={(e) => setFormData({ ...formData, targetBranch: e.target.value })}
                required
              />
            </div>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Pull Request'}
          </button>
        </form>
      )}

      {error && <div className="error-message">{error}</div>}

      <div className="pr-toolbar">
        <button onClick={handleRefresh} className="btn-refresh" disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh PRs'}
        </button>
      </div>

      {loading && !showCreateForm ? (
        <div className="loading">Loading pull requests...</div>
      ) : (
        <div className="pull-requests-list">
          {pullRequests.map((pr) => (
            <div key={pr.id} className="pull-request-card card">
              <div className="pr-header">
                <div className="pr-title-section">
                  <h4>{pr.title}</h4>
                  <span className={`badge ${getStatusBadgeClass(pr.status)}`}>
                    {pr.status}
                  </span>
                </div>
                <div className="pr-meta">
                  <span className="pr-author">by {pr.createdByUsername}</span>
                  <span className="pr-branches">
                    {pr.sourceBranch} → {pr.targetBranch}
                  </span>
                </div>
              </div>
              
              <p className="pr-description">{pr.description}</p>
              
              {pr.status === 'OPEN' && (
                <div className="pr-actions">
                  {canManage && (
                    <button
                      onClick={() => handleMerge(pr.id)}
                      className="btn-merge"
                    >
                      Merge
                    </button>
                  )}
                  {(canManage || pr.createdBy === currentUserId) && (
                    <button
                      onClick={() => handleClose(pr.id)}
                      className="btn-close"
                    >
                      Close
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && pullRequests.length === 0 && (
        <div className="empty-state">No pull requests yet</div>
      )}
    </div>
  );
};

export default PullRequestsList;
