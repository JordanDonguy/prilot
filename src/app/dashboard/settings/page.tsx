"use client";

import { Github, Gitlab, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/Card";
import { ChangePasswordModal } from "@/components/ChangePasswordModal";
import { ConnectButton } from "@/components/ConnectButton";
import { useUser } from "@/contexts/UserContext";
import type { IOAuthProvider } from "@/types/user";

export default function UserSettingsPage() {
	const { user } = useUser();
	const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

	function handleConnect(provider: "github" | "gitlab") {
		toast.success(`${provider} account connected`);
	}

	// User object is guaranteed to be present due to route guard in layout.tsx
	if (!user) return null;

	// Check connected accounts
	const githubConnected = user.oauthProviders ? !!user.oauthProviders.find((account: IOAuthProvider) => account === "github") : false;
	const gitlabConnected = user.oauthProviders ? !!user.oauthProviders.find((account: IOAuthProvider) => account === "gitlab") : false;

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-3xl text-gray-900 dark:text-white mb-2">
					User settings
				</h1>
				<p className="text-gray-600 dark:text-gray-400">
					Manage your account and connected services.
				</p>
			</div>

			{/* Account info */}
			<Card className="bg-white/70 dark:bg-gray-800/70 shadow-sm">
				<CardHeader>
					<CardTitle>Account</CardTitle>
					<CardDescription>Your personal information</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex justify-between items-center">
						<span className="text-sm text-gray-600 dark:text-gray-400">
							Email
						</span>
						<span>{user.email}</span>
					</div>

					<div className="flex justify-between items-center">
						<span className="text-sm text-gray-600 dark:text-gray-400">
							Username
						</span>
						<span>{user.username}</span>
					</div>

					<div className="flex justify-between items-center">
						<span className="text-sm text-gray-600 dark:text-gray-400">
							Member since
						</span>
						<span>{new Date(user.createdAt).toLocaleDateString()}</span>
					</div>
				</CardContent>
			</Card>

			{/* Security */}
			<Card className="bg-white/70 dark:bg-gray-800/70 shadow-sm">
				<CardHeader className="pb-2">
					<CardTitle>Security</CardTitle>
					<CardDescription>Password & authentication</CardDescription>
				</CardHeader>
				<CardContent>
					<button
						type="button"
						onClick={() => setIsPasswordModalOpen(true)}
						className="flex justify-center items-center gap-2 w-full lg:w-[calc(50%-1rem)] h-10 rounded-lg bg-gray-900 text-white dark:bg-gray-100 dark:text-black hover:cursor-pointer hover:opacity-90"
					>
						<Lock size={16} />
						Change password
					</button>
				</CardContent>
			</Card>

			{/* Connected accounts */}
			<Card className="bg-white/70 dark:bg-gray-800/70 shadow-sm">
				<CardHeader className="pb-2">
					<CardTitle>Connected accounts</CardTitle>
					<CardDescription>Link external providers</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3 grid lg:grid-cols-2 gap-4 lg:gap-0 mt-4">
					<ConnectButton
						providerName="GitHub"
						connected={githubConnected}
						onConnect={() => handleConnect("github")}
						icon={<Github />}
						className="lg:pr-8 lg:border-r border-gray-500"
					/>

					<ConnectButton
						providerName="GitLab"
						connected={gitlabConnected}
						onConnect={() => handleConnect("gitlab")}
						icon={<Gitlab />}
						className="lg:ml-8"
					/>
				</CardContent>
			</Card>

			{/* Change password modal */}
			<ChangePasswordModal
				isOpen={isPasswordModalOpen}
				onClose={() => setIsPasswordModalOpen(false)}
			/>
		</div>
	);
}
