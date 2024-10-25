"use server";

import { supabase } from "@/lib/supabase";
import { unstable_cache } from 'next/cache';

const getAllJobs = unstable_cache(
	async () => {
		try {
			const { data, count, error } = await supabase
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

			if (error) throw error;

			return { data, count };
		} catch (error) {
			console.error("Error fetching all jobs:", error);
			return { data: null, count: 0, error: error.message };
		}
	},
	['all-jobs'],
	{ tags: ['jobs'], revalidate: 60 } // Cache for 60 seconds
);

export const getJobDetails = unstable_cache(
	async (slug) => {
		if (!slug) return { data: null, error: "No slug provided" };

		try {
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

			if (error) throw error;

			return { data };
		} catch (error) {
			console.error("Error fetching job details:", error);
			return { data: null, error: error.message };
		}
	},
	['job-details'],
	{ tags: ['jobs'], revalidate: 60 } // Cache for 60 seconds
);

export async function getJobs({ slug = "", page = 1, itemsPerPage = 10 } = {}) {
	try {
		const { data: allJobs, count: total, error: allJobsError } = await getAllJobs();
		if (allJobsError) throw new Error(allJobsError);

		const { data: jobDetails, error: jobDetailsError } = slug ? await getJobDetails(slug) : { data: null, error: null };
		if (jobDetailsError && slug) throw new Error(jobDetailsError);

		const startAt = (page - 1) * itemsPerPage;
		const endAt = startAt + itemsPerPage;
		const pagedData = allJobs?.slice(startAt, endAt) || [];

		return {
			allJobs,
			jobDetails,
			pagedData,
			total,
		};
	} catch (error) {
		console.error("Error in getJobs:", error);
		return {
			allJobs: [],
			jobDetails: null,
			pagedData: [],
			total: 0,
			error: error.message,
		};
	}
}
