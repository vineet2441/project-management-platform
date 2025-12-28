import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { getProject, getPublicProject, forkProject } from '../services/projectService';
import { pullRequestService } from '../services/pullRequestService';
import type { Project } from '../services/projectService';
import ProjectVisibilityToggle from '../components/ProjectVisibilityToggle';
import CollaboratorsList from '../components/CollaboratorsList';
import PullRequestsList from '../components/PullRequestsList';
import GitPanel from '../components/GitPanel';
import CodeEditor from '../components/CodeEditor';
import './ProjectDetailPage.css';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [publicView, setPublicView] = useState(false);
  const [forking, setForking] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'code' | 'collaborators' | 'pull-requests' | 'git'>('overview');

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getProject(Number(id));
        setProject(data);
        setPublicView(false);
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 403 || status === 404) {
          try {
            const data = await getPublicProject(Number(id));
            setProject(data);
            setPublicView(true);
          } catch (innerErr) {
            console.error('Failed to fetch public project:', innerErr);
            setError('Failed to load project details');
          }
        } else {
          console.error('Failed to fetch project:', err);
          setError('Failed to load project details');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="project-detail-page">
        <div className="loading">Loading project...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="project-detail-page">
        <div className="error-message">{error || 'Project not found'}</div>
        <button onClick={() => navigate('/projects')}>← Back to Projects</button>
      </div>
    );
  }

  const isOwner = currentUser?.id === project.ownerId && !publicView;
  const canManage = isOwner; // Can be extended to check for MAINTAINER role

  // Debug logging
  console.log('🔍 PROJECT DEBUG:', {
    id: project.id,
    name: project.name,
    isOwner,
    currentUserId: currentUser?.id,
    projectOwnerId: project.ownerId,
    forkedFromId: project.forkedFromId,
    shouldShowPRButton: isOwner && project.forkedFromId
  });

  const handleFork = async () => {
    try {
      setForking(true);
      const forkedProject = await forkProject(project.id);
      alert('Project forked successfully! Navigating to your fork...');
      navigate(`/projects/${forkedProject.id}`);
    } catch (err) {
      alert('Failed to fork project');
      console.error(err);
    } finally {
      setForking(false);
    }
  };

  const handleCreatePRFromFork = async () => {
    if (!project?.forkedFromId) return;
    try {
      setForking(true);
      const title = `Update from fork by ${currentUser?.username || 'user'}`;
      const description = 'Syncing changes from my fork to upstream';
      const pr = await pullRequestService.createPullRequest(project.forkedFromId, {
        title,
        description,
        sourceBranch: 'main',
        targetBranch: 'main',
        sourceProjectId: project.id,
      });
      alert(`Pull Request created (#${pr.id}). Owner can merge it.`);
    } catch (err) {
      alert('Failed to create pull request');
      console.error(err);
    } finally {
      setForking(false);
    }
  };

  return (
    <div className="project-detail-page">
      <div className="project-header">
        <button onClick={() => navigate('/projects')} className="btn-back">
          ← Back
        </button>
        <div className="project-title-section">
          <h1>{project.name}</h1>
          <span className={`badge ${project.visibility === 'PUBLIC' ? 'badge-success' : 'badge-warning'}`}>
            {project.visibility}
          </span>
        </div>
        <p className="project-owner-info">
          Created by <strong>{project.ownerUsername}</strong>
        </p>
        {!isOwner && project.visibility === 'PUBLIC' && (
          <div className="public-view-actions">
            <p className="text-secondary">
              {publicView
                ? 'You are viewing a public project (read-only).'
                : 'This project is public. You can fork it to your workspace.'}
            </p>
            <button
              className="btn-fork"
              onClick={handleFork}
              disabled={forking}
            >
              {forking ? 'Forking...' : '⭐ Clone to My Workspace'}
            </button>
          </div>
        )}

        {isOwner && project.forkedFromId && (
          <div className="public-view-actions">
            <button
              className="btn-fork btn-pr-to-owner"
              onClick={handleCreatePRFromFork}
              disabled={forking}
            >
              {forking ? 'Submitting...' : '⬆️ Create Pull Request to Owner'}
            </button>
          </div>
        )}

        {/* DEBUG INFO */}
        {isOwner && (
          <div style={{padding: '0.5rem', margin: '1rem 0', background: 'rgba(255,0,0,0.1)', border: '1px solid #f00', borderRadius: '4px', fontSize: '0.75rem', color: '#fff'}}>
            <strong>DEBUG:</strong> isOwner={String(isOwner)}, forkedFromId={JSON.stringify(project.forkedFromId)}, 
            showButton={String(isOwner && project.forkedFromId)}
          </div>
        )}
      </div>

      <div className="project-tabs">
        <button 
          className={`project-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`project-tab ${activeTab === 'code' ? 'active' : ''}`}
          onClick={() => setActiveTab('code')}
        >
          Code
        </button>
        <button 
          className={`project-tab ${activeTab === 'collaborators' ? 'active' : ''}`}
          onClick={() => setActiveTab('collaborators')}
        >
          Team
        </button>
        <button 
          className={`project-tab ${activeTab === 'pull-requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('pull-requests')}
        >
          Pull Requests
        </button>
        <button 
          className={`project-tab ${activeTab === 'git' ? 'active' : ''}`}
          onClick={() => setActiveTab('git')}
        >
          Git
        </button>
      </div>

      <div className="project-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="card">
              <h3>Project Description</h3>
              <p className="project-description">{project.description}</p>
            </div>

            {isOwner && (
              <div className="card">
                <h3>Project Settings</h3>
                <ProjectVisibilityToggle 
                  projectId={project.id} 
                  currentVisibility={project.visibility}
                />
              </div>
            )}

            <div className="card">
              <h3>Project Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Created:</span>
                  <span className="info-value">
                    {new Date(project.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Last Updated:</span>
                  <span className="info-value">
                    {new Date(project.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'collaborators' && (
          <CollaboratorsList projectId={project.id} isOwner={isOwner} />
        )}

        {activeTab === 'code' && (
          <div className="code-section">
            <CodeEditor 
              projectId={project.id} 
              canEdit={isOwner || !publicView}
            />
          </div>
        )}

        {activeTab === 'pull-requests' && (
          <PullRequestsList 
            projectId={project.id} 
            canManage={canManage}
            currentUserId={currentUser?.id || 0}
          />
        )}

        {activeTab === 'git' && (
          <GitPanel projectId={project.id} />
        )}
      </div>
    </div>
  );
};

export default ProjectDetailPage;
