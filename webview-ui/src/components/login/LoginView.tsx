import React, { useState } from "react"
import { VSCodeButton, VSCodeTextField, VSCodeProgressRing } from "@vscode/webview-ui-toolkit/react"
import { useAuth } from "../../context/AuthContext"
import { vscode } from "../../utils/vscode"

const API_TOKEN = "Oh2Kc8t8tvdPvANEb24DWbETOsvjDx"
const API_URL = "https://dconnect.dmobin.studio/auth/login_external"

const LoginView: React.FC = () => {
	const { login } = useAuth()
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState("")

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault()
		setError("")
		setIsLoading(true)

		try {
			// Xử lý fake data cho tài khoản admin
			if (email === "admin" && password === "admin") {
				// Gửi thông tin đăng nhập thành công đến extension
				vscode.postMessage({
					type: "login",
					username: email,
					password: password,
				})

				// Cập nhật trạng thái đăng nhập trong AuthContext với fake data
				login("fake_token_123", {
					id: "1",
					username: "Administrator",
					email: "admin@example.com",
					avatar: undefined,
				})

				setIsLoading(false)
				return
			}

			// Comment phần gọi server để xử lý sau
			/*
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password,
                    api_token: API_TOKEN
                })
            });

            let data;
            try {
                const textResponse = await response.text();
                try {
                    data = JSON.parse(textResponse);
                } catch (parseError) {
                    console.error('Response không phải JSON hợp lệ:', textResponse);
                    throw new Error('Lỗi kết nối đến server. Vui lòng thử lại sau.');
                }
            } catch (error) {
                throw new Error('Không thể đọc response từ server');
            }

            if (!response.ok) {
                throw new Error(data.message || 'Đăng nhập thất bại');
            }

            if (!data.token || !data.user) {
                throw new Error('Response không hợp lệ từ server');
            }

            // Gửi thông tin đăng nhập thành công đến extension
            vscode.postMessage({
                type: 'login',
                username: email,
                password: password
            });

            // Cập nhật trạng thái đăng nhập trong AuthContext
            login(data.token, {
                id: data.user.id,
                username: data.user.username,
                email: data.user.email,
                avatar: data.user.avatar
            });
            */

			// Nếu không phải tài khoản admin thì báo lỗi
			throw new Error("Tài khoản hoặc mật khẩu không đúng")
		} catch (err) {
			console.error("Login error:", err)
			setError(err instanceof Error ? err.message : "Đăng nhập thất bại. Vui lòng thử lại.")
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				height: "100vh",
				padding: "20px",
			}}>
			<div
				style={{
					maxWidth: "400px",
					width: "100%",
					padding: "20px",
					borderRadius: "8px",
					backgroundColor: "var(--vscode-editor-background)",
					border: "1px solid var(--vscode-input-border)",
				}}>
				<h2
					style={{
						color: "var(--vscode-foreground)",
						marginBottom: "20px",
						textAlign: "center",
					}}>
					Login to Dmobin
				</h2>

				<form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
					<VSCodeTextField
						value={email}
						onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
						placeholder="Username"
						required
					/>

					<VSCodeTextField
						type="password"
						value={password}
						onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
						placeholder="Password"
						required
					/>

					{error && (
						<div style={{ color: "var(--vscode-errorForeground)", marginBottom: "10px" }}>{error}</div>
					)}

					<VSCodeButton type="submit" disabled={isLoading} style={{ width: "100%" }}>
						{isLoading ? <VSCodeProgressRing /> : "Login"}
					</VSCodeButton>
				</form>
			</div>
		</div>
	)
}

export default LoginView
