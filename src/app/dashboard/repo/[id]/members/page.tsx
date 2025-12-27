"use client";

import { UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { AddMemberModal } from "@/components/AddMemberModal";
import { Badge } from "@/components/Badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/Card";
import { DeleteMemberModal } from "@/components/DeleteMemberModal";
import { MemberListItem } from "@/components/ListItem";

const mockRepo = {
	id: "1",
	name: "frontend-app",
	provider: "github",
	stars: 245,
	forks: 38,
	openPRs: 3,
	totalCommits: 1234,
};

const mockMembers = [
	{
		first_name: "Alice",
		last_name: "Johnson",
		role: "admin",
		email: "alice.johnson@example.com",
	},
	{
		first_name: "Bob",
		last_name: "Smith",
		role: "member",
		email: "bob.smith@example.com",
	},
	{
		first_name: "Charlie",
		last_name: "Brown",
		role: "member",
		email: "charlie.brown@example.com",
	},
	{
		first_name: "Diana",
		last_name: "Prince",
		role: "member",
		email: "diana.prince@example.com",
	},
];

export default function RepositoryPage() {
	const [members, setMembers] = useState(mockMembers);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [memberToDelete, setMemberToDelete] = useState<null | {
		first_name: string;
		last_name: string;
		email: string;
	}>(null);

	function handleConfirmDelete() {
		// mock delete action
		setMembers(members.filter((m) => m.email !== memberToDelete?.email));
		toast.success("Member removed successfully");
		setMemberToDelete(null);
	}

	function updateMemberRole(email: string, role: string) {
		setMembers(
			members.map((m) => (m.email === email ? { ...m, role: role } : m)),
		);
	}

	return (
		<div className="p-6 space-y-6">
			{/* Repository Header */}
			<div className="flex flex-col md:flex-row items-start justify-between">
				<div>
					<div className="flex items-center gap-3 mb-2">
						<h1 className="text-3xl text-gray-900 dark:text-white">
							Team Members
						</h1>
						<Badge>{mockRepo.provider}</Badge>
					</div>
					<p className="text-gray-600 dark:text-gray-400">
						Manage collaborators and permissions for this repository.
					</p>
				</div>
				<div className="grid grid-cols-2 md:flex gap-3 mt-4 md:mt-0 w-full md:w-fit">
					<button
						type="button"
						onClick={() => setIsModalOpen(true)}
						className="flex items-center justify-center w-full md:w-34 h-8 rounded-lg text-sm bg-gray-900 text-white dark:bg-gray-200 dark:text-black hover:bg-gray-700 hover:dark:bg-gray-400 hover:cursor-pointer group"
					>
						<UserPlus className="w-4 h-4 mr-2 group-hover:scale-125 duration-250" />
						Invite Member
					</button>
				</div>
			</div>

			{/* Members List */}
			<Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-sm">
				<CardHeader className="pb-2">
					<CardTitle>Current Members ({members.length})</CardTitle>
					<CardDescription>
						People with access to this repository
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{members.map((member) => (
							<MemberListItem
								key={member.email}
								member={member}
								updateMemberRole={updateMemberRole}
								onDelete={setMemberToDelete}
							/>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Modals */}
			<AddMemberModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onInvite={(email) => {
					toast.success(`Invitation sent to ${email}`);
					setIsModalOpen(false);
				}}
			/>

			<DeleteMemberModal
				member={memberToDelete}
				onClose={() => setMemberToDelete(null)}
				onConfirm={handleConfirmDelete}
			/>
		</div>
	);
}
