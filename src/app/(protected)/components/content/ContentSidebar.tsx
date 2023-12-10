"use client";
import React, { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function ContentSidebar({ form, readingTime, slug }) {
	const [image, setImage] = useState<string | null>(null);
	const [date, setDate] = useState(new Date());

	// Function to check if a field has an error
	const hasError = (fieldName) => {
		return !!form.formState.errors[fieldName];
	};

	type FileChangeEvent = React.ChangeEvent<HTMLInputElement>;

	const handleFileChange = (event: FileChangeEvent) => {
		const file = event.target.files ? event.target.files[0] : null;
		if (file) {
			const reader = new FileReader();
			reader.onload = async (e: ProgressEvent<FileReader>) => {
				// Check if e.target is not null and is a FileReader instance
				if (e.target && e.target instanceof FileReader) {
					setImage(e.target.result as string); // Cast result to string
					form.setValue("featuredImage", file); // Correctly use setValue
					await form.trigger("featuredImage"); // Trigger re-validation for featuredImage
				}
			};
			reader.readAsDataURL(file);
		}
	};

	const handleReplaceImage = async () => {
		setImage(null);
		form.setValue("featuredImage", null); // Reset form state
		await form.trigger("featuredImage"); // Trigger re-validation for featuredImage

		const fileInput = document.getElementById("file-upload") as HTMLInputElement; // Cast to HTMLInputElement
		if (fileInput) {
			fileInput.value = ""; // Reset the file input
		}
	};

	const items = [
		{
			id: "recents",
			label: "Recents",
		},
		{
			id: "home",
			label: "Home",
		},
		{
			id: "applications",
			label: "Applications",
		},
		{
			id: "desktop",
			label: "Desktop",
		},
		{
			id: "downloads",
			label: "Downloads",
		},
		{
			id: "documents",
			label: "Documents",
		},
	] as const;

	return (
		<div className="flex flex-col w-[350px] h-auto border-l border-gray-100">
			<Collapsible>
				<CollapsibleTrigger className={`text-sm p-3 w-full transition-colors border-b border-gray-100 text-left ${hasError("slug") ? "bg-red-500 text-white" : "bg-white"}`}>Summery</CollapsibleTrigger>
				<CollapsibleContent className="p-3 text-sm border-b border-gray-100 space-y-4">
					<div>
						<b>Slug: </b>
						<p>{slug}</p>
					</div>
					<div>
						<b>Reading Time: </b>
						<p>{readingTime}</p>
					</div>
					<FormField
						control={form.control}
						name="date"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Date</FormLabel>
								<FormControl>
									<Popover>
										<PopoverTrigger asChild>
											<Button variant={"outline"} className={`w-full justify-start text-left font-normal bg-white`}>
												<CalendarIcon className="mr-2 h-4 w-4" />
												{date ? format(date, "PPP") : <span>Pick a date</span>}
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0 bg-white">
											<Calendar
												mode="single"
												selected={date}
												onSelect={(selectedDate: Date | undefined) => {
													if (selectedDate) {
														setDate(selectedDate);
													}
												}}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</CollapsibleContent>
			</Collapsible>

			<Collapsible>
				<CollapsibleTrigger className={`text-sm p-3 w-full transition-colors border-b border-gray-100 text-left ${hasError("featuredImage") ? "bg-red-500 text-white" : "bg-white"}`}>Featured Image</CollapsibleTrigger>
				<CollapsibleContent className="p-3 text-sm border-b border-gray-100 ">
					<FormField
						control={form.control}
						name="featuredImage"
						render={({ field }) => (
							<div>
								{!image ? (
									<div
										className="bg-white flex justify-center rounded border-2 border-dashed border-black px-6 pt-5 pb-6 cursor-pointer"
										onClick={(e) => {
											if (e.target === e.currentTarget) {
												const fileInput = document.getElementById("file-upload") as HTMLInputElement;
												if (fileInput) {
													fileInput.click();
												}
											}
										}}
									>
										<div className="space-y-1 text-center">
											<svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
												<path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
											</svg>
											<div className="flex text-sm text-gray-800 items-center">
												<label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-medium text-brand-800 focus-within:outline-none focus-within:ring-2 focus-within:ring-brand-500 focus-within:ring-offset-2 hover:text-brand-500">
													<span>Upload a file</span>
													<input id="file-upload" className="sr-only" type="file" name="file-upload" onChange={handleFileChange} />
												</label>
												<p className="pl-1">or drag and drop</p>
											</div>
											<p className="text-xs text-gray-800">PDF, DOC, PNG up to 10MB</p>
										</div>
									</div>
								) : (
									<div className="flex flex-col justify-center">
										<Image src={image} alt="Uploaded" height={242} width={242} className="w-auto h-auto rounded-md aspect-video" />
										<Button size="sm" className="bg-red-600 text-white hover:bg-red-600/90 mt-1" onClick={handleReplaceImage}>
											Replace Image
										</Button>
									</div>
								)}
							</div>
						)}
					/>
				</CollapsibleContent>
			</Collapsible>

			<Collapsible>
				<CollapsibleTrigger className={`text-sm p-3 w-full transition-colors border-b border-gray-100 text-left ${hasError("excerpt") ? "bg-red-500 text-white" : "bg-white"}`}>Excerpt</CollapsibleTrigger>
				<CollapsibleContent className="p-3 text-sm border-b border-gray-100 ">
					<FormField
						control={form.control}
						name="excerpt"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Textarea className="w-full bg-white" placeholder="Exceprt" {...field} />
								</FormControl>
								<FormDescription>This is your public display title.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</CollapsibleContent>
			</Collapsible>

			<Collapsible>
				<CollapsibleTrigger className={`text-sm p-3 w-full transition-colors border-b border-gray-100 text-left ${hasError("categories") ? "bg-red-500 text-white" : "bg-white"}`}>Categories</CollapsibleTrigger>
				<CollapsibleContent className="p-3 text-sm space-y-2 border-b border-gray-100 ">
					{items.map((item) => (
						<FormField
							key={item.id}
							control={form.control}
							name="categories"
							render={({ field }) => {
								return (
									<FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
										<FormControl>
											<Checkbox
												checked={field.value?.includes(item.id)}
												onCheckedChange={(checked) => {
													return checked ? field.onChange([...field.value, item.id]) : field.onChange(field.value?.filter((value) => value !== item.id));
												}}
											/>
										</FormControl>
										<FormLabel className="text-sm font-normal">{item.label}</FormLabel>
									</FormItem>
								);
							}}
						/>
					))}
					<div>
						<Link href="/" className="hover:underline text-blue-800">
							Add more Categories
						</Link>
					</div>
				</CollapsibleContent>
			</Collapsible>

			<Collapsible>
				<CollapsibleTrigger className={`text-sm p-3 w-full transition-colors border-b border-gray-100 text-left ${hasError("author") ? "bg-red-500 text-white" : "bg-white"}`}>Author</CollapsibleTrigger>
				<CollapsibleContent className="p-3 text-sm space-y-2 border-b border-gray-100 ">
					<FormField
						control={form.control}
						name="author"
						render={({ field }) => {
							return (
								<Select onValueChange={field.onChange} defaultValue={field.value}>
									<SelectTrigger className="w-full bg-white">
										<SelectValue placeholder="Theme" />
									</SelectTrigger>
									<SelectContent className="bg-white">
										<SelectItem value="light">Light</SelectItem>
										<SelectItem value="dark">Dark</SelectItem>
										<SelectItem value="system">System</SelectItem>
									</SelectContent>
								</Select>
							);
						}}
					/>
				</CollapsibleContent>
			</Collapsible>
		</div>
	);
}
