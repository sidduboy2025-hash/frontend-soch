import apiClient from './index';
import Cookies from 'js-cookie';

// Auth API types
export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  createdAt: string;
}











export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

// Models API types
export interface Model {
  _id: string;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription?: string;
  category: string;
  provider: string;
  pricing: 'free' | 'freemium' | 'paid';
  rating: number;
  reviewsCount: number;
  installsCount?: number;
  capabilities: ('text' | 'image' | 'audio' | 'video' | 'code' | 'agent')[];
  isApiAvailable: boolean;
  isOpenSource: boolean;
  modelType?: string;
  externalUrl?: string;
  iconUrl?: string;
  screenshots?: string[];
  tags: string[];
  bestFor?: string[];
  features?: string[];
  examplePrompts?: string[];
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  featured?: boolean;
  trendingScore?: number;
  uploadedBy: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ModelsResponse {
  success: boolean;
  data: {
    models: Model[];
    count: number;
  };
}

export interface ModelUploadData {
  name: string;
  shortDescription: string;
  longDescription?: string;
  category: string;
  provider: string;
  pricing: 'free' | 'freemium' | 'paid';
  modelType?: string;
  externalUrl?: string;
  isApiAvailable: boolean;
  isOpenSource: boolean;
  tags: string[];
  capabilities: string[];
  bestFor: string[];
  features: string[];
  examplePrompts: string[];
}

export interface ModelUploadResponse {
  success: boolean;
  message: string;
  data: {
    model: {
      id: string;
      name: string;
      slug: string;
      shortDescription: string;
      category: string;
      provider: string;
      status: string;
      createdAt: string;
    };
  };
}

// Authentication API methods
export const authAPI = {
  // Signup method
  signup: async (data: SignupData): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post('/api/auth/signup', data);
      
      // Store token and user data in cookies if login successful
      if (response.data.success && response.data.data.token) {
        Cookies.set('authToken', response.data.data.token, { expires: 7 }); // 7 days
        Cookies.set('userData', JSON.stringify(response.data.data.user), { expires: 7 });
      }
      
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Signup failed. Please try again.'
      );
    }
  },

  // Login method
  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post('/api/auth/login', data);
      
      // Store token and user data in cookies if login successful
      if (response.data.success && response.data.data.token) {
        Cookies.set('authToken', response.data.data.token, { expires: 7 }); // 7 days
        Cookies.set('userData', JSON.stringify(response.data.data.user), { expires: 7 });
      }
      
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Login failed. Please check your credentials.'
      );
    }
  },

  // Logout method
  logout: (): void => {
    Cookies.remove('authToken');
    Cookies.remove('userData');
    window.location.href = '/login';
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!Cookies.get('authToken');
  },

  // Get stored token
  getToken: (): string | null => {
    return Cookies.get('authToken') || null;
  },

  // Get current user data
  getCurrentUser: (): User | null => {
    const userData = Cookies.get('userData');
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  }
};

export interface AllModelsResponse {
  success: boolean;
  data: {
    models: Model[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalModels: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

// Models API methods
export const modelsAPI = {
  // Get all approved models (public)
  getAllModels: async (params?: {
    category?: string;
    pricing?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<AllModelsResponse> => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.category && params.category !== 'all') {
        queryParams.append('category', params.category);
      }
      if (params?.pricing && params.pricing !== 'all') {
        queryParams.append('pricing', params.pricing);
      }
      if (params?.search) {
        queryParams.append('search', params.search);
      }
      if (params?.page) {
        queryParams.append('page', params.page.toString());
      }
      if (params?.limit) {
        queryParams.append('limit', params.limit.toString());
      }

      const url = `/api/models${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get(url);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch models.'
      );
    }
  },

  // Get user's uploaded models
  getUserModels: async (): Promise<ModelsResponse> => {
    try {
      const response = await apiClient.get('/api/models/my-models');
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch user models.'
      );
    }
  },

  // Get a single model by ID or slug
  getModelById: async (id: string): Promise<{success: boolean; data: {model: Model}}> => {
    try {
      const response = await apiClient.get(`/api/models/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch model details.'
      );
    }
  },

  // Upload a new model
  uploadModel: async (data: ModelUploadData): Promise<ModelUploadResponse> => {
    try {
      const response = await apiClient.post('/api/models', data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.errors?.join(', ') ||
        error.message || 
        'Failed to upload model.'
      );
    }
  }
};

// Admin API methods
export const adminAPI = {
  // Get all pending models
  getPendingModels: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<AllModelsResponse> => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) {
        queryParams.append('page', params.page.toString());
      }
      if (params?.limit) {
        queryParams.append('limit', params.limit.toString());
      }

      const url = `/api/models/admin/pending${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get(url);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch pending models.'
      );
    }
  },

  // Update model status
  updateModelStatus: async (
    modelId: string, 
    status: 'approved' | 'rejected' | 'pending', 
    rejectionReason?: string
  ): Promise<{success: boolean; message: string; data: {model: Model}}> => {
    try {
      const response = await apiClient.put(`/api/models/admin/${modelId}/status`, {
        status,
        rejectionReason
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to update model status.'
      );
    }
  },

  // Get all models (any status)
  getAllModelsAdmin: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<AllModelsResponse> => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.status && params.status !== 'all') {
        queryParams.append('status', params.status);
      }
      if (params?.page) {
        queryParams.append('page', params.page.toString());
      }
      if (params?.limit) {
        queryParams.append('limit', params.limit.toString());
      }

      const url = `/api/models/admin/all${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get(url);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch admin models.'
      );
    }
  }
};