import { ChevronDown, LogOut, User } from "lucide-react";

const ProfileDropdown = ({
	isOpen,
	onToggle,
	onLogout,
	avatar,
	name = "User",
	email,
}) => {
	const initials = name.charAt(0).toUpperCase();

	return (
		<div className="relative">
			<button
				type="button"
				onClick={onToggle}
				className="flex items-center gap-2 rounded-lg p-1.5 text-left hover:bg-gray-100"
				aria-expanded={isOpen}
				aria-haspopup="menu"
			>
				{avatar ? (
					<img
						src={avatar}
						alt={`${name}'s avatar`}
						className="h-9 w-9 rounded-full object-cover"
					/>
				) : (
					<span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 font-medium text-white">
						{initials}
					</span>
				)}
				<span className="hidden max-w-32 truncate text-sm font-medium text-gray-700 xl:block">
					{name}
				</span>
				<ChevronDown className="h-4 w-4 text-gray-500" />
			</button>

			{isOpen && (
				<div
					className="absolute right-0 z-20 mt-2 w-64 rounded-lg border border-gray-200 bg-white p-2 shadow-lg"
					role="menu"
				>
					<div className="flex items-center gap-3 border-b border-gray-100 px-3 py-2">
						<User className="h-4 w-4 text-gray-400" />
						<div className="min-w-0">
							<p className="truncate text-sm font-medium text-gray-900">
								{name}
							</p>
							<p className="truncate text-xs text-gray-500">
								{email}
							</p>
						</div>
					</div>
					<a
						href="/profile"
						className="mt-1 block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
						role="menuitem"
					>
						Profile
					</a>
					<a
						href="/dashboard"
						className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
						role="menuitem"
					>
						Dashboard
					</a>
					<button
						type="button"
						onClick={onLogout}
						className="mt-1 flex w-full items-center gap-2 rounded-md border-t border-gray-100 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
						role="menuitem"
					>
						<LogOut className="h-4 w-4" />
						<span>Sign out</span>
					</button>
				</div>
			)}
		</div>
	);
};

export default ProfileDropdown;
