"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
	const pathname = usePathname() as any;
	const linkClass = "text-sm hover:bg-gray-100 dark:hover:bg-black-200 px-2 py-2 w-full transition-colors";
	const activeLinkClass = "bg-brand-500 text-white dark:hover:bg-brand-500 transition-colors";
	const subMenuLinkClass = "text-sm px-2 py-1 hover:text-brand-500 border-l-4 border-transparent hover:!border-brand-500 transition-colors";
	const activeSubMenuLinkClass = "font-bold text-brand-500 transition-colors";

	return (
		<div className="dark:bg-black dark:text-white flex flex-col w-[160px] h-screen py-2 z-10 fixed top-[32px] left-0">
			{/* Dashboard Section */}
			<Link href="/admin" className={`${linkClass} ${pathname === "/admin" ? activeLinkClass : ""}`}>
				Dashboard
			</Link>
			{pathname === "/admin" && (
				<div className="dark:bg-black-100 flex flex-col py-2">
					<Link href="/admin" className={`${subMenuLinkClass} ${pathname === "/admin" ? activeSubMenuLinkClass : ""}`}>
						Dashboard
					</Link>

					<Link href="/admin/updates" className={`${subMenuLinkClass} ${pathname === "/admin/updates" ? activeSubMenuLinkClass : ""}`}>
						Updates
					</Link>
				</div>
			)}

			{/* Services Section */}
			<Link href="/admin/services" className={`${linkClass} ${pathname === "/admin/services" ? activeLinkClass : ""}`}>
				Services
			</Link>
			{pathname === "/admin/services" && (
				<div className="dark:bg-black-100 flex flex-col py-2">
					<Link href="/admin/services" className={`${subMenuLinkClass} ${pathname === "/admin/services" ? activeSubMenuLinkClass : ""}`}>
						All Services
					</Link>

					<Link href="/admin/services/new" className={`${subMenuLinkClass} ${pathname === "/admin/services/new" ? activeSubMenuLinkClass : ""}`}>
						Add New
					</Link>
				</div>
			)}

			{/* Expert Tips Section */}
			<Link href="/admin/expert-tips" className={`${linkClass} ${pathname.includes("/admin/expert-tips") ? activeLinkClass : ""}`}>
				Expert Tips
			</Link>
			{pathname.includes("/admin/expert-tips") && (
				<div className="dark:bg-black-100 flex flex-col py-2">
					<Link href="/admin/expert-tips" className={`${subMenuLinkClass} ${pathname === "/admin/expert-tips" ? activeSubMenuLinkClass : ""}`}>
						All Expert Tips
					</Link>

					<Link href="/admin/expert-tips/new" className={`${subMenuLinkClass} ${pathname === "/admin/expert-tips/new" ? activeSubMenuLinkClass : ""}`}>
						Add New
					</Link>
				</div>
			)}

			{/* Pages Section */}
			<Link href="/admin/pages" className={`${linkClass} ${pathname === "/admin/pages" ? activeLinkClass : ""}`}>
				Pages
			</Link>
			{pathname === "/admin/pages" && (
				<div className="dark:bg-black-100 flex flex-col py-2">
					<Link href="/admin/pages" className={`${subMenuLinkClass} ${pathname === "/admin/pages" ? activeSubMenuLinkClass : ""}`}>
						All Pages
					</Link>

					<Link href="/admin/pages/new" className={`${subMenuLinkClass} ${pathname === "/admin/pages/new" ? activeSubMenuLinkClass : ""}`}>
						Add New
					</Link>
				</div>
			)}

			{/* Jobs Section */}
			<Link href="/admin/jobs" className={`${linkClass} ${pathname === "/admin/jobs" ? activeLinkClass : ""}`}>
				Jobs
			</Link>
			{pathname === "/admin/jobs" && (
				<div className="dark:bg-black-100 flex flex-col py-2">
					<Link href="/admin/jobs" className={`${subMenuLinkClass} ${pathname === "/admin/jobs" ? activeSubMenuLinkClass : ""}`}>
						All Jobs
					</Link>

					<Link href="/admin/jobs/new" className={`${subMenuLinkClass} ${pathname === "/admin/jobs/new" ? activeSubMenuLinkClass : ""}`}>
						Add Jobs
					</Link>
				</div>
			)}

			{/* Promotions Section */}
			<Link href="/admin/promotions" className={`${linkClass} ${pathname === "/admin/promotions" ? activeLinkClass : ""}`}>
				Promotions
			</Link>
			{pathname === "/admin/promotions" && (
				<div className="dark:bg-black-100 flex flex-col py-2">
					<Link href="/admin/promotions" className={`${subMenuLinkClass} ${pathname === "/admin/promotions" ? activeSubMenuLinkClass : ""}`}>
						All Promotions
					</Link>

					<Link href="/admin/promotions/new" className={`${subMenuLinkClass} ${pathname === "/admin/promotions/new" ? activeSubMenuLinkClass : ""}`}>
						Add New
					</Link>
				</div>
			)}

			{/* Media Section */}
			<Link href="/admin/media" className={`${linkClass} ${pathname === "/admin/media" ? activeLinkClass : ""}`}>
				Media
			</Link>
			{pathname === "/admin/media" && (
				<div className="dark:bg-black-100 flex flex-col py-2">
					<Link href="/admin/media" className={`${subMenuLinkClass} ${pathname === "/admin/media" ? activeSubMenuLinkClass : ""}`}>
						All Media
					</Link>

					<Link href="/admin/media/new" className={`${subMenuLinkClass} ${pathname === "/admin/media/new" ? activeSubMenuLinkClass : ""}`}>
						Add New
					</Link>
				</div>
			)}

			{/* Users Section */}
			<Link href="/admin/users" className={`${linkClass} ${pathname === "/admin/users" ? activeLinkClass : ""}`}>
				Users
			</Link>
			{pathname === "/admin/users" && (
				<div className="dark:bg-black-100 flex flex-col py-2">
					<Link href="/admin/users" className={`${subMenuLinkClass} ${pathname === "/admin/users" ? activeSubMenuLinkClass : ""}`}>
						All Users
					</Link>

					<Link href="/admin/users/new" className={`${subMenuLinkClass} ${pathname === "/admin/users/new" ? activeSubMenuLinkClass : ""}`}>
						Add New
					</Link>
				</div>
			)}

			{/* Settings Section */}
			<Link href="/admin/settings" className={`${linkClass} ${pathname === "/admin/settings" ? activeLinkClass : ""}`}>
				Settings
			</Link>
			{pathname === "/admin/settings" && (
				<div className="dark:bg-black-100 flex flex-col py-2">
					<Link href="/admin/settings/general" className={`${subMenuLinkClass} ${pathname === "/admin/settings/general" ? activeSubMenuLinkClass : ""}`}>
						General
					</Link>

					<Link href="/admin/settings/advanced" className={`${subMenuLinkClass} ${pathname === "/admin/settings/advanced" ? activeSubMenuLinkClass : ""}`}>
						Advanced
					</Link>
				</div>
			)}
		</div>
	);
}
