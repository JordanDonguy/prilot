"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { toast } from "react-toastify";
import AnimatedOpacity from "@/components/animations/AnimatedOpacity";
import AnimatedScale from "@/components/animations/AnimatedScale";
import { Button } from "@/components/Button";
import { Card, CardContent, CardHeader } from "@/components/Card";
import { useUser } from "@/contexts/UserContext";

type InvitationActionPageProps = {
	title: string;
	apiEndpoint: string;
	successMessage: string;
	loadingMessage?: string;
	notLoggedInMessage: ReactNode;
};

export function InvitationActionPage({
	title,
	apiEndpoint,
	successMessage,
	loadingMessage = "Processing invitation…",
	notLoggedInMessage,
}: InvitationActionPageProps) {
	const { token } = useParams<{ token: string }>();
	const router = useRouter();
	const { user, loading: sessionLoading } = useUser();
	const [submitting, setSubmitting] = useState(false);

	// ---- Safety: missing token ----
	useEffect(() => {
		if (!token) {
			toast.info("Invitation link is invalid");
			router.replace("/dashboard");
		}
	}, [token, router]);

	// ---- Perform action when logged in ----
	useEffect(() => {
		if (!token || sessionLoading || !user) return;

		const handleInvitation = async () => {
			setSubmitting(true);

			try {
				const res = await fetch(apiEndpoint, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ token }),
				});

				if (!res.ok) {
					const data = await res.json();
					let toastMessage = "Invitation not found or has expired";

					switch (res.status) {
						case 400:
							toastMessage = "This invitation is no longer valid";
							break;
						case 403:
							toastMessage =
								"This invitation was sent to another email address";
							break;
						case 404:
							toastMessage = "Invitation not found or already handled";
							break;
						default:
							toastMessage = data?.error?.message ?? toastMessage;
					}

					toast.info(toastMessage);
					router.replace("/dashboard");
					return;
				}

				toast.success(successMessage);
				router.replace("/dashboard");
			} catch (err) {
				console.error(err);
				toast.error("Something went wrong while processing the invitation");
			} finally {
				setSubmitting(false);
			}
		};

		handleInvitation();
	}, [token, user, sessionLoading, apiEndpoint, successMessage, router]);

	// ---- Loading ----
	if (sessionLoading || submitting) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<AnimatedOpacity>
					<p className="text-2xl animate-pulse">{loadingMessage}</p>
				</AnimatedOpacity>
			</div>
		);
	}

	// ---- Not logged in ----
	if (!user) {
		return (
			<div className="flex items-center justify-center min-h-screen p-6">
				<AnimatedScale scale={0.9} triggerOnView={false}>
					<Card className="max-w-md w-full bg-white/70 dark:bg-gray-700/25 backdrop-blur-sm border border-gray-200 dark:border-gray-800 shadow-lg">
						<CardHeader className="flex flex-col gap-4 items-center pb-6 pt-4">
							<Image
								src="/logo.png"
								alt="PRilot logo"
								width={50}
								height={50}
								className="self-center dark:border border-gray-400 rounded-lg"
							/>
							<h1 className="text-2xl">{title}</h1>
						</CardHeader>
						<CardContent className="space-y-8">
							<p className="text-gray-600 dark:text-gray-400 text-lg">
								{notLoggedInMessage}
							</p>

							<Button
								className="w-full text-lg animate-bounce bg-gray-900 dark:bg-gray-100 text-white dark:text-black hover:opacity-80 transition"
								onClick={() => router.push("/login")}
							>
								Go to login
							</Button>
						</CardContent>
					</Card>
				</AnimatedScale>
			</div>
		);
	}

	return null;
}
