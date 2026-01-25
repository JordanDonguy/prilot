"use client";

import { UserPlus } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AddMemberModal } from "@/components/AddMemberModal";
import AnimatedSlide from "@/components/animations/AnimatedSlide";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/Card";
import { DeleteMemberModal } from "@/components/DeleteMemberModal";
import { MemberListItem } from "@/components/ListItem";
import { useUser } from "@/contexts/UserContext";
import { useRepository } from "@/hooks/useRepository";
import type { Member } from "@/types/members";

export default function RepositoryPage() {
	const params = useParams();
	const repoId = params.id as string;

	const { user } = useUser();
	const { repo } = useRepository(repoId);

	const [members, setMembers] = useState<Member[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
	const [loading, setLoading] = useState(true);

	const isUserAdmin = members.find((m) => m.id === user?.id)?.role === "owner";

	// Fetch members from API
	useEffect(() => {
		async function fetchMembers() {
			setLoading(true);
			try {
				const res = await fetch(`/api/repos/${repoId}/members`);

				if (!res.ok) throw new Error("Failed to fetch members");
				const data = await res.json();

				setMembers(
					data.members.map((m: Member) => ({
						...m,
						createdAt: new Date(m.createdAt),
					})),
				);
			} catch (err) {
				console.error(err);
				toast.error("Failed to load repository members");
			} finally {
				setLoading(false);
			}
		}

		fetchMembers();
	}, [repoId]);

	function handleConfirmDelete() {
		// Mock delete action
		setMembers(members.filter((m) => m.id !== memberToDelete?.id));
		toast.success("Member removed successfully");
		setMemberToDelete(null);
	}

	function updateMemberRole(id: string, role: string) {
		setMembers(members.map((m) => (m.id === id ? { ...m, role } : m)));
	}

	return (
		<div className="p-6 space-y-6">
			{/* Repository Header */}
			<div className="flex flex-col md:flex-row items-start justify-between">
				<AnimatedSlide x={-20} triggerOnView={false} className="space-y-3 mb-2">
					<div className="flex items-center gap-4">
						<h1 className="text-3xl text-gray-900 dark:text-white">
							Team Members
						</h1>
						<Badge className="h-fit">{repo.provider}</Badge>
					</div>
					<p className="text-gray-600 dark:text-gray-400">
						List of collaborators and their permissions for{" "}
						<strong>{repo.name.slice(0, 1).toUpperCase() + repo.name.slice(1)}{" "}</strong>
						repository.
					</p>
				</AnimatedSlide>
				{isUserAdmin && (
					<AnimatedSlide
						x={20}
						triggerOnView={false}
						className="grid grid-cols-2 md:flex gap-3 mt-4 md:mt-0 w-full md:w-fit"
					>
						<Button
							onClick={() => setIsModalOpen(true)}
							className="flex items-center justify-center w-full md:w-34 h-8 bg-gray-900 text-white dark:bg-gray-200 dark:text-black hover:bg-gray-700 hover:dark:bg-gray-400 hover:cursor-pointer group"
						>
							<UserPlus className="w-4 h-4 mr-2 group-hover:scale-125 duration-250" />
							Invite Member
						</Button>
					</AnimatedSlide>
				)}
			</div>

			{/* Members List */}
			<AnimatedSlide y={20} triggerOnView={false}>
				<Card className="bg-white/70 dark:bg-gray-800/25 border backdrop-blur-sm border-gray-200 dark:border-gray-800 shadow-lg">
					<CardHeader className="pb-2">
						<CardTitle>Current Members ({members.length})</CardTitle>
						<CardDescription>
							People with access to this repository
						</CardDescription>
					</CardHeader>
					<CardContent>
						{loading ? (
							<div className="block h-20 scale-95 rounded-lg bg-gray-100 dark:bg-zinc-950 border border-gray-200 dark:border-gray-700/70 animate-pulse"></div>
						) : (
							<div className="space-y-3">
								{members.map((member) => (
									<MemberListItem
										key={member.id}
										member={member}
										updateMemberRole={updateMemberRole}
										onDelete={setMemberToDelete}
										showDeleteButton={isUserAdmin}
									/>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</AnimatedSlide>

			{/* Modals */}
			<AddMemberModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				repoId={repoId}
			/>

			<DeleteMemberModal
				member={memberToDelete}
				onClose={() => setMemberToDelete(null)}
				onConfirm={handleConfirmDelete}
			/>
		</div>
	);
}
