import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { collaboratorService, Collaborator, AddCollaboratorRequest } from '../services/collaboratorService';

interface CollaboratorsState {
  items: Collaborator[];
  loading: boolean;
  error: string | null;
}

const initialState: CollaboratorsState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchCollaborators = createAsyncThunk(
  'collaborators/fetch',
  async (projectId: number) => {
    return await collaboratorService.getCollaborators(projectId);
  }
);

export const addCollaborator = createAsyncThunk(
  'collaborators/add',
  async ({ projectId, data }: { projectId: number; data: AddCollaboratorRequest }) => {
    return await collaboratorService.addCollaborator(projectId, data);
  }
);

export const removeCollaborator = createAsyncThunk(
  'collaborators/remove',
  async ({ projectId, collaboratorId }: { projectId: number; collaboratorId: number }) => {
    await collaboratorService.removeCollaborator(projectId, collaboratorId);
    return collaboratorId;
  }
);

const collaboratorsSlice = createSlice({
  name: 'collaborators',
  initialState,
  reducers: {
    clearCollaborators: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch collaborators
      .addCase(fetchCollaborators.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCollaborators.fulfilled, (state, action: PayloadAction<Collaborator[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCollaborators.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch collaborators';
      })
      // Add collaborator
      .addCase(addCollaborator.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCollaborator.fulfilled, (state, action: PayloadAction<Collaborator>) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addCollaborator.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add collaborator';
      })
      // Remove collaborator
      .addCase(removeCollaborator.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCollaborator.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.items = state.items.filter((c) => c.id !== action.payload);
      })
      .addCase(removeCollaborator.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to remove collaborator';
      });
  },
});

export const { clearCollaborators } = collaboratorsSlice.actions;
export default collaboratorsSlice.reducer;
