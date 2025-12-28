import { api } from './authService';

export interface Collaborator {
  id: number;
  userId: number;
  username: string;
  role: 'OWNER' | 'MAINTAINER' | 'CONTRIBUTOR' | 'VIEWER';
  createdAt: string;
}

export interface AddCollaboratorRequest {
  username: string;
  role: 'MAINTAINER' | 'CONTRIBUTOR' | 'VIEWER';
}

export const collaboratorService = {
  // Get all collaborators for a project
  getCollaborators: async (projectId: number): Promise<Collaborator[]> => {
    const response = await api.get(`/api/projects/${projectId}/collaborators`);
    return response.data;
  },

  // Add a collaborator to a project
  addCollaborator: async (projectId: number, data: AddCollaboratorRequest): Promise<Collaborator> => {
    const response = await api.post(`/api/projects/${projectId}/collaborators`, data);
    return response.data;
  },

  // Remove a collaborator from a project
  removeCollaborator: async (projectId: number, collaboratorId: number): Promise<void> => {
    await api.delete(`/api/projects/${projectId}/collaborators/${collaboratorId}`);
  },
};
