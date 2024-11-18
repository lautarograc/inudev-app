import { FetchTodosResponse, Todo } from '../interfaces/Todo.interface';
import axiosInstance from './axiosConfig';

export const fetchTodos = async (page: number, filters?: { [key: string]: string }): Promise<FetchTodosResponse> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());

    if (filters) {
        Object.keys(filters).forEach((key) => {
            if (filters[key]) {
                params.append(`q[${key}]`, filters[key]);
            }
        });
    }

    const response = await axiosInstance.get(`/todos?${params.toString()}`);
    return response.data;
};

export const fetchTodoChildren = async (id: number): Promise<Todo[]> => {
    const response = await axiosInstance.get(`/todos/${id}`);
    return response.data;
};

export const updateTodo = async (id: number, data: {
    name: string, description?: string, status?: string,
    due_date?: string
}): Promise<Todo> => {
    const response = await axiosInstance.put(`/todos/${id}`, data);
    return response.data;
};

export const createTodo = async (data: {
    name: string, parent_id: number | null, description?: string, status?: string,
    due_date?: string
}): Promise<Todo> => {
    const response = await axiosInstance.post('/todos', data);
    return response.data;
};

export const deleteTodo = async (id: number): Promise<{ success: boolean }> => {
    const response = await axiosInstance.delete(`/todos/${id}`);
    return response.data;
};
