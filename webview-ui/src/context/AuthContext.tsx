import React, { createContext, useContext, useState, useEffect } from "react"
import { vscode } from "../utils/vscode"
import { AuthState, UserInfo, AUTH_STORAGE_KEY, USER_STORAGE_KEY } from "../../../src/shared/auth-constants"

interface AuthContextType extends AuthState {
	login: (token: string, user: UserInfo) => void
	logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [authState, setAuthState] = useState<AuthState>({
		isAuthenticated: false,
	})

	useEffect(() => {
		// Kiểm tra token khi component mount
		const token = localStorage.getItem(AUTH_STORAGE_KEY)
		const userStr = localStorage.getItem(USER_STORAGE_KEY)

		if (token && userStr) {
			try {
				const user = JSON.parse(userStr)
				setAuthState({
					isAuthenticated: true,
					token,
					user,
				})
			} catch (error) {
				console.error("Error parsing user info:", error)
			}
		}
	}, [])

	const login = (token: string, user: UserInfo) => {
		localStorage.setItem(AUTH_STORAGE_KEY, token)
		localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
		setAuthState({
			isAuthenticated: true,
			token,
			user,
		})
	}

	const logout = () => {
		localStorage.removeItem(AUTH_STORAGE_KEY)
		localStorage.removeItem(USER_STORAGE_KEY)
		setAuthState({
			isAuthenticated: false,
		})
		// Thông báo cho extension về việc logout
		vscode.postMessage({
			type: "logout",
		})
	}

	return <AuthContext.Provider value={{ ...authState, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider")
	}
	return context
}
