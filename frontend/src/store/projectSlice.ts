import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import projectService from '../services/projectService';

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

interface ProjectsState {
  items: Project[];
  selected: Project | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  items: [],
  selected: null,
  loading: false,
  error: null,
};

// Thunks
export const fetchProjects = createAsyncThunk('projects/fetchAll', async (_, thunkAPI) => {
  try {
    return await projectService.getAllProjects();
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to load projects');
  }
});

export const fetchProject = createAsyncThunk('projects/fetchOne', async (id: number, thunkAPI) => {
  try {
    return await projectService.getProject(id);
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to load project');
  }
});

export const createProject = createAsyncThunk(
  'projects/create',
  async (data: { name: string; description: string }, thunkAPI) => {
    try {
      return await projectService.createProject(data);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to create project');
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/update',
  async ({ id, data }: { id: number; data: { name: string; description: string } }, thunkAPI) => {
    try {
      return await projectService.updateProject(id, data);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to update project');
    }
  }
);

export const deleteProject = createAsyncThunk('projects/delete', async (id: number, thunkAPI) => {
  try {
    await projectService.deleteProject(id);
    return id;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to delete project');
  }
});

// Slice
const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearSelected: (state) => {
      state.selected = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchProjects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action: PayloadAction<Project[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to load projects';
      })
      // fetchProject
      .addCase(fetchProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(fetchProject.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to load project';
      })
      // createProject
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to create project';
      })
      // updateProject
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.loading = false;
        state.items = state.items.map((p) => (p.id === action.payload.id ? action.payload : p));
        if (state.selected?.id === action.payload.id) {
          state.selected = action.payload;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to update project';
      })
      // deleteProject
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.items = state.items.filter((p) => p.id !== action.payload);
        if (state.selected?.id === action.payload) {
          state.selected = null;
        }
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to delete project';
      });
  },
});

export const { clearSelected, clearError } = projectsSlice.actions;
export default projectsSlice.reducer;