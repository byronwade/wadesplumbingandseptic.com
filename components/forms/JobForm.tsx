"use client";
import { useState } from "react";

interface FormState {
	name: string;
	email: string;
	position: string;
	success: boolean;
	error: string | null;
}

export default function JobForm() {
	const [formState, setFormState] = useState<FormState>({
		name: "",
		email: "",
		position: "",
		success: false,
		error: null,
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormState((prevState) => ({ ...prevState, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const response = await fetch("/api/jobs", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: formState.name,
					email: formState.email,
					position: formState.position,
				}),
			});

			if (response.ok) {
				setFormState({
					name: "",
					email: "",
					position: "",
					success: true,
					error: null,
				});
			} else {
				const data = await response.json();
				setFormState((prevState) => ({ ...prevState, success: false, error: data.error }));
			}
		} catch (error) {
			setFormState((prevState) => ({ ...prevState, success: false, error: "An error occurred while submitting the form" }));
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<div>
				<label htmlFor="name">Name</label>
				<input type="text" id="name" name="name" value={formState.name} onChange={handleChange} required />
			</div>
			<div>
				<label htmlFor="email">Email</label>
				<input type="email" id="email" name="email" value={formState.email} onChange={handleChange} required />
			</div>
			<div>
				<label htmlFor="position">Position</label>
				<input type="text" id="position" name="position" value={formState.position} onChange={handleChange} required />
			</div>
			<button type="submit">Submit</button>
			{formState.error && <p className="error">{formState.error}</p>}
			{formState.success && <p className="success">Your application has been submitted successfully!</p>}
		</form>
	);
}
