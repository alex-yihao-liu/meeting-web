import { MeetingViewModel, UserCreateRequest, UserUpdateRequest, UserViewModel, BookMeetingRequest } from "./models/Models";

// src/api/client.ts
const API_BASE = import.meta.env.VITE_API_BASE_URL;


async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || response.statusText);
  }
  return response.json();
}

// User API
export const userApi = {
  async getAll(): Promise<UserViewModel[]> {
    const response = await fetch(`${API_BASE}/user`);
    return handleResponse(response);
  },

  async create(user: UserCreateRequest): Promise<UserViewModel> {
    const response = await fetch(`${API_BASE}/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
      },
      body: JSON.stringify(user),
    });
    await handleResponse(response);
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/user/${id}`, {
      method: 'DELETE',
    });
    await handleResponse(response);
  },
};

// Meeting API
export const meetingApi = {
  async getAll(): Promise<MeetingViewModel[]> {
    const response = await fetch(`${API_BASE}/meeting`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return handleResponse(response);
  },

  async bookMeeting(meeting: BookMeetingRequest): Promise<MeetingViewModel> {
    const response = await fetch(`${API_BASE}/meeting`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(meeting),
    });
    return handleResponse(response);
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/meeting/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    await handleResponse(response);
  },
};