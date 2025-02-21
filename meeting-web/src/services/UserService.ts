import { MeetingViewModel, UserCreateRequest, UserUpdateRequest, UserViewModel } from "./models/Models";

// src/api/client.ts
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || response.statusText);
  }
  if(response.status === 204){
    return null as T;
  }
  return response.json();
}

// User API
export const userApi = {
  async getAll(page: number = 0, pageSize: number = 10): Promise<PagedResult<UserViewModel>> {
    const response = await fetch(`${API_BASE}/user?page=${page}&pageSize=${pageSize}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return handleResponse(response);
  },

  async create(user: UserCreateRequest): Promise<UserViewModel> {
    const response = await fetch(`${API_BASE}/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(user),
    });
    return handleResponse(response);
  },

  async update(id: string, user: UserUpdateRequest): Promise<void> {
    const response = await fetch(`${API_BASE}/user/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(user),
    });
    await handleResponse(response);
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/user/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    await handleResponse(response);
  },
};
