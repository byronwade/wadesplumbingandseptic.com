"use client";
import { useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { track } from "@vercel/analytics/react";

export default function Pagination({ total, itemsPerPage }) {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const totalPages = useMemo(() => Math.ceil(total / itemsPerPage), [total, itemsPerPage]);
	const currentPage = useMemo(() => Number(searchParams.get("page")) || 1, [searchParams]);

	const generatePath = (page) => {
		const base = `${pathname}?page=${page}`;
		if (searchParams.has("search")) {
			return `${base}&search=${searchParams.get("search")}`;
		}
		return base;
	};

	const navigateToPage = (page) => router.push(generatePath(page));
	const goPreviousPage = () => currentPage > 1 && navigateToPage(currentPage - 1);
	const goNextPage = () => currentPage < totalPages && navigateToPage(currentPage + 1);

	const pageMin = (currentPage - 1) * itemsPerPage + 1;
	const pageMax = currentPage < totalPages ? currentPage * itemsPerPage : total;
	const buttonClass = "relative inline-flex items-center rounded bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0";

	return (
		<nav className="flex w-full items-center justify-between" aria-label="Pagination">
			<div className="hidden sm:block">
				<p className="text-sm text-gray-700">{total === 0 ? "No results found" : `Showing ${pageMin} to ${pageMax} of ${total} results`}</p>
			</div>
			<div className="flex flex-1 justify-between sm:justify-end">
				<button
					onClick={() => {
						track(`Previous ${pathname}`);
						goPreviousPage();
					}}
					className={`${buttonClass} mr-2 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
				>
					Previous
				</button>
				<button
					onClick={() => {
						track(`Next ${pathname}`);
						goNextPage();
					}}
					className={`${buttonClass} ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
				>
					Next
				</button>
			</div>
		</nav>
	);
}
