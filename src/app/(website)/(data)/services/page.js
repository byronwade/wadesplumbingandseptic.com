import Search from "@/components/ui/Search";
import Pagnation from "@/components/ui/Pagnation";
import Services from "./Services";
import Link from "next/link";
import fetchData from "./getServices";

const ITEMS_PER_PAGE = 6;

function getServiceMessage(searchTerm, allServices) {
	if (searchTerm) {
		return allServices.length > 0 ? `We found ${allServices.length} services matching "${searchTerm}".` : `We couldn't find any services matching "${searchTerm}".`;
	}
	return `We have ${allServices.length} services.`;
}

export default async function Page({ searchParams }) {
	const { search = "", page = "1" } = searchParams || {};
	const currentPage = parseInt(page, 10) || 1;
	const { allServices, pagedData, total } = await fetchData({ searchTerm: search, page: currentPage });

	const serviceMsg = getServiceMessage(search, allServices);

	return (
		<section className="bg-gray-50 relative overflow-hidden">
			<div className="py-16 px-6 sm:py-24 lg:px-8">
				<div className="mx-auto max-w-7xl">
					<div className="flex flex-col space-y-6 justify-center items-start">
						<h2 className="text-lg font-semibold leading-8 tracking-tight text-brand-600">{serviceMsg}</h2>
						<p className="!mt-0 mb-4 text-4xl tracking-tight font-extrabold text-black dark:text-white">Search for any service</p>
						<p className="max-w-2xl text-lg leading-6 text-gray-600">
							Have a different question and can’t find the answer you’re looking for? Reach out to our support team by
							<Link href="/contact-us" className="font-semibold text-brand-600 hover:text-brand-500">
								{` sending us an email `}
							</Link>
							and we’ll get back to you as soon as we can.
						</p>
						<Search placeholder="Search for a service..." search={searchParams} />
						<Services services={pagedData} itemsPerPage={ITEMS_PER_PAGE} />
						<Pagnation total={total} currentPage={currentPage} itemsPerPage={ITEMS_PER_PAGE} />
					</div>
				</div>
			</div>
		</section>
	);
}
