"use client";
import { useEffect, useState } from "react";
import Tiptap from "../../../components/TipTap";
import ContentHeader from "../../../components/content/ContentHeader";
import ContentSidebar from "../../../components/content/ContentSidebar";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Success from "./success";

const formSchema = z.object({
	title: z.string().min(2, {
		message: "Title must be at least 2 characters.",
	}),
	slug: z.string(),
	readingTime: z.string(),
	date: z.date(),
	excerpt: z.string().min(2, {
		message: "Excerpt must be at least 2 characters.",
	}),
	categories: z.array(z.string()).refine((value) => value.some((item) => item), {
		message: "You have to select at least one item.",
	}),
	author: z.string(),
	content: z.string(),
	featuredImage: z
		.instanceof(File)
		.refine((file) => file == null || file.type.startsWith("image/"), {
			message: "Uploaded file must be an image",
		})
		.refine((file) => file == null || file.size <= 5000000, {
			message: "Image must be less than 5MB",
		}),
});

export default function ExpertTips() {
	const [readingTime, setReadingTime] = useState(0);
	const [slug, setSlug] = useState(0);

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			slug: "",
			excerpt: "",
			readingTime: "2",
			date: new Date(),
			author: "",
			categories: "",
			content: "",
			featuredImage: undefined,
		},
	});

	const [isSubmitted, setIsSubmitted] = useState(false);
	const [submissionData, setSubmissionData] = useState({
		content: "Success",
		link: "https://www.wadesplumbingandseptic.com",
	});

	const handleTiptapContentChange = (content) => {
		form.setValue("content", content);
		// Extract text and calculate reading time
		const text = content.replace(/<[^>]*>?/gm, " ").replace(/\s\s+/g, " ");
		const calculatedReadingTime = calculateReadingTime(text);
		setReadingTime(calculatedReadingTime);
	};

	const onSubmit = (values) => {
		console.log(values); // Here you will handle the form submission
		setIsSubmitted(true);
	};

	const calculateReadingTime = (text) => {
		const words = text.trim().split(/\s+/).length;
		const wordsPerMinute = 225; // Average reading speed
		const readingTimeMinutes = words / wordsPerMinute;
		const readingTimeSeconds = Math.ceil(readingTimeMinutes * 60);
		return readingTimeSeconds;
	};

	const slugify = (text) => {
		return text
			.toString()
			.toLowerCase()
			.trim()
			.replace(/\s+/g, "-") // Replace spaces with -
			.replace(/[^\w\-]+/g, "") // Remove all non-word chars
			.replace(/\-\-+/g, "-"); // Replace multiple - with single -
	};

	// Watch the title field
	const title = form.watch("title");

	// Update slug whenever the title changes
	useEffect(() => {
		if (title) {
			const generatedSlug = slugify(title);
			setSlug(generatedSlug);
			console.log(generatedSlug);
		}
	}, [title, form]);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<ContentHeader />
				<div className="flex flex-row">
					<div className="flex flex-col p-6 w-full">
						{isSubmitted ? <Success data={submissionData} /> : null}
						<div className="flex flex-col space-y-4">
							<FormField
								control={form.control}
								name="title"
								render={({ field, fieldState }) => (
									<FormItem>
										<FormLabel>Title</FormLabel>
										<FormControl>
											<Input className="w-full bg-white" placeholder="Title" {...field} />
										</FormControl>
										<FormDescription>This is your public display title.</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="content"
								render={({ field, fieldState }) => (
									<FormItem>
										<FormLabel>Content</FormLabel>
										<FormControl>
											<Tiptap onContentChange={handleTiptapContentChange} />
										</FormControl>
										<FormDescription>This is your public display title.</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>
					<ContentSidebar form={form} readingTime={readingTime} slug={slug} />
				</div>
			</form>
		</Form>
	);
}
