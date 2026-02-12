import axios from 'axios';

//interface for the USER db table

export interface User{
    id: number;
    name: string;
    email: string;
}

//export interface for the TRANSACTION db table
export interface Transaction{
    id: number;
    user_id: number;
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description?: string;
    date: string; // ISO format date string
}

export interface SignupData{
    username: string;
    email: string;
    password: string;
}

export interface LoginData{
    email: string;
    password: string;
}

export interface AuthResponse{
    token: string;
    user: User;
}


export interface CreateTransactionData{
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description?: string;
    date: string; 
}


const API_BASE_URL = 'https://clarity-expense-tracker-production-fe4f.up.railway.app/api';


const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

apiClient.interceptors.request.use(
    (config)=>{
        const token = localStorage.getItem('token');
        if(token){
            config.headers['Authorization'] = `Bearer ${token}`;
        }
         return config;
    },
    (error)=>
    {
        return Promise.reject(error);
    }
)

// Response interceptor for better error logging
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        return Promise.reject(error);
    }
)


export const authAPI = {
    signup: async (data: SignupData): Promise<AuthResponse> => {
        // Backend expects 'name' but frontend uses 'username'
        const payload = {
            name: data.username,
            email: data.email,
            password: data.password
        };
        console.log('API - Sending signup request:', { ...payload, password: '***' });
        const response = await apiClient.post('/auth/signup', payload);
        console.log('API - Signup response:', response.data);
        return response.data;
    },
    login: async (data: LoginData): Promise<AuthResponse> => {
        const response = await apiClient.post('/auth/login', data);
        return response.data;
    },
};


export const transactionAPI = {
    getAll: async(filter?: {type?: 'income' | 'expense',
                  category?: string, 
                  startDate?: string, 
                  endDate?: string}): Promise<Transaction[]> => {

                    const response = await apiClient.get<{count: number, transactions: Transaction[]}>('/transactions', {params: filter});

                    return response.data.transactions;
                  },

    getById: async (id: number): Promise<Transaction> => {
        const response = await apiClient.get<Transaction>(`/transactions/${id}`);
        return response.data;
    },

    create: async (data: CreateTransactionData): Promise<Transaction> => {
        const response = await apiClient.post<{message: string, transaction: Transaction}>('/transactions', data);
        return response.data.transaction;
    },

    update: async (id: number, data: Partial<CreateTransactionData>): Promise<Transaction> => {
        const response = await apiClient.put<{message: string, transaction: Transaction}>(`/transactions/${id}`, data);
        return response.data.transaction;
    },
    delete: async (id: number): Promise<void> => {  
        const response = await apiClient.delete(`/transactions/${id}`);
        return response.data;
    }
}