export interface SendInviteRequest {
  email: string;
}

export interface SendInviteResponse {
  success: boolean;
  token?: string;
  error?: string;
}
