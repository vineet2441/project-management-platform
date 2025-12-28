import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import projectsReducer from './projectsSlice';
import collaboratorsReducer from './collaboratorsSlice';
import pullRequestsReducer from './pullRequestsSlice';
import gitReducer from './gitSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
    collaborators: collaboratorsReducer,
    pullRequests: pullRequestsReducer,
    git: gitReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
