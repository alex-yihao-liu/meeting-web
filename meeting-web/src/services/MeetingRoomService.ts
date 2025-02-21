import { MeetingRoomViewModel, MeetingRoomCreateRequest, MeetingRoomUpdateRequest } from "./models/Models";
import { PagedResult } from "./UserService";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

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

// Meeting Room API
export const meetingRoomApi = {
  async getAll(page: number = 0, pageSize: number = 10): Promise<PagedResult<MeetingRoomViewModel>> {
    const response = await fetch(`${API_BASE}/meeting-room?page=${page}&pageSize=${pageSize}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return handleResponse(response);
  },

  async create(room: MeetingRoomCreateRequest): Promise<MeetingRoomViewModel> {
    const response = await fetch(`${API_BASE}/meeting-room`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(room),
    });
    return handleResponse(response);
  },

  async update(id: string, room: MeetingRoomUpdateRequest): Promise<void> {
    const response = await fetch(`${API_BASE}/meeting-room/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(room),
    });
    await handleResponse(response);
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/meeting-room/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    await handleResponse(response);
  },
};
