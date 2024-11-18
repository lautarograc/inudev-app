import axiosInstance from './axiosConfig';

export interface RegisterData {
    email_address: string;
    password: string;
    password_confirmation: string;
}

export interface LoginData {
    email_address: string;
    password: string;
}

export const registerUser = async (data: RegisterData) => {
    const response = await axiosInstance.post('/users/sign_up', data);
    return response.data;
};

export const loginUser = async (data: LoginData) => {
    const response = await axiosInstance.post('/sessions', data);
    return response.data;
};

