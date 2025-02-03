export const AUTH_STORAGE_KEY = "dmobin_auth_token"
export const USER_STORAGE_KEY = "dmobin_user_info"

export interface UserInfo {
	id: string
	username: string
	email: string
	avatar?: string
}

export interface AuthState {
	isAuthenticated: boolean
	token?: string
	user?: UserInfo
}
