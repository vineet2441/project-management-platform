import { api } from './authService';
const API_URL = '/api/projects';

export interface Project {
  id: number;
  name: string;
  description: string;
  ownerId: number;
  ownerUsername: string;
  visibility: 'PUBLIC' | 'PRIVATE';
  createdAt: string;
  updatedAt: string;
    forkedFromId?: number;
}

//get all projects
export const getAllProjects= async()=>{
    const response =await api.get(API_URL);
    return response.data;
};

//get single project
export const getProject= async(id:number)=>{
    const response=await api.get(`${API_URL}/${id}`);
    return response.data;
};

//create project
export const createProject = async (projectData: { name: string; description: string; visibility?: 'PUBLIC' | 'PRIVATE' }) => {
    const response = await api.post(API_URL, projectData);
    return response.data;
};

//update project
export const updateProject = async (id: number, projectData: { name: string; description: string }) => {
    const response = await api.put(`${API_URL}/${id}`, projectData);
    return response.data;
};

//delete project
export const deleteProject = async (id: number) => {
    await api.delete(`${API_URL}/${id}`);
};

// Set project visibility
export const setVisibility = async (id: number, visibility: 'PUBLIC' | 'PRIVATE'): Promise<Project> => {
    const response = await api.post(`${API_URL}/${id}/visibility`, { visibility });
    return response.data;
};

// Get public projects
export const getPublicProjects = async (): Promise<Project[]> => {
    const response = await api.get('/api/public/projects');
    return response.data;
};

export const getPublicProject = async (id: number): Promise<Project> => {
    const response = await api.get(`/api/public/projects/${id}`);
    return response.data;
};

// Fork a public project
export const forkProject = async (id: number): Promise<Project> => {
    const response = await api.post(`${API_URL}/${id}/fork`);
    return response.data;
};

// Save project code
export const saveProjectCode = async (id: number, code: string): Promise<void> => {
    await api.post(`${API_URL}/${id}/code`, { code });
};

// Get project code
export const getProjectCode = async (id: number): Promise<string> => {
    const response = await api.get(`${API_URL}/${id}/code`);
    return response.data.code || '';
};

const projectService={
    getAllProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    setVisibility,
    getPublicProjects,
    getPublicProject,
    forkProject,
    saveProjectCode,
    getProjectCode,
};
export default projectService;