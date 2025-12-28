import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { pullRequestService, PullRequest, CreatePullRequestRequest } from '../services/pullRequestService';

interface PullRequestsState {
  items: PullRequest[];
  loading: boolean;
  error: string | null;
}

const initialState: PullRequestsState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchPullRequests = createAsyncThunk(
  'pullRequests/fetch',
  async (projectId: number) => {
    return await pullRequestService.getPullRequests(projectId);
  }
);

export const createPullRequest = createAsyncThunk(
  'pullRequests/create',
  async ({ projectId, data }: { projectId: number; data: CreatePullRequestRequest }) => {
    return await pullRequestService.createPullRequest(projectId, data);
  }
);

export const mergePullRequest = createAsyncThunk(
  'pullRequests/merge',
  async ({ projectId, prId }: { projectId: number; prId: number }) => {
    return await pullRequestService.mergePullRequest(projectId, prId);
  }
);

export const closePullRequest = createAsyncThunk(
  'pullRequests/close',
  async ({ projectId, prId }: { projectId: number; prId: number }) => {
    return await pullRequestService.closePullRequest(projectId, prId);
  }
);

const pullRequestsSlice = createSlice({
  name: 'pullRequests',
  initialState,
  reducers: {
    clearPullRequests: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch pull requests
      .addCase(fetchPullRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPullRequests.fulfilled, (state, action: PayloadAction<PullRequest[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPullRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch pull requests';
      })
      // Create pull request
      .addCase(createPullRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPullRequest.fulfilled, (state, action: PayloadAction<PullRequest>) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createPullRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create pull request';
      })
      // Merge pull request
      .addCase(mergePullRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(mergePullRequest.fulfilled, (state, action: PayloadAction<PullRequest>) => {
        state.loading = false;
        const index = state.items.findIndex((pr) => pr.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(mergePullRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to merge pull request';
      })
      // Close pull request
      .addCase(closePullRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(closePullRequest.fulfilled, (state, action: PayloadAction<PullRequest>) => {
        state.loading = false;
        const index = state.items.findIndex((pr) => pr.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(closePullRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to close pull request';
      });
  },
});

export const { clearPullRequests } = pullRequestsSlice.actions;
export default pullRequestsSlice.reducer;
