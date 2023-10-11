// Import your Supabase client instance
import { supabase } from "../../../utils/supabase";
import { NextResponse } from "next/server";

export async function POST(request) {
	try {
		// Extract the email from the request body
		const { email } = await request.json();

		// Add any additional validation checks here
		if (!email || !isValidEmail(email)) {
			return new NextResponse({ status: 400, body: "Invalid email address" });
		}

		// Insert the email into your Supabase database (assuming you have a "newsletter" table)
		const { data, error } = await supabase.from("newsletter").insert([{ email }]);

		if (error) {
			throw error;
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error(error);
		return new NextResponse({ status: 500, body: "Internal server error" });
	}
}

function isValidEmail(email) {
	// Implement your email validation logic here
	// For a basic check, you can use a regular expression
	const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
	return emailRegex.test(email);
}
