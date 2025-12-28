import { api } from './authService';

export interface GitBranch {
  name: string;
  current: boolean;
}

export interface GitCloneRequest {
  remoteUrl: string;
  branch?: string;
  auth?: {
    username: string;
    password: string;
  };
}

export interface GitBranchCreateRequest {
  branch: string;
}

export interface GitPullRequest {
  branch?: string;
  auth?: {
    username: string;
    password: string;
  };
}

export interface GitPushRequest {
  branch?: string;
  auth?: {
    username: string;
    password: string;
  };
}

export const gitService = {
  // Clone a repository
  cloneRepository: async (projectId: number, data: GitCloneRequest): Promise<void> => {
    await api.post(`/api/projects/${projectId}/git/clone`, data);
  },

  // Get all branches
  getBranches: async (projectId: number): Promise<GitBranch[]> => {
    const response = await api.get(`/api/projects/${projectId}/git/branches`);
    return response.data;
  },

  // Create a new branch
  createBranch: async (projectId: number, data: GitBranchCreateRequest): Promise<void> => {
    await api.post(`/api/projects/${projectId}/git/branches`, data);
  },

  // Pull changes
  pull: async (projectId: number, data: GitPullRequest = {}): Promise<void> => {
    await api.post(`/api/projects/${projectId}/git/pull`, data);
  },

  // Push changes
  push: async (projectId: number, data: GitPushRequest = {}): Promise<void> => {
    await api.post(`/api/projects/${projectId}/git/push`, data);
  },
};
