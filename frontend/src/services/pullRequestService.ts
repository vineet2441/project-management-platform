import { api } from './authService';

export interface PullRequest {
  id: number;
  projectId: number;
  sourceProjectId?: number;
  createdBy: number;
  createdByUsername: string;
  title: string;
  description: string;
  sourceBranch: string;
  targetBranch: string;
  status: 'OPEN' | 'MERGED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
}

export interface CreatePullRequestRequest {
  title: string;
  description: string;
  sourceBranch: string;
  targetBranch: string;
  sourceProjectId?: number;
}

export const pullRequestService = {
  // Get all pull requests for a project
  getPullRequests: async (projectId: number): Promise<PullRequest[]> => {
    const response = await api.get(`/api/projects/${projectId}/pull-requests`);
    return response.data;
  },

  // Create a new pull request
  createPullRequest: async (projectId: number, data: CreatePullRequestRequest): Promise<PullRequest> => {
    const response = await api.post(`/api/projects/${projectId}/pull-requests`, data);
    return response.data;
  },

  // Merge a pull request
  mergePullRequest: async (projectId: number, prId: number): Promise<PullRequest> => {
    const response = await api.post(`/api/projects/${projectId}/pull-requests/${prId}/merge`);
    return response.data;
  },

  // Close a pull request
  closePullRequest: async (projectId: number, prId: number): Promise<PullRequest> => {
    const response = await api.post(`/api/projects/${projectId}/pull-requests/${prId}/close`);
    return response.data;
  },
};
