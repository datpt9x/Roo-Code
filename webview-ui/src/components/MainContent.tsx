import React, { useState, useCallback } from "react"
import { useEvent } from "react-use"
import { ExtensionMessage } from "../../../src/shared/ExtensionMessage"
import ChatView from "./chat/ChatView"
import HistoryView from "./history/HistoryView"
import SettingsView from "./settings/SettingsView"
import WelcomeView from "./welcome/WelcomeView"
import McpView from "./mcp/McpView"
import PromptsView from "./prompts/PromptsView"
import { useExtensionState } from "../context/ExtensionStateContext"
import { vscode } from "../utils/vscode"

const MainContent: React.FC = () => {
	const { didHydrateState, showWelcome, shouldShowAnnouncement } = useExtensionState()
	const [showSettings, setShowSettings] = useState(false)
	const [showHistory, setShowHistory] = useState(false)
	const [showMcp, setShowMcp] = useState(false)
	const [showPrompts, setShowPrompts] = useState(false)
	const [showAnnouncement, setShowAnnouncement] = useState(false)

	const handleMessage = useCallback((e: MessageEvent) => {
		const message: ExtensionMessage = e.data
		switch (message.type) {
			case "action":
				switch (message.action!) {
					case "settingsButtonClicked":
						setShowSettings(true)
						setShowHistory(false)
						setShowMcp(false)
						setShowPrompts(false)
						break
					case "historyButtonClicked":
						setShowSettings(false)
						setShowHistory(true)
						setShowMcp(false)
						setShowPrompts(false)
						break
					case "mcpButtonClicked":
						setShowSettings(false)
						setShowHistory(false)
						setShowMcp(true)
						setShowPrompts(false)
						break
					case "promptsButtonClicked":
						setShowSettings(false)
						setShowHistory(false)
						setShowMcp(false)
						setShowPrompts(true)
						break
					case "chatButtonClicked":
						setShowSettings(false)
						setShowHistory(false)
						setShowMcp(false)
						setShowPrompts(false)
						break
				}
				break
		}
	}, [])

	useEvent("message", handleMessage)

	if (!didHydrateState) {
		return null
	}

	return (
		<>
			{showWelcome ? (
				<WelcomeView />
			) : (
				<>
					{showSettings && <SettingsView onDone={() => setShowSettings(false)} />}
					{showHistory && <HistoryView onDone={() => setShowHistory(false)} />}
					{showMcp && <McpView onDone={() => setShowMcp(false)} />}
					{showPrompts && <PromptsView onDone={() => setShowPrompts(false)} />}
					<ChatView
						showHistoryView={() => {
							setShowSettings(false)
							setShowMcp(false)
							setShowPrompts(false)
							setShowHistory(true)
						}}
						isHidden={showSettings || showHistory || showMcp || showPrompts}
						showAnnouncement={showAnnouncement}
						hideAnnouncement={() => {
							setShowAnnouncement(false)
						}}
					/>
				</>
			)}
		</>
	)
}

export default MainContent
