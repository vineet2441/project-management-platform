import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { 
  cloneRepository, 
  fetchBranches, 
  createBranch,
  pullChanges,
  pushChanges
} from '../store/gitSlice';
import './GitPanel.css';

interface GitPanelProps {
  projectId: number;
}

const GitPanel: React.FC<GitPanelProps> = ({ projectId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { branches, loading, error } = useSelector((state: RootState) => state.git);
  const [activeTab, setActiveTab] = useState<'clone' | 'branches' | 'sync'>('branches');
  
  // Clone form
  const [cloneData, setCloneData] = useState({
    remoteUrl: '',
    branch: '',
    auth: { username: '', password: '' },
  });

  // Branch form
  const [branchName, setBranchName] = useState('');

  // Auth form
  const [authData, setAuthData] = useState({
    username: '',
    password: '',
  });

  useEffect(() => {
    dispatch(fetchBranches(projectId));
  }, [dispatch, projectId]);

  const handleClone = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(cloneRepository({ 
        projectId, 
        data: {
          remoteUrl: cloneData.remoteUrl,
          branch: cloneData.branch || undefined,
          auth: cloneData.auth.username ? {
            username: cloneData.auth.username,
            password: cloneData.auth.password,
          } : undefined,
        }
      })).unwrap();
      setCloneData({ remoteUrl: '', branch: '', auth: { username: '', password: '' } });
      dispatch(fetchBranches(projectId));
    } catch (err) {
      console.error('Failed to clone repository:', err);
    }
  };

  const handleCreateBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(createBranch({ projectId, data: { branch: branchName } })).unwrap();
      setBranchName('');
    } catch (err) {
      console.error('Failed to create branch:', err);
    }
  };

  const handlePull = async () => {
    try {
      await dispatch(pullChanges({ 
        projectId,
        data: {
          branch: undefined,
          auth: authData.username ? authData : undefined,
        }
      })).unwrap();
      alert('Successfully pulled changes!');
    } catch (err) {
      console.error('Failed to pull:', err);
    }
  };

  const handlePush = async () => {
    try {
      await dispatch(pushChanges({ 
        projectId,
        data: {
          branch: undefined,
          auth: authData.username ? authData : undefined,
        }
      })).unwrap();
      alert('Successfully pushed changes!');
    } catch (err) {
      console.error('Failed to push:', err);
    }
  };

  return (
    <div className="git-panel-container">
      <div className="git-tabs">
        <button 
          className={`git-tab ${activeTab === 'clone' ? 'active' : ''}`}
          onClick={() => setActiveTab('clone')}
        >
          Clone
        </button>
        <button 
          className={`git-tab ${activeTab === 'branches' ? 'active' : ''}`}
          onClick={() => setActiveTab('branches')}
        >
          Branches
        </button>
        <button 
          className={`git-tab ${activeTab === 'sync' ? 'active' : ''}`}
          onClick={() => setActiveTab('sync')}
        >
          Sync
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {activeTab === 'clone' && (
        <form onSubmit={handleClone} className="git-form card">
          <h4>Clone Repository</h4>
          <div className="form-group">
            <input
              type="text"
              placeholder="Repository URL"
              value={cloneData.remoteUrl}
              onChange={(e) => setCloneData({ ...cloneData, remoteUrl: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Branch (optional)"
              value={cloneData.branch}
              onChange={(e) => setCloneData({ ...cloneData, branch: e.target.value })}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Username (optional)"
              value={cloneData.auth.username}
              onChange={(e) => setCloneData({ ...cloneData, auth: { ...cloneData.auth, username: e.target.value } })}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password (optional)"
              value={cloneData.auth.password}
              onChange={(e) => setCloneData({ ...cloneData, auth: { ...cloneData.auth, password: e.target.value } })}
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Cloning...' : 'Clone Repository'}
          </button>
        </form>
      )}

      {activeTab === 'branches' && (
        <div className="git-section">
          <form onSubmit={handleCreateBranch} className="git-form card">
            <h4>Create New Branch</h4>
            <div className="form-row">
              <input
                type="text"
                placeholder="Branch name"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create'}
              </button>
            </div>
          </form>

          <div className="branches-list card">
            <h4>All Branches</h4>
            {loading ? (
              <div className="loading">Loading branches...</div>
            ) : branches.length === 0 ? (
              <div className="empty-state">No branches found. Clone a repository first.</div>
            ) : (
              <ul className="branch-items">
                {branches.map((branch, index) => (
                  <li key={index} className={`branch-item ${branch.current ? 'current' : ''}`}>
                    <span className="branch-icon">
                      {branch.current ? '★' : '○'}
                    </span>
                    <span className="branch-name">{branch.name}</span>
                    {branch.current && <span className="badge badge-primary">Current</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {activeTab === 'sync' && (
        <div className="git-section">
          <div className="git-form card">
            <h4>Git Credentials (Optional)</h4>
            <div className="form-group">
              <input
                type="text"
                placeholder="Username"
                value={authData.username}
                onChange={(e) => setAuthData({ ...authData, username: e.target.value })}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                value={authData.password}
                onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
              />
            </div>
          </div>

          <div className="git-actions card">
            <h4>Synchronization</h4>
            <div className="action-buttons">
              <button onClick={handlePull} disabled={loading} className="btn-pull">
                {loading ? 'Pulling...' : '⬇ Pull Changes'}
              </button>
              <button onClick={handlePush} disabled={loading} className="btn-push">
                {loading ? 'Pushing...' : '⬆ Push Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GitPanel;
