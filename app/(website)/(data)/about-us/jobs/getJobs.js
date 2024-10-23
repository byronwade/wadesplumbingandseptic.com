import { supabase } from "@/lib/supabase";

async function fetchAllJobs() {
	let query = supabase
		.from("jobs")
		.select(
			`
			id,
			title,
			content,
			excerpt,
			created_at,
			job_type,
			benefits,
			location,
			pay_range,
			qualifications,
			shift_and_schedule,
			categories,
			tags,
			slug
`,
			{ count: "exact" }
		)
		.order("created_at", { ascending: true });

	const { data, count, error } = await query;

	if (error) {
		console.error("Error fetching data:", error);
		return null;
	}
	return data;
}

async function fetchJobDetails(slug) {
	if (!slug) return null;

	const { data, error } = await supabase
		.from("jobs")
		.select(
			`
			id,
			title,
			content,
			excerpt,
			created_at,
			job_type,
			benefits,
			location,
			pay_range,
			qualifications,
			shift_and_schedule,
			categories,
			tags,
			slug
	  `
		)
		.eq("slug", slug)
		.single();

	if (error) {
		console.error("Error fetching job details:", error);
		return null;
	}
	return data;
}

export default async function getJobs({ slug = "", page = 1, itemsPerPage = 10 } = {}) {
	const allJobs = await fetchAllJobs();
	const jobDetails = await fetchJobDetails(slug);
	const total = allJobs?.length || 0;

	const startAt = (page - 1) * itemsPerPage;
	const endAt = startAt + itemsPerPage;
	let pagedData = allJobs?.slice(startAt, endAt);

	return {
		allJobs,
		jobDetails,
		pagedData,
		total,
	};
}
