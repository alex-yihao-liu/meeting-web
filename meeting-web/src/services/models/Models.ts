export interface UserViewModel {
    id: string;
    username: string;
    displayName: string;
    email: string;
  }
  
  export interface UserCreateRequest {
    username: string;
    displayName: string;
    email: string;
  }
  
  export interface UserUpdateRequest extends Partial<UserCreateRequest> {
    id: string;
  }
  
  export interface MeetingViewModel {
    id: string;
    name: string;
    creatorId: string;
    startTime: Date; 
    endTime: Date;
    description?: string;
    participants: string[];
    meetingRoomId?: string;
    createdTime: Date; 
  }
  
  export interface MeetingCreateRequest {
    name: string;
    creatorId: string;
    startTime: string;
    endTime: string;
    description?: string;
    participants: string[];
    meetingRoomId?: string;
  }
  
  export type MeetingUpdateRequest = Partial<MeetingCreateRequest> & { id: string };

  export interface MeetingRoomViewModel {
    id: string;
    name: string;
    description: string;
  }

  export interface MeetingRoomCreateRequest {
    name: string;
    description: string;
  }

  export type MeetingRoomUpdateRequest = Partial<MeetingRoomCreateRequest> & { id: string };

  export interface LoginResponse {
    token: string;
    username: string;
    displayName: string;
    email: string;
    expiresAt: string;
  }

  export interface LoginRequest {
    username: string;
    password: string;
  }