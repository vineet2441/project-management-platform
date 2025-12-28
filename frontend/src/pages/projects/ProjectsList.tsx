import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store/store';
import {
    fetchProjects,
    createProject as createProjectThunk,
    deleteProject as deleteProjectThunk,
} from '../../store/projectsSlice';
import { addCollaborator } from '../../store/collaboratorsSlice';
import './ProjectsList.css';

const ProjectsList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { items, loading, error } = useSelector((state: RootState) => state.projects);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [visibility, setVisibility] = useState<'PUBLIC' | 'PRIVATE'>('PRIVATE');
    const [collaborators, setCollaborators] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);

    useEffect(()=>{
        dispatch(fetchProjects());
    },[dispatch]);

    const handleCreate = async(e: React.FormEvent)=>{
        e.preventDefault();
        if(!name.trim()) return;
        const result = await dispatch(createProjectThunk({name,description,visibility}));
        if (createProjectThunk.fulfilled.match(result)) {
            const newProject = result.payload as any;
            const usernames = collaborators.split(',').map(u => u.trim()).filter(u => u.length > 0);
            for (const username of usernames) {
                try {
                    await dispatch(addCollaborator({ projectId: newProject.id, data: { username, role: 'CONTRIBUTOR' }}));
                } catch (err) {
                    console.error('Failed to add collaborator', err);
                }
            }
        }
        setName('');
        setDescription('');
        setVisibility('PRIVATE');
        setCollaborators('');
        setShowCreateForm(false);
    };

    const handleDelete = async(id:number)=>{
        if (window.confirm('Are you sure you want to delete this project?')) {
            await dispatch(deleteProjectThunk(id));
        }
    };

    return(
        <div className="projects-list-page">
            <div className="page-header">
                <div className="header-content">
                    <div>
                        <h1>My Projects</h1>
                        <p className="text-secondary">Manage your project repositories</p>
                    </div>
                    <div className="header-actions">
                        <button onClick={() => navigate('/explore')} className="btn-explore">
                            Explore Public
                        </button>
                        <button onClick={() => navigate('/dashboard')} className="btn-dashboard">
                            Dashboard
                        </button>
                    </div>
                </div>
            </div>

            <button 
                onClick={() => setShowCreateForm(!showCreateForm)} 
                className="btn-create-project"
            >
                {showCreateForm ? '✕ Cancel' : '+ New Project'}
            </button>

            {showCreateForm && (
                <form onSubmit={handleCreate} className="create-form card">
                    <h3>Create New Project</h3>
                    <div className="form-group">
                        <label>Project Name</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e)=>setName(e.target.value)}
                            placeholder="Enter project name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea 
                            value={description} 
                            onChange={(e)=> setDescription(e.target.value)}
                            placeholder="Describe your project"
                            rows={4}
                        />
                    </div>
                    <div className="form-group">
                        <label>Visibility</label>
                        <select value={visibility} onChange={(e) => setVisibility(e.target.value as 'PUBLIC' | 'PRIVATE')} required>
                            <option value="PRIVATE">Private</option>
                            <option value="PUBLIC">Public</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Initial Collaborators (comma-separated usernames)</label>
                        <input
                            type="text"
                            value={collaborators}
                            onChange={(e) => setCollaborators(e.target.value)}
                            placeholder="e.g. alice, bob, charlie"
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Project'}
                    </button>
                </form>
            )}

            {loading && !showCreateForm && <div className="loading">Loading projects...</div>}
            {error && <div className="error-message">{error}</div>}

            {!loading && items.length === 0 ? (
                <div className="empty-state card">
                    <h3>No Projects Yet</h3>
                    <p className="text-muted">Create your first project to get started</p>
                </div>
            ) : (
                <div className="projects-grid">
                    {items.map((p)=>(
                        <div key={p.id} className="project-card card">
                            <div 
                                className="project-content"
                                onClick={() => navigate(`/projects/${p.id}`)}
                            >
                                <div className="project-header">
                                    <h3>{p.name}</h3>
                                    <span className={`badge ${p.visibility === 'PUBLIC' ? 'badge-success' : 'badge-warning'}`}>
                                        {p.visibility}
                                    </span>
                                </div>
                                {p.description && (
                                    <p className="project-description">{p.description}</p>
                                )}
                                <div className="project-meta">
                                    <span className="meta-item">👤 {p.ownerUsername}</span>
                                    <span className="meta-item">
                                        📅 {new Date(p.updatedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <div className="project-actions">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/projects/${p.id}`);
                                    }}
                                    className="btn-view"
                                >
                                    View
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(p.id);
                                    }}
                                    className="btn-delete"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
export default ProjectsList;