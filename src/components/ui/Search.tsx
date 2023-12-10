"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";
import { Search as SearchIcon } from "react-feather";

export default function Search({ placeholder = "Search" }) {
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedQuery] = useDebounce(searchQuery, 500);

	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const currentSearch = searchParams.get("search") || "";

	useEffect(() => {
		setSearchQuery(currentSearch);
	}, [currentSearch]);

	useEffect(() => {
		const newPath = debouncedQuery ? `${pathname}?page=1&search=${debouncedQuery}` : pathname;
		router.push(newPath);
	}, [debouncedQuery, pathname, router]);

	return (
		<div className="flex w-full items-center mt-4">
			<label htmlFor="simple-search" className="sr-only">
				Search
			</label>
			<div className="relative w-full">
				<div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
					<SearchIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
				</div>
				<input id="simple-search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} type="text" className="border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-brand-500 focus:border-brand-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-brand-500 dark:focus:border-brand-500" placeholder={placeholder} aria-label="Search" required />
			</div>
		</div>
	);
}
