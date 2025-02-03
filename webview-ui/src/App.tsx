import React, { useEffect } from "react"
import { ExtensionStateContextProvider, useExtensionState } from "./context/ExtensionStateContext"
import { AuthProvider, useAuth } from "./context/AuthContext"
import LoginView from "./components/login/LoginView"
import MainContent from "./components/MainContent"
import { vscode } from "./utils/vscode"

const AppContent: React.FC = () => {
	const { isAuthenticated, login } = useAuth()
	const { setPreferredLanguage } = useExtensionState()

	useEffect(() => {
		const handleMessage = (event: MessageEvent) => {
			const message = event.data

			if (message.type === "loginSuccess") {
				// Xử lý đăng nhập thành công
				const { token, user } = message
				login(token, user)
			}
		}

		window.addEventListener("message", handleMessage)
		return () => window.removeEventListener("message", handleMessage)
	}, [login])

	if (!isAuthenticated) {
		return <LoginView />
	}

	return (
		<div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
			<MainContent />
		</div>
	)
}

const App: React.FC = () => {
	return (
		<ExtensionStateContextProvider>
			<AuthProvider>
				<AppContent />
			</AuthProvider>
		</ExtensionStateContextProvider>
	)
}

export default App
