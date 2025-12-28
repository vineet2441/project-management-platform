import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { gitService, GitBranch, GitCloneRequest, GitBranchCreateRequest, GitPullRequest, GitPushRequest } from '../services/gitService';

interface GitState {
  branches: GitBranch[];
  loading: boolean;
  error: string | null;
}

const initialState: GitState = {
  branches: [],
  loading: false,
  error: null,
};

// Async thunks
export const cloneRepository = createAsyncThunk(
  'git/clone',
  async ({ projectId, data }: { projectId: number; data: GitCloneRequest }) => {
    await gitService.cloneRepository(projectId, data);
  }
);

export const fetchBranches = createAsyncThunk(
  'git/fetchBranches',
  async (projectId: number) => {
    return await gitService.getBranches(projectId);
  }
);

export const createBranch = createAsyncThunk(
  'git/createBranch',
  async ({ projectId, data }: { projectId: number; data: GitBranchCreateRequest }) => {
    await gitService.createBranch(projectId, data);
    return await gitService.getBranches(projectId);
  }
);

export const pullChanges = createAsyncThunk(
  'git/pull',
  async ({ projectId, data }: { projectId: number; data?: GitPullRequest }) => {
    await gitService.pull(projectId, data);
  }
);

export const pushChanges = createAsyncThunk(
  'git/push',
  async ({ projectId, data }: { projectId: number; data?: GitPushRequest }) => {
    await gitService.push(projectId, data);
  }
);

const gitSlice = createSlice({
  name: 'git',
  initialState,
  reducers: {
    clearGitState: (state) => {
      state.branches = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Clone repository
      .addCase(cloneRepository.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cloneRepository.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(cloneRepository.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to clone repository';
      })
      // Fetch branches
      .addCase(fetchBranches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBranches.fulfilled, (state, action: PayloadAction<GitBranch[]>) => {
        state.loading = false;
        state.branches = action.payload;
      })
      .addCase(fetchBranches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch branches';
      })
      // Create branch
      .addCase(createBranch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBranch.fulfilled, (state, action: PayloadAction<GitBranch[]>) => {
        state.loading = false;
        state.branches = action.payload;
      })
      .addCase(createBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create branch';
      })
      // Pull changes
      .addCase(pullChanges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(pullChanges.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(pullChanges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to pull changes';
      })
      // Push changes
      .addCase(pushChanges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(pushChanges.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(pushChanges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to push changes';
      });
  },
});

export const { clearGitState } = gitSlice.actions;
export default gitSlice.reducer;
