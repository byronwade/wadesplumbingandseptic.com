import { useState } from "react";

export default function Search({ placeholder, onSearchResults }) {
	const [searchQuery, setSearchQuery] = useState("");

	const handleChange = (event) => {
		setSearchQuery(event.target.value);
		onSearchResults(event.target.value); // Inform the parent about the new search term
	};

	return (
		<div className="flex w-full space-x-2 items-center mt-4">
			<label htmlFor="simple-search" className="sr-only">
				Search
			</label>
			<div className="relative w-full !m-0">
				<div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
					<svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
						<path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
					</svg>
				</div>
				<input id="simple-search" value={searchQuery} onChange={handleChange} type="text" className="border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-brand-500 focus:border-brand-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-brand-500 dark:focus:border-brand-500" placeholder={placeholder} required />
			</div>
		</div>
	);
}
