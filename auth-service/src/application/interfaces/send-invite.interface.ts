export interface SendInviteRequest {
  id: string;
  email: string;
}

export interface SendInviteResponse {
  success: boolean;
  token?: string;
  error?: string;
}
