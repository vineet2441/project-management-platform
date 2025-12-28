import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use((config)=> {
    const token= localStorage.getItem('token');
    if(token){
        config.headers.Authorization=`Bearer ${token}`;
    }
    return config;
});

export interface LoginRequest{
    username: string;
    password: string;
}
export interface RegisterRequest{
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;

}
export interface AuthResponse{
    token: string;
    type: string;
    id: number;
    username: string;
    email: string;
    role: string;
}

const authService={
    login: async (credentials: LoginRequest): Promise<AuthResponse>=>{
        const response = await api.post<AuthResponse>('/api/auth/login',credentials);
        if(response.data.token){
            localStorage.setItem('token',response.data.token);
            localStorage.setItem('user',JSON.stringify(response.data));
        }
        return response.data;

    },
    register: async (userData: RegisterRequest): Promise<AuthResponse>=>{
        const response= await api.post<AuthResponse>('/api/auth/register',userData);
        if(response.data.token){
            localStorage.setItem('token',response.data.token);
            localStorage.setItem('user',JSON.stringify(response.data));
        }
        return response.data;
    },
    logout:(): void=>{
        localStorage.removeItem('token');
        localStorage.removeItem('user');

    },
    getToken:(): string | null=>{
        return localStorage.getItem('token');
    },
    isAuthenticated:(): boolean=>{
        return !!localStorage.getItem('token');
    },
};

export default authService;