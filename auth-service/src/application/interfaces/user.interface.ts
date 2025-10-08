export interface IncomingRequest {
  id: string;
  email: string;
  role: string;
}

export interface SendInviteResponse {
  success: boolean;
  token?: string;
  error?: string;
}
