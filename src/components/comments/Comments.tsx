export default function Comments() {
	return (
		<section className="mt-10 bg-white p-4 rounded border">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Discussion (20)</h2>
				<div>
					<button type="button" className="py-2 px-3 text-sm font-medium text-gray-900 bg-white rounded border border-gray-200 focus:outline-none hover:bg-gray-100 hover:text-brand-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
						Subscribe
					</button>
				</div>
			</div>
			<form className="mb-6">
				<div className="mb-4 w-full bg-gray-50 rounded border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
					<div className="py-2 px-4 bg-gray-50 rounded-t-lg dark:bg-gray-800">
						<label htmlFor="comment" className="sr-only">
							Your comment
						</label>
						<textarea id="comment" rows={6} className="px-0 w-full text-sm text-gray-900 bg-gray-50 border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400" placeholder="Write a comment..." required defaultValue={""} />
					</div>
					<div className="flex justify-between items-center py-2 px-3 border-t dark:border-gray-600">
						<button type="submit" className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-brand rounded focus:ring-4 focus:ring-brand-200 dark:focus:ring-brand-900 hover:bg-brand-600">
							Post comment
						</button>
						<div className="flex pl-0 space-x-1 sm:pl-2">
							<button type="button" className="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
								<svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
									<path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
								</svg>
								<span className="sr-only">Attach file</span>
							</button>
							<button type="button" className="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
								<svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
									<path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
								</svg>
								<span className="sr-only">Set location</span>
							</button>
							<button type="button" className="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
								<svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
									<path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
								</svg>
								<span className="sr-only">Upload image</span>
							</button>
						</div>
					</div>
				</div>
			</form>
			<article className="p-6 mb-6 text-base bg-gray-50 rounded dark:bg-gray-700">
				<footer className="flex justify-between items-center mb-2">
					<div className="flex items-center">
						<p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
							<img className="mr-2 w-6 h-6 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-2.webp" alt="Michael Gough" />
							Michael Gough
						</p>
						<p className="text-sm text-gray-700 dark:text-gray-400">
							<time dateTime="2022-02-08" title="February 8th, 2022">
								Feb. 8, 2022
							</time>
						</p>
					</div>
					<button id="dropdownComment1Button" data-dropdown-toggle="dropdownComment1" className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-400 bg-gray-50 rounded hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-600" type="button">
						<svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
							<path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
						</svg>
						<span className="sr-only">Comment settings</span>
					</button>
					{/* Dropdown menu */}
					<div id="dropdownComment1" className="hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
						<ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconHorizontalButton">
							<li>
								<a href="#" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
									Edit
								</a>
							</li>
							<li>
								<a href="#" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
									Remove
								</a>
							</li>
							<li>
								<a href="#" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
									Report
								</a>
							</li>
						</ul>
					</div>
				</footer>
				<p className="text-gray-500 dark:text-gray-400">Very straight-to-point article. Really worth time reading. Thank you! But tools are just the instruments for the UX designers. The knowledge of the design tools are as important as the creation of the design strategy.</p>
				<div className="flex items-center mt-4 space-x-4">
					<button type="button" className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400">
						<svg aria-hidden="true" className="mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
							<path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
						</svg>
						11 Likes
					</button>
					<button type="button" className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400">
						<svg aria-hidden="true" className="mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
							<path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
						</svg>
						Reply
					</button>
				</div>
			</article>
			<article className="p-6 mb-6 ml-12 text-base bg-gray-50 rounded dark:bg-gray-700">
				<footer className="flex justify-between items-center mb-2">
					<div className="flex items-center">
						<p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
							<img className="mr-2 w-6 h-6 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-5.webp" alt="Jese Leos" />
							Jese Leos
						</p>
						<p className="text-sm text-gray-700 dark:text-gray-400">
							<time dateTime="2022-02-12" title="February 12th, 2022">
								Feb. 12, 2022
							</time>
						</p>
					</div>
					<button id="dropdownComment2Button" data-dropdown-toggle="dropdownComment2" className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-400 bg-gray-50 rounded hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-600" type="button">
						<svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
							<path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
						</svg>
						<span className="sr-only">Comment settings</span>
					</button>
					{/* Dropdown menu */}
					<div id="dropdownComment2" className="hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
						<ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconHorizontalButton">
							<li>
								<a href="#" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
									Edit
								</a>
							</li>
							<li>
								<a href="#" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
									Remove
								</a>
							</li>
							<li>
								<a href="#" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
									Report
								</a>
							</li>
						</ul>
					</div>
				</footer>
				<p className="text-gray-500 dark:text-gray-400">Much appreciated! Glad you liked it ☺️</p>
				<div className="flex items-center mt-4 space-x-4">
					<button type="button" className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400">
						<svg aria-hidden="true" className="mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
							<path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
						</svg>
						3 Likes
					</button>
					<button type="button" className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400">
						<svg aria-hidden="true" className="mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
							<path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
						</svg>
						Reply
					</button>
				</div>
			</article>
			<article className="p-6 mb-6 text-base bg-gray-50 rounded dark:bg-gray-700">
				<footer className="flex justify-between items-center mb-2">
					<div className="flex items-center">
						<p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
							<img className="mr-2 w-6 h-6 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-3.webp" alt="Bonnie Green" />
							Bonnie Green
						</p>
						<p className="text-sm text-gray-700 dark:text-gray-400">
							<time dateTime="2022-03-12" title="March 12th, 2022">
								Mar. 12, 2022
							</time>
						</p>
					</div>
					<button id="dropdownComment3Button" data-dropdown-toggle="dropdownComment3" className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-400 bg-gray-50 rounded hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-600" type="button">
						<svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
							<path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
						</svg>
						<span className="sr-only">Comment settings</span>
					</button>
					{/* Dropdown menu */}
					<div id="dropdownComment3" className="hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
						<ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconHorizontalButton">
							<li>
								<a href="#" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
									Edit
								</a>
							</li>
							<li>
								<a href="#" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
									Remove
								</a>
							</li>
							<li>
								<a href="#" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
									Report
								</a>
							</li>
						</ul>
					</div>
				</footer>
				<p className="text-gray-500 dark:text-gray-400">The article covers the essentials, challenges, myths and stages the UX designer should consider while creating the design strategy.</p>
				<div className="flex items-center mt-4 space-x-4">
					<button type="button" className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400">
						<svg aria-hidden="true" className="mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
							<path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
						</svg>
						24 Likes
					</button>
					<button type="button" className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400">
						<svg aria-hidden="true" className="mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
							<path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
						</svg>
						Reply
					</button>
				</div>
			</article>
			<article className="p-6 text-base bg-gray-50 rounded dark:bg-gray-700">
				<footer className="flex justify-between items-center mb-2">
					<div className="flex items-center">
						<p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
							<img className="mr-2 w-6 h-6 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-4.webp" alt="Helene Engels" />
							Helene Engels
						</p>
						<p className="text-sm text-gray-700 dark:text-gray-400">
							<time dateTime="2022-06-23" title="June 23rd, 2022">
								Jun. 23, 2022
							</time>
						</p>
					</div>
					<button id="dropdownComment4Button" data-dropdown-toggle="dropdownComment4" className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-400 bg-gray-50 rounded hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-600" type="button">
						<svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
							<path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
						</svg>
					</button>
					{/* Dropdown menu */}
					<div id="dropdownComment4" className="hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
						<ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconHorizontalButton">
							<li>
								<a href="#" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
									Edit
								</a>
							</li>
							<li>
								<a href="#" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
									Remove
								</a>
							</li>
							<li>
								<a href="#" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
									Report
								</a>
							</li>
						</ul>
					</div>
				</footer>
				<p className="text-gray-500 dark:text-gray-400">Thanks for sharing this. I do came from the Backend development and explored some of the tools to design my Side Projects.</p>
				<div className="flex items-center mt-4 space-x-4">
					<button type="button" className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400">
						<svg aria-hidden="true" className="mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
							<path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
						</svg>
						9 Likes
					</button>
					<button type="button" className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400">
						<svg aria-hidden="true" className="mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
							<path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
						</svg>
						Reply
					</button>
				</div>
			</article>
		</section>
	);
}
