import { useState, useEffect } from "react";

export default function Pagination({ total, currentPage, onPageChange }) {
	const itemsPerPage = 10;
	const totalPages = Math.ceil(total / itemsPerPage);

	const handleNext = () => {
		if (currentPage < totalPages) {
			const nextPage = currentPage + 1;
			onPageChange(nextPage);
		}
	};

	const handlePrev = () => {
		if (currentPage > 1) {
			const prevPage = currentPage - 1;
			onPageChange(prevPage);
		}
	};

	const pageMin = (currentPage - 1) * itemsPerPage + 1;
	const pageMax = total <= itemsPerPage ? total : Math.min(currentPage * itemsPerPage, total);

	return (
		<nav className="flex w-full items-center justify-between" aria-label="Pagination">
			<div className="hidden sm:block">
				<p className="text-sm text-gray-700">{total === 0 ? "No results found" : pageMin === pageMax ? `Showing ${pageMin} of ${total} results` : `Showing ${pageMin} to ${pageMax} of ${total} results`}</p>
			</div>
			<div className="flex flex-1 justify-between sm:justify-end">
				<button onClick={handlePrev} className="relative inline-flex items-center rounded bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0" disabled={currentPage === 1}>
					Previous
				</button>
				<button onClick={handleNext} className="relative ml-3 inline-flex items-center rounded bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0" disabled={currentPage === totalPages || total === 0}>
					Next
				</button>
			</div>
		</nav>
	);
}
