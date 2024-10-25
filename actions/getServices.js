"use server";

import { supabase } from "@/lib/supabase";

export async function getServices({ searchTerm = "", page = 1, itemsPerPage = 6 }) {
  try {
    let query = supabase.from("services").select("id, title, excerpt, slug, categories, readingtime, featuredImage:images(alttext, sourceurl, sizes)", { count: "exact" }).order("created_at", { ascending: false });

    if (searchTerm) {
      query = query.ilike("title", `%${searchTerm}%`);
    }

    const { data, count, error } = await query.range((page - 1) * itemsPerPage, page * itemsPerPage - 1);

    if (error) throw error;

    return { services: data, total: count };
  } catch (error) {
    console.error("Error fetching services:", error);
    return { services: [], total: 0, error: error.message };
  }
}

export async function getServiceDetails(slug) {
  try {
    const { data, error } = await supabase.from("services").select("*").eq("slug", slug).single();

    if (error) throw error;

    return { service: data };
  } catch (error) {
    console.error("Error fetching service details:", error);
    return { service: null, error: error.message };
  }
}