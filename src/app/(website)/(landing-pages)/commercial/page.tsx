export default function Example() {
	return (
		<div className="mb-12">
			<div className="mb-20 overflow-hidden sm:mb-32 md:mb-40">
				<section className="text-center px-8 mt-20 sm:mt-32 md:mt-40">
					<h2 className="text-slate-900 text-4xl tracking-tight font-extrabold sm:text-5xl dark:text-white">“Best practices” don’t actually work.</h2>
					<figure>
						<blockquote>
							<p className="mt-6 max-w-3xl mx-auto text-lg">
								I’ve written{/* */}{" "}
								<a href="https://adamwathan.me/css-utility-classes-and-separation-of-concerns/" className="text-sky-500 font-semibold dark:text-sky-400">
									a few thousand words
								</a>{" "}
								{/* */}on why traditional “semantic class names” are the reason CSS is hard to maintain, but the truth is you’re never going to believe me until you actually try it. If you can suppress the urge to retch long enough to give it a chance, I really think you’ll wonder how you ever worked with CSS any other way.
							</p>
						</blockquote>
						<figcaption className="mt-6 flex items-center justify-center space-x-4 text-left">
							<img src="/_next/static/media/adam.26d0119c.jpg" alt="" className="w-14 h-14 rounded-full" loading="lazy" decoding="async" />
							<div>
								<div className="text-slate-900 font-semibold dark:text-white">Adam Wathan</div>
								<div className="mt-0.5 text-sm leading-6">Creator of Tailwind CSS</div>
							</div>
						</figcaption>
					</figure>
				</section>
			</div>
			<div className="pt-20 mb-20 flex flex-col gap-y-20 overflow-hidden sm:pt-32 sm:mb-32 sm:gap-y-32 md:pt-40 md:mb-40 md:gap-y-40">
				<section id="constraint-based" className="relative">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
						<div className="w-16 h-16 p-[0.1875rem] rounded-full ring-1 ring-slate-900/10 shadow overflow-hidden dark:bg-indigo-500 dark:highlight-white/10">
							<div
								className="aspect-w-1 aspect-h-1 bg-[length:100%] dark:hidden"
								style={{
									backgroundImage: "url(/_next/static/media/constraint-based.c6eb530e.png)",
								}}
							/>
							<div
								className="hidden aspect-w-1 aspect-h-1 bg-[length:100%] dark:block"
								style={{
									backgroundImage: "url(/_next/static/media/constraint-based.90d79a51.png)",
								}}
							/>
						</div>
						<h2 className="mt-8 font-semibold text-indigo-500 dark:text-indigo-400">Constraint-based</h2>
						<p className="mt-4 text-3xl sm:text-4xl text-slate-900 font-extrabold tracking-tight dark:text-slate-50 ">An API for your design&nbsp;system.</p>
						<p className="mt-4 max-w-3xl space-y-6 ">Utility classes help you work within the constraints of a system instead of littering your stylesheets with arbitrary values. They make it easy to be consistent with color choices, spacing, typography, shadows, and everything else that makes up a well-engineered design system.</p>
						<a className="group inline-flex items-center h-9 rounded-full text-sm font-semibold whitespace-nowrap px-3 focus:outline-none focus:ring-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-200 hover:text-indigo-700 focus:ring-indigo-500 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 dark:hover:text-white dark:focus:ring-slate-500 mt-8" href="/docs/utility-first">
							Learn more
							<span className="sr-only">, utility-first fundamentals</span>
							<svg className="overflow-visible ml-3 text-indigo-300 group-hover:text-indigo-400 dark:text-slate-500 dark:group-hover:text-slate-400" width={3} height={6} viewBox="0 0 3 6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
								<path d="M0 0L3 3L0 6" />
							</svg>
						</a>
						<div className="mt-10">
							<div className="flex overflow-auto -mx-4 sm:mx-0">
								<ul className="flex-none inline-grid gap-x-2 px-4 sm:px-0 xl:gap-x-6" style={{ gridTemplateColumns: "repeat(4, minmax(6rem, 1fr))" }}>
									<li>
										<button type="button" className="group text-sm font-semibold w-full flex flex-col items-center text-indigo-600 dark:text-indigo-400">
											<svg width={48} height={48} fill="none" aria-hidden="true" className="mb-6 text-indigo-500 dark:text-indigo-400">
												<rect x={5} y={5} width={28} height={28} rx={4} fill="currentColor" fillOpacity=".1" stroke="currentColor" strokeWidth={2} />
												<path d="M5 41h28M33 39v4M5 39v4M39 5h4M39 33h4M41 33V5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
											</svg>
											Sizing
										</button>
									</li>
									<li>
										<button type="button" className="group text-sm font-semibold w-full flex flex-col items-center ">
											<svg width={48} height={48} fill="none" aria-hidden="true" className="mb-6 text-slate-300 group-hover:text-slate-400 dark:text-slate-600 dark:group-hover:text-slate-500">
												<path d="M17.687 42.22 40.57 29.219a4 4 0 0 0 1.554-5.36L39 18" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
												<path d="M27.477 7.121a1 1 0 1 0-.954 1.758l.954-1.758Zm5.209 3.966.477-.879-.477.88Zm1.555 5.515-.866-.5-.003.006.87.494ZM26.523 8.88l5.686 3.087.954-1.758-5.686-3.087-.954 1.758Zm6.849 7.23-12.616 22.21 1.738.987 12.617-22.21-1.74-.988Zm-1.163-4.143a3 3 0 0 1 1.166 4.136l1.732 1a5 5 0 0 0-1.944-6.894l-.954 1.758Z" fill="currentColor" />
												<path d="M5 9a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v25a9 9 0 1 1-18 0V9Z" fill="currentColor" fillOpacity={0} stroke="currentColor" strokeWidth={2} />
												<circle cx={14} cy={34} r={3} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
											</svg>
											Colors
										</button>
									</li>
									<li>
										<button type="button" className="group text-sm font-semibold w-full flex flex-col items-center ">
											<svg width={48} height={48} fill="none" aria-hidden="true" className="mb-6 text-slate-300 group-hover:text-slate-400 dark:text-slate-600 dark:group-hover:text-slate-500">
												<path d="M5 13a8 8 0 0 1 8-8h22a8 8 0 0 1 8 8v22a8 8 0 0 1-8 8H13a8 8 0 0 1-8-8V13Z" fill="currentColor" fillOpacity={0} stroke="currentColor" strokeWidth={2} />
												<path d="M15.5 25h9M13 31l5.145-12.748c.674-1.67 3.036-1.67 3.71 0L27 31" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
												<path d="M31 13s2 0 2 1.833v18.334C33 35 31 35 31 35M35 13s-2 0-2 1.833v18.334C33 35 35 35 35 35M31 24h4" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
											</svg>
											Typography
										</button>
									</li>
									<li>
										<button type="button" className="group text-sm font-semibold w-full flex flex-col items-center ">
											<svg width={48} height={48} fill="none" aria-hidden="true" className="mb-6 text-slate-300 group-hover:text-slate-400 dark:text-slate-600 dark:group-hover:text-slate-500">
												<path d="M24 43c10.493 0 19-8.507 19-19S34.493 5 24 5m-4 .422C11.427 7.259 5 14.879 5 24c0 9.121 6.427 16.741 15 18.578" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
												<path d="M24 42.819V5.181c0-.1.081-.181.181-.181C34.574 5 43 13.607 43 24c0 10.394-8.426 19-18.819 19a.181.181 0 0 1-.181-.181Z" fill="currentColor" fillOpacity={0} stroke="currentColor" strokeWidth={2} strokeLinejoin="round" />
												<path d="M28 10h3M28 14h7M28 18h10M28 22h11M28 26h10M28 30h9M28 34h7M28 38h3" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
											</svg>
											Shadows
										</button>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<div className="relative pt-10 xl:pt-0 mt-10 xl:mt-2">
						<div className="hidden dark:block absolute top-0 inset-x-0 h-[37.5rem] bg-gradient-to-b from-[#0c1120] top-0 xl:top-8" />
						<div className="absolute top-0 inset-x-0 bg-top bg-no-repeat GridLockup_beams-0___8Vns top-0 xl:top-8" />
						<div className="absolute top-0 inset-x-0 h-[37.5rem] bg-grid-slate-900/[0.04] bg-top [mask-image:linear-gradient(0deg,transparent,black)] dark:bg-grid-slate-100/[0.03] dark:bg-[center_top_-1px] dark:border-t dark:border-slate-100/5 top-0 xl:top-8" />
						<div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:grid lg:grid-cols-12 lg:gap-8">
							<div className="lg:col-span-5 xl:col-span-6 flex flex-col">
								<div className="relative z-10 bg-white ring-1 ring-slate-900/5 rounded-lg shadow-xl px-6 py-5 my-auto xl:mt-18 dark:bg-slate-800">
									<div className="absolute inset-x-0 inset-y-5 border-t border-b border-slate-100 pointer-events-none dark:border-slate-700" />
									<div className="absolute inset-x-6 inset-y-0 border-l border-r border-slate-100 pointer-events-none dark:border-slate-700" />
									<div className="bg-slate-50 flex overflow-hidden h-[22rem] dark:bg-slate-900/50">
										<div className="relative bg-white/40 w-64 sm:w-[28rem] lg:w-64 xl:w-[28rem] mx-auto border-r border-slate-100 dark:bg-transparent dark:border-slate-100/5">
											<div
												className="absolute inset-0 dark:hidden"
												style={{
													backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 6"%3E%3Crect x="32" width="1" height="1" fill="%23cbd5e1"/%3E%3Crect width="1" height="6" fill="%23f1f5f9"/%3E%3C/svg%3E")',
													backgroundSize: "4rem 0.375rem",
												}}
											/>
											<div
												className="hidden absolute inset-0 opacity-5 dark:block"
												style={{
													backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 6"%3E%3Crect x="32" width="1" height="1" fill="%23f1f5f9"/%3E%3Crect width="1" height="6" fill="%23f1f5f9"/%3E%3C/svg%3E")',
													backgroundSize: "4rem 0.375rem",
												}}
											/>
											<ul className="relative font-mono text-xs pt-6 space-y-4 hidden sm:block lg:hidden xl:block">
												<li>
													<div
														className="h-6 origin-left bg-white shadow ring-1 ring-slate-700/5 px-1 flex items-center dark:bg-indigo-500 dark:text-white dark:highlight-white/10"
														style={{
															width: "24rem",
															borderRadius: 4,
															transform: "none",
														}}
													>
														<div className="flex-none w-0.5 h-1 bg-slate-300 dark:bg-white" />
														<span className="flex-auto text-center">w-{/* */}96</span>
														<div className="flex-none w-0.5 h-1 bg-slate-300 dark:bg-white" />
													</div>
												</li>
												<li>
													<div
														className="h-6 origin-left bg-white shadow ring-1 ring-slate-700/5 px-1 flex items-center dark:bg-indigo-500 dark:text-white dark:highlight-white/10"
														style={{
															width: "20rem",
															borderRadius: 4,
															transform: "none",
														}}
													>
														<div className="flex-none w-0.5 h-1 bg-slate-300 dark:bg-white" />
														<span className="flex-auto text-center">w-{/* */}80</span>
														<div className="flex-none w-0.5 h-1 bg-slate-300 dark:bg-white" />
													</div>
												</li>
												<li>
													<div
														className="h-6 origin-left bg-white shadow ring-1 ring-slate-700/5 px-1 flex items-center dark:bg-indigo-500 dark:text-white dark:highlight-white/10"
														style={{
															width: "18rem",
															borderRadius: 4,
															transform: "none",
														}}
													>
														<div className="flex-none w-0.5 h-1 bg-slate-300 dark:bg-white" />
														<span className="flex-auto text-center">w-{/* */}72</span>
														<div className="flex-none w-0.5 h-1 bg-slate-300 dark:bg-white" />
													</div>
												</li>
												<li>
													<div
														className="h-6 origin-left bg-white shadow ring-1 ring-slate-700/5 px-1 flex items-center dark:bg-indigo-500 dark:text-white dark:highlight-white/10"
														style={{
															width: "16rem",
															borderRadius: 4,
															transform: "none",
														}}
													>
														<div className="flex-none w-0.5 h-1 bg-slate-300 dark:bg-white" />
														<span className="flex-auto text-center">w-{/* */}64</span>
														<div className="flex-none w-0.5 h-1 bg-slate-300 dark:bg-white" />
													</div>
												</li>
												<li>
													<div
														className="h-6 origin-left bg-white shadow ring-1 ring-slate-700/5 px-1 flex items-center dark:bg-indigo-500 dark:text-white dark:highlight-white/10"
														style={{
															width: "15rem",
															borderRadius: 4,
															transform: "none",
														}}
													>
														<div className="flex-none w-0.5 h-1 bg-slate-300 dark:bg-white" />
														<span className="flex-auto text-center">w-{/* */}60</span>
														<div className="flex-none w-0.5 h-1 bg-slate-300 dark:bg-white" />
													</div>
												</li>
												<li>
													<div
														className="h-6 origin-left bg-white shadow ring-1 ring-slate-700/5 px-1 flex items-center dark:bg-indigo-500 dark:text-white dark:highlight-white/10"
														style={{
															width: "14rem",
															borderRadius: 4,
															transform: "none",
														}}
													>
														<div className="flex-none w-0.5 h-1 bg-slate-300 dark:bg-white" />
														<span className="flex-auto text-center">w-{/* */}56</span>
														<div className="flex-none w-0.5 h-1 bg-slate-300 dark:bg-white" />
													</div>
												</li>
												<li>
													<div
														className="h-6 origin-left bg-white shadow ring-1 ring-slate-700/5 px-1 flex items-center dark:bg-indigo-500 dark:text-white dark:highlight-white/10"
														style={{
															width: "13rem",
															borderRadius: 4,
															transform: "none",
														}}
													>
														<div className="flex-none w-0.5 h-1 bg-slate-300 dark:bg-white" />
														<span className="flex-auto text-center">w-{/* */}52</span>
														<div className="flex-none w-0.5 h-1 bg-slate-300 dark:bg-white" />
													</div>
												</li>
												<li>
													<div
														className="h-6 origin-left bg-white shadow ring-1 ring-slate-700/5 px-1 flex items-center dark:bg-indigo-500 dark:text-white dark:highlight-white/10"
														style={{
															width: "12rem",
															borderRadius: 4,
															transform: "none",
														}}
													>
														<div className="flex-none w-0.5 h-1 bg-slate-300 dark:bg-white" />
														<span className="flex-auto text-center">w-{/* */}48</span>
														<div className="flex-none w-0.5 h-1 bg-slate-300 dark:bg-white" />
													</div>
												</li>
											</ul>
											<ul className="relative font-mono text-xs pt-6 space-y-4 sm:hidden lg:block xl:hidden">
												<li>
													<div
														className="h-6 origin-left bg-white shadow ring-1 ring-slate-700/5 px-1 flex items-center dark:bg-indigo-500 dark:text-white dark:highlight-white/10"
														style={{
															width: "16rem",
															borderRadius: 4,
															transform: "none",
														}}
													>
														<div className="flex-none w-0.5 h-1 bg-slate-300 dark:bg-white" />
														<span className="flex-auto text-center">w-{/* */}64</span>
														<div className="flex-none w-0.5 h-1 bg-slate-300 dark:bg-white" />
													</div>
												</li>
												<li>
													<div
														className="h-6 origin-left bg-white shadow ring-1 ring-slate-700/5 px-1 flex items-center dark:bg-indigo-500 dark:text-white dark:highlight-white/10"
														style={{
															width: "15rem",
															borderRadius: 4,
															transform: "none",
														}}
													>
														<div className="flex-none w-0.5 h-1 bg-slate-300 dark:bg-white" />
														<span className="flex-auto text-center">w-{/* */}60</span>
														<div className="flex-none w-0.5 h-1 bg-slate-300 dark:bg-white" />
													</div>
												</li>
												<li>
													<div
														className="h-6 origin-left bg-white shadow ring-1 ring-slate-700/5 px-1 flex items-center dark:bg-indigo-500 dark:text-white dark:highlight-white/10"
														style={{
															width: "14rem",
															borderRadius: 4,
															transform: "none",
														}}
													>
														<div className="flex-none w-0.5 h-1 bg-slate-300 dark:bg-white" />
														<span className="flex-auto text-center">w-{/* */}56</span>
														<div className="flex-none w-0.5 h-1 bg-slate-300 dark:bg-white" />
													</div>
												</li>
												<li>
													<div
														className="h-6 origin-left bg-white shadow ring-1 ring-slate-700/5 px-1 flex items-center dark:bg-indigo-500 dark:text-white dark:highlight-white/10"
														style={{
															width: "13rem",
															borderRadius: 4,
															transform: "none",
														}}
													>
														<div className="flex-none w-0.5 h-1 bg-slate-300 dark:bg-white" />
														<span className="flex-auto text-center">w-{/* */}52</span>
														<div className="flex-none w-0.5 h-1 bg-slate-300 dark:bg-white" />
													</div>
												</li>
												<li>
													<div
														className="h-6 origin-left bg-white shadow ring-1 ring-slate-700/5 px-1 flex items-center dark:bg-indigo-500 dark:text-white dark:highlight-white/10"
														style={{
															width: "12rem",
															borderRadius: 4,
															transform: "none",
														}}
													>
														<div className="flex-none w-0.5 h-1 bg-slate-300 dark:bg-white" />
														<span className="flex-auto text-center">w-{/* */}48</span>
														<div className="flex-none w-0.5 h-1 bg-slate-300 dark:bg-white" />
													</div>
												</li>
												<li>
													<div
														className="h-6 origin-left bg-white shadow ring-1 ring-slate-700/5 px-1 flex items-center dark:bg-indigo-500 dark:text-white dark:highlight-white/10"
														style={{
															width: "11rem",
															borderRadius: 4,
															transform: "none",
														}}
													>
														<div className="flex-none w-0.5 h-1 bg-slate-300 dark:bg-white" />
														<span className="flex-auto text-center">w-{/* */}44</span>
														<div className="flex-none w-0.5 h-1 bg-slate-300 dark:bg-white" />
													</div>
												</li>
												<li>
													<div
														className="h-6 origin-left bg-white shadow ring-1 ring-slate-700/5 px-1 flex items-center dark:bg-indigo-500 dark:text-white dark:highlight-white/10"
														style={{
															width: "10rem",
															borderRadius: 4,
															transform: "none",
														}}
													>
														<div className="flex-none w-0.5 h-1 bg-slate-300 dark:bg-white" />
														<span className="flex-auto text-center">w-{/* */}40</span>
														<div className="flex-none w-0.5 h-1 bg-slate-300 dark:bg-white" />
													</div>
												</li>
												<li>
													<div
														className="h-6 origin-left bg-white shadow ring-1 ring-slate-700/5 px-1 flex items-center dark:bg-indigo-500 dark:text-white dark:highlight-white/10"
														style={{
															width: "9rem",
															borderRadius: 4,
															transform: "none",
														}}
													>
														<div className="flex-none w-0.5 h-1 bg-slate-300 dark:bg-white" />
														<span className="flex-auto text-center">w-{/* */}36</span>
														<div className="flex-none w-0.5 h-1 bg-slate-300 dark:bg-white" />
													</div>
												</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
							<div className="mt-4 -mx-4 sm:mx-0 lg:mt-0 lg:col-span-7 xl:col-span-6">
								<div className="relative overflow-hidden shadow-xl flex bg-slate-800 h-[31.625rem] max-h-[60vh] sm:max-h-[none] sm:rounded-xl lg:h-[34.6875rem] xl:h-[31.625rem] dark:bg-slate-900/70 dark:backdrop-blur dark:ring-1 dark:ring-inset dark:ring-white/10">
									<div className="relative w-full flex flex-col">
										<div className="flex-none border-b border-slate-500/30">
											<div className="flex items-center h-8 space-x-1.5 px-3">
												<div className="w-2.5 h-2.5 bg-slate-600 rounded-full" />
												<div className="w-2.5 h-2.5 bg-slate-600 rounded-full" />
												<div className="w-2.5 h-2.5 bg-slate-600 rounded-full" />
											</div>
										</div>
										<div className="relative min-h-0 flex-auto flex flex-col">
											<div className="w-full flex-auto flex min-h-0" style={{ opacity: 1 }}>
												<div className="w-full flex-auto flex min-h-0 overflow-auto">
													<div className="w-full relative flex-auto">
														<pre className="flex min-h-full text-sm leading-6">
															<div aria-hidden="true" className="hidden md:block text-slate-600 flex-none py-4 pr-4 text-right select-none w-[3.125rem]">
																1<br />2<br />3<br />4<br />5<br />6<br />7<br />8
																<br />9<br />
																10
																<br />
																11
																<br />
																12
																<br />
																13
																<br />
																14
																<br />
																15
																<br />
																16
																<br />
																17
																<br />
																18
																<br />
																19
																<br />
																20
																<br />
																21
																<br />
																22
																<br />
																23
																<br />
																24
																<br />
																25
																<br />
																26
																<br />
																27
															</div>
														</pre>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				<section id="mobile-first" className="overflow-hidden">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
						<div className="w-16 h-16 p-[0.1875rem] rounded-full ring-1 ring-slate-900/10 shadow overflow-hidden dark:bg-indigo-500 dark:highlight-white/20">
							<div
								className="aspect-w-1 aspect-h-1 bg-[length:100%] dark:hidden"
								style={{
									backgroundImage: "url(/_next/static/media/mobile-first.b61c76c9.png)",
								}}
							/>
							<div
								className="hidden aspect-w-1 aspect-h-1 bg-[length:100%] dark:block"
								style={{
									backgroundImage: "url(/_next/static/media/mobile-first.99f7f4f6.png)",
								}}
							/>
						</div>
						<h2 className="mt-8 font-semibold text-indigo-500 dark:text-indigo-400">Mobile-first</h2>
						<p className="mt-4 text-3xl sm:text-4xl text-slate-900 font-extrabold tracking-tight dark:text-slate-50 ">Responsive everything.</p>
						<div className="mt-4 max-w-3xl space-y-6 ">
							<p>Wrestling with a bunch of complex media queries in your CSS sucks, so Tailwind lets you build responsive designs right in your HTML instead.</p>
							<p>Throw a screen size in front of literally any utility class and watch it magically apply at a specific breakpoint.</p>
						</div>
						<a className="group inline-flex items-center h-9 rounded-full text-sm font-semibold whitespace-nowrap px-3 focus:outline-none focus:ring-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-200 hover:text-indigo-700 focus:ring-indigo-500 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 dark:hover:text-white dark:focus:ring-slate-500 mt-8" href="/docs/responsive-design">
							Learn more<span className="sr-only">, responsive design</span>
							<svg className="overflow-visible ml-3 text-indigo-300 group-hover:text-indigo-400 dark:text-slate-500 dark:group-hover:text-slate-400" width={3} height={6} viewBox="0 0 3 6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
								<path d="M0 0L3 3L0 6" />
							</svg>
						</a>
					</div>
					<div className="hidden mt-16 mb-12 border-b border-slate-100 xl:mb-0 demo-sm:block dark:border-slate-800">
						<div className="mb-[-3px] flex max-w-7xl mx-auto px-6 sm:px-8 md:px-10">
							<div className="flex items-start flex-none ml-[40rem] w-32">
								<div className="flex flex-col items-center ml-[-2px]">
									<div className="w-px h-14 bg-slate-100 dark:bg-slate-800" />
									<div className="mt-[3px] w-[5px] h-[5px] shadow-sm rounded-full ring-1 bg-white ring-slate-500/[0.15] dark:bg-slate-900 dark:ring-slate-700" />
								</div>
								<div className="ml-1.5 rounded font-mono text-[0.625rem] leading-6 px-1.5 ring-1 ring-inset dark:ring-0 bg-slate-100 ring-slate-100 dark:bg-slate-800 dark:highlight-white/5">sm</div>
							</div>
							<div className="flex items-start flex-none w-64">
								<div className="flex flex-col items-center ml-[-2px]">
									<div className="w-px h-14 bg-slate-100 dark:bg-slate-800" />
									<div className="mt-[3px] w-[5px] h-[5px] shadow-sm rounded-full ring-1 bg-white ring-slate-500/[0.15] dark:bg-slate-900 dark:ring-slate-700" />
								</div>
								<div className="ml-1.5 rounded font-mono text-[0.625rem] leading-6 px-1.5 ring-1 ring-inset dark:ring-0 bg-slate-100 ring-slate-100 dark:bg-slate-800 dark:highlight-white/5">md</div>
							</div>
							<div className="flex items-start flex-none w-64">
								<div className="flex flex-col items-center ml-[-2px]">
									<div className="w-px h-14 bg-slate-100 dark:bg-slate-800" />
									<div className="mt-[3px] w-[5px] h-[5px] shadow-sm rounded-full ring-1 bg-white ring-slate-500/[0.15] dark:bg-slate-900 dark:ring-slate-700" />
								</div>
								<div className="ml-1.5 rounded font-mono text-[0.625rem] leading-6 px-1.5 ring-1 ring-inset dark:ring-0 bg-slate-100 ring-slate-100 dark:bg-slate-800 dark:highlight-white/5">lg</div>
							</div>
							<div className="flex items-start flex-none w-64">
								<div className="flex flex-col items-center ml-[-2px]">
									<div className="w-px h-14 bg-slate-100 dark:bg-slate-800" />
									<div className="mt-[3px] w-[5px] h-[5px] shadow-sm rounded-full ring-1 bg-white ring-slate-500/[0.15] dark:bg-slate-900 dark:ring-slate-700" />
								</div>
								<div className="ml-1.5 rounded font-mono text-[0.625rem] leading-6 px-1.5 ring-1 ring-inset dark:ring-0 bg-slate-100 ring-slate-100 dark:bg-slate-800 dark:highlight-white/5">xl</div>
							</div>
							<div className="flex items-start flex-none">
								<div className="flex flex-col items-center ml-[-2px]">
									<div className="w-px h-14 bg-slate-100 dark:bg-slate-800" />
									<div className="mt-[3px] w-[5px] h-[5px] shadow-sm rounded-full ring-1 bg-white ring-slate-500/[0.15] dark:bg-slate-900 dark:ring-slate-700" />
								</div>
								<div className="ml-1.5 rounded font-mono text-[0.625rem] leading-6 px-1.5 ring-1 ring-inset dark:ring-0 bg-slate-100 ring-slate-100 dark:bg-slate-800 dark:highlight-white/5">2xl</div>
							</div>
						</div>
					</div>
					<div className="relative pt-10 xl:pt-0 mt-10 demo-sm:-mt-2.5">
						<div className="hidden dark:block absolute top-0 inset-x-0 h-[37.5rem] bg-gradient-to-b from-[#0c1120] top-0 xl:top-14" />
						<div className="absolute top-0 inset-x-0 bg-top bg-no-repeat GridLockup_beams-0___8Vns top-0 xl:top-14" />
						<div className="absolute top-0 inset-x-0 h-[37.5rem] bg-grid-slate-900/[0.04] bg-top [mask-image:linear-gradient(0deg,transparent,black)] dark:bg-grid-slate-100/[0.03] dark:bg-[center_top_-1px] dark:border-t dark:border-slate-100/5 top-0 xl:top-14" />
						<div className="max-w-7xl mx-auto sm:px-6 md:px-8">
							<div className="sm:px-2 demo-sm:-mt-24 xl:mt-0">
								<div className="relative">
									<div className="shadow-xl sm:rounded-xl min-w-full max-w-full demo-sm:min-w-0 demo-sm:max-w-none" style={{ width: 400 }}>
										<div className="sm:rounded-xl ring-1 ring-slate-900/5">
											<div className="sm:rounded-t-xl bg-gradient-to-b from-white to-[#FBFBFB] dark:bg-none dark:bg-slate-700 dark:highlight-white/10">
												<div className="py-2.5 grid items-center px-4 gap-6" style={{ gridTemplateColumns: "2.625rem 1fr 2.625rem" }}>
													<div className="flex items-center">
														<div className="w-2.5 h-2.5 rounded-full bg-[#EC6A5F]" />
														<div className="ml-1.5 w-2.5 h-2.5 rounded-full bg-[#F4BF50]" />
														<div className="ml-1.5 w-2.5 h-2.5 rounded-full bg-[#61C454]" />
													</div>
													<div>
														<div className="bg-slate-100 rounded-md font-medium text-xs leading-6 py-1 flex items-center justify-center ring-1 ring-inset ring-slate-900/5 mx-auto w-4/5 dark:bg-slate-800 dark:text-slate-500">
															<svg viewBox="0 0 20 20" fill="currentColor" className="text-slate-300 w-3.5 h-3.5 mr-1.5 dark:text-slate-500">
																<path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
															</svg>
															workcation.com
														</div>
													</div>
												</div>
												<div className="grid grid-cols-3 text-xs leading-5 overflow-hidden">
													<div className="pointer-events-none select-none bg-slate-100 text-slate-400 rounded-tr border border-slate-900/5 px-4 py-1.5 -mb-px -ml-px flex items-center justify-center space-x-2 dark:bg-slate-800 dark:text-slate-500">
														<svg width={17} height={10} fill="currentColor" className="flex-none text-slate-300 dark:text-slate-500">
															<path
																fillRule="evenodd"
																clipRule="evenodd"
																d="M8.5 0C6.233 0 4.817 1.111 4.25 3.334c.85-1.112 1.842-1.528 2.975-1.25.647.158 1.109.618 1.62 1.127C9.68 4.041 10.643 5 12.75 5c2.267 0 3.683-1.111 4.25-3.333-.85 1.111-1.841 1.528-2.975 1.25-.647-.159-1.109-.619-1.62-1.128C11.57.96 10.607 0 8.5 0ZM4.25 5C1.983 5 .567 6.111 0 8.334c.85-1.112 1.842-1.528 2.975-1.25.647.158 1.109.618 1.62 1.127C5.43 9.041 6.393 10 8.5 10c2.267 0 3.684-1.11 4.25-3.333-.85 1.111-1.842 1.528-2.975 1.25-.647-.159-1.109-.619-1.62-1.128C7.32 5.96 6.357 5 4.25 5Z"
															/>
														</svg>
														<div className="truncate">Tailwind UI - Official Tailwind CSS Components</div>
													</div>
													<div className="pointer-events-none select-none text-slate-900 font-medium px-4 py-1.5 flex items-center justify-center space-x-2 dark:text-slate-200">
														<svg width={15} height={14} fill="currentColor" className="flex-none text-indigo-600 dark:text-slate-400">
															<path d="M6.541 11.753a1.803 1.803 0 0 1-.485 1.277c-.241.253-.552.426-.89.497-.34.07-.691.034-1.01-.103a1.736 1.736 0 0 1-.776-.67 1.79 1.79 0 0 1-.272-1c.004-.306.086-.604.239-.866.152-.262.37-.48.63-.628-.01.047.039-.024 0 0l.797-.723a3.759 3.759 0 0 0 .988-2.535c0-1.28-.734-2.581-1.788-3.262.04.024-.015-.041 0 0a1.72 1.72 0 0 1-.63-.628 1.766 1.766 0 0 1-.238-.865A1.802 1.802 0 0 1 3.592.97c.24-.253.55-.426.89-.496.338-.07.69-.035 1.008.102.319.139.59.372.776.67.187.298.282.647.272 1a3.77 3.77 0 0 0 1.006 2.552l.35.35c.14.125.287.241.44.35.265.143.489.36.644.625a1.73 1.73 0 0 1-.645 2.381c.015-.03-.027.016 0 0a3.89 3.89 0 0 0-1.296 1.393 4.007 4.007 0 0 0-.496 1.856Zm1.921-9.512c0 .348.101.69.29.979.188.29.457.515.77.648a1.678 1.678 0 0 0 1.872-.382 1.803 1.803 0 0 0 .372-1.919 1.752 1.752 0 0 0-.632-.79 1.685 1.685 0 0 0-2.168.22c-.322.33-.503.778-.504 1.244Zm1.718 7.751c-.34 0-.672.104-.954.297a1.752 1.752 0 0 0-.633.79A1.802 1.802 0 0 0 8.966 13a1.679 1.679 0 0 0 1.871.382c.314-.134.582-.36.77-.65a1.796 1.796 0 0 0-.214-2.223 1.684 1.684 0 0 0-1.214-.516Zm4.393-2.995c0-.348-.1-.688-.29-.978a1.727 1.727 0 0 0-.77-.649 1.677 1.677 0 0 0-.993-.1 1.7 1.7 0 0 0-.878.482 1.803 1.803 0 0 0-.373 1.92c.13.32.35.596.633.79a1.684 1.684 0 0 0 2.167-.22c.323-.331.504-.779.504-1.245Z" />
															<path d="M2.147 5.237c-.34 0-.672.103-.954.296a1.753 1.753 0 0 0-.633.79 1.803 1.803 0 0 0 .373 1.92c.24.245.545.413.878.48.333.069.679.034.993-.099.314-.133.582-.359.77-.648a1.795 1.795 0 0 0-.214-2.223 1.714 1.714 0 0 0-1.213-.516Z" />
														</svg>
														<div className="truncate">Workcation - Find a trip that suits you</div>
													</div>
													<div className="pointer-events-none select-none bg-slate-100 text-slate-400 rounded-tl border border-slate-900/5 pl-4 pr-8 py-1.5 -mb-px -mr-4 flex items-center justify-center space-x-2 dark:bg-slate-800 dark:text-slate-500">
														<svg width={15} height={16} fill="currentColor" className="flex-none text-slate-300 dark:text-slate-500">
															<path d="m2.973 9.822 9.154-3.056c-.183-1.144-.314-1.908-.465-2.491-.162-.627-.291-.795-.342-.853a1.785 1.785 0 0 0-.643-.467c-.071-.03-.27-.102-.917-.063-.684.042-1.581.181-3.003.406-1.42.225-2.318.37-2.98.542-.627.162-.796.292-.854.342a1.792 1.792 0 0 0-.466.643c-.03.071-.102.271-.063.918.041.683.181 1.581.406 3.002.063.399.12.755.173 1.077Z" />
															<path
																fillRule="evenodd"
																clipRule="evenodd"
																d="M.447 9.117C.012 6.367-.206 4.993.265 3.89a4.166 4.166 0 0 1 1.09-1.5C2.26 1.6 3.633 1.382 6.382.946c2.75-.436 4.125-.653 5.229-.182a4.164 4.164 0 0 1 1.5 1.09c.79.904 1.007 2.278 1.442 5.028.436 2.75.653 4.124.182 5.227a4.164 4.164 0 0 1-1.09 1.5c-.903.79-2.278 1.008-5.028 1.443-2.749.436-4.124.653-5.227.182a4.166 4.166 0 0 1-1.5-1.09C1.1 13.241.883 11.867.447 9.117Zm4.85 4.882c.735-.044 1.684-.193 3.087-.415 1.404-.222 2.351-.374 3.066-.56.691-.179 1.01-.354 1.216-.534a2.68 2.68 0 0 0 .7-.964c.108-.252.176-.609.133-1.322-.045-.736-.193-1.685-.416-3.088-.222-1.404-.373-2.352-.559-3.066-.18-.692-.354-1.01-.534-1.216a2.678 2.678 0 0 0-.964-.7c-.252-.108-.609-.176-1.323-.133-.736.044-1.684.193-3.088.415-1.403.223-2.35.374-3.065.56-.692.179-1.01.354-1.216.534a2.678 2.678 0 0 0-.7.964c-.108.251-.176.609-.133 1.322.045.737.193 1.685.415 3.088.223 1.404.374 2.352.56 3.066.179.692.354 1.01.534 1.216.265.303.594.543.964.7.252.109.608.176 1.323.133Z"
															/>
														</svg>
														<div className="truncate">Headless UI – Unstyled, fully accessible UI components</div>
													</div>
												</div>
											</div>
											<div className="relative bg-white border-t border-slate-200 rounded-b-xl pb-8 -mb-8 dark:bg-slate-800 dark:border-slate-900/50">
												<iframe src="/examples/mobile-first-demo" title="Mobile-first Demo" className="w-full h-[30.625rem]" style={{ pointerEvents: "auto" }} />
											</div>
										</div>
									</div>
									<div
										className="absolute inset-y-0 pointer-events-none"
										style={{
											right: "-1.375rem",
											width: "calc(100% - 400px + 1.375rem)",
										}}
									>
										<div className="absolute z-10 top-1/2 left-0 p-2 -mt-6 hidden demo-sm:flex items-center justify-center pointer-events-auto cursor-ew-resize" draggable="false">
											<div className="w-1.5 h-8 bg-slate-500/60 rounded-full" />
										</div>
									</div>
								</div>
							</div>
							<div className="relative overflow-hidden shadow-xl flex bg-slate-800 h-[31.625rem] max-h-[60vh] sm:max-h-[none] sm:rounded-xl lg:h-[34.6875rem] xl:h-[31.625rem] dark:bg-slate-900/70 dark:backdrop-blur dark:ring-1 dark:ring-inset dark:ring-white/10 !max-h-[24.75rem] lg:!h-[24.75rem]">
								<div className="relative w-full flex flex-col">
									<div className="flex-none border-b border-slate-500/30">
										<div className="flex items-center h-8 space-x-1.5 px-3">
											<div className="w-2.5 h-2.5 bg-slate-600 rounded-full" />
											<div className="w-2.5 h-2.5 bg-slate-600 rounded-full" />
											<div className="w-2.5 h-2.5 bg-slate-600 rounded-full" />
										</div>
									</div>
									<div className="relative min-h-0 flex-auto flex flex-col">
										<div className="w-full flex-auto flex min-h-0 overflow-auto">
											<div className="w-full relative flex-auto">
												<pre className="flex min-h-full text-sm leading-6">
													<div aria-hidden="true" className="hidden md:block text-slate-600 flex-none py-4 pr-4 text-right select-none w-[3.125rem]">
														1<br />2<br />3<br />4<br />5<br />6<br />7<br />8<br />
														9<br />
														10
														<br />
														11
														<br />
														12
														<br />
														13
														<br />
														14
														<br />
														15
														<br />
														16
														<br />
														17
														<br />
														18
														<br />
														19
														<br />
														20
														<br />
														21
														<br />
														22
														<br />
														23
														<br />
														24
														<br />
														25
														<br />
														26
														<br />
														27
														<br />
														28
														<br />
														29
														<br />
														30
														<br />
														31
														<br />
														32
														<br />
														33
														<br />
														34
														<br />
														35
														<br />
														36
														<br />
														37
														<br />
														38
														<br />
														39
														<br />
														40
													</div>
												</pre>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				<section id="component-driven">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
						<div className="w-16 h-16 p-[0.1875rem] rounded-full ring-1 ring-slate-900/10 shadow overflow-hidden dark:bg-sky-500 dark:highlight-white/20">
							<div
								className="aspect-w-1 aspect-h-1 bg-[length:100%] dark:hidden"
								style={{
									backgroundImage: "url(/_next/static/media/component-driven.82a66c3c.png)",
								}}
							/>
							<div
								className="hidden aspect-w-1 aspect-h-1 bg-[length:100%] dark:block"
								style={{
									backgroundImage: "url(/_next/static/media/component-driven.e5869471.png)",
								}}
							/>
						</div>
						<h2 className="mt-8 font-semibold text-sky-500">Component-driven</h2>
						<p className="mt-4 text-3xl sm:text-4xl text-slate-900 font-extrabold tracking-tight dark:text-slate-50 ">Worried about duplication? Don’t&nbsp;be.</p>
						<p className="mt-4 max-w-3xl space-y-6 ">If you&apos;re repeating the same utilities over and over and over again, all you have to do is extract them into a component or template partial and boom — you&apos;ve got a single source of truth so you can make changes in one place.</p>
						<a className="group inline-flex items-center h-9 rounded-full text-sm font-semibold whitespace-nowrap px-3 focus:outline-none focus:ring-2 bg-sky-50 text-sky-600 hover:bg-sky-100 hover:text-sky-700 focus:ring-sky-600 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 dark:hover:text-white dark:focus:ring-slate-500 mt-8" href="/docs/reusing-styles">
							Learn more<span className="sr-only">, reusing styles</span>
							<svg className="overflow-visible ml-3 text-sky-300 group-hover:text-sky-400 dark:text-slate-500 dark:group-hover:text-slate-400" width={3} height={6} viewBox="0 0 3 6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
								<path d="M0 0L3 3L0 6" />
							</svg>
						</a>
						<div className="mt-10">
							<div className="flex overflow-auto -mx-4 sm:mx-0">
								<ul className="flex-none inline-grid gap-x-2 px-4 sm:px-0 xl:gap-x-6" style={{ gridTemplateColumns: "repeat(4, minmax(6rem, 1fr))" }}>
									<li>
										<button type="button" className="group text-sm font-semibold w-full flex flex-col items-center text-sky-500">
											<svg width={48} height={48} fill="none" aria-hidden="true" className="mb-6 text-sky-500">
												<path d="M30.685 27.536c-5.353 9.182-12.462 15.042-15.878 13.089-3.416-1.953-1.846-10.98 3.508-20.161 5.353-9.182 12.462-15.042 15.878-13.089 3.416 1.953 1.846 10.98-3.508 20.161Z" fill="currentColor" fillOpacity=".1" stroke="currentColor" strokeWidth={2} />
												<ellipse cx={24} cy={24} rx={7} ry={19} transform="rotate(90 24 24)" fill="currentColor" fillOpacity=".1" stroke="currentColor" strokeWidth={2} />
												<path d="M17.315 27.536c5.353 9.182 12.462 15.042 15.878 13.089 3.416-1.953 1.846-10.98-3.508-20.161-5.353-9.182-12.462-15.042-15.878-13.089-3.416 1.953-1.846 10.98 3.508 20.161Z" fill="currentColor" fillOpacity=".1" stroke="currentColor" strokeWidth={2} />
												<path d="M24 27a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" fill="currentColor" stroke="currentColor" strokeWidth={2} />
											</svg>
											React
										</button>
									</li>
									<li>
										<button type="button" className="group text-sm font-semibold w-full flex flex-col items-center ">
											<svg width={48} height={48} fill="none" aria-hidden="true" className="mb-6 text-slate-300 group-hover:text-slate-400 dark:text-slate-600 dark:group-hover:text-slate-500">
												<path d="M24 12.814 20.474 7H15l9 15 9-15h-5.476l-3.525 5.814Z" fill="currentColor" fillOpacity={0} stroke="currentColor" strokeWidth={2} strokeLinejoin="round" />
												<path d="M37.408 7 24 28.982 10.592 7H3l21 34L45 7h-7.592Z" fill="currentColor" fillOpacity={0} stroke="currentColor" strokeWidth={2} strokeLinejoin="round" />
											</svg>
											Vue
										</button>
									</li>
									<li>
										<button type="button" className="group text-sm font-semibold w-full flex flex-col items-center ">
											<svg width={48} height={48} fill="none" aria-hidden="true" className="mb-6 text-slate-300 group-hover:text-slate-400 dark:text-slate-600 dark:group-hover:text-slate-500">
												<path d="M10 35 7 12l17-7 17 7-3 23-14 8-14-8Z" fill="currentColor" fillOpacity={0} stroke="currentColor" strokeWidth={2} strokeLinejoin="round" />
												<path d="M20 25h8" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
												<path fillRule="evenodd" clipRule="evenodd" d="M32.617 31 24 13.764 15.381 31h2.236l6.382-12.764L30.381 31h2.236Z" fill="currentColor" />
											</svg>
											Angular
										</button>
									</li>
									<li>
										<button type="button" className="group text-sm font-semibold w-full flex flex-col items-center ">
											<svg width={48} height={48} fill="none" aria-hidden="true" className="mb-6 text-slate-300 group-hover:text-slate-400 dark:text-slate-600 dark:group-hover:text-slate-500">
												<path d="m7.5 10.5 6.5-3 7 3.5v16l7-4v-8l7-4 7 4v8l-7 3.5V34l-14 7.5L7.5 34V10.5Z" fill="currentColor" fillOpacity={0} />
												<path d="m7 11 7-4 7 4-7 4-7-4ZM21 11v16M21 35v7" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
												<path d="M7 11v23l14 8 14-8V19" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
												<path d="M14 15v16l7 4 21-12v-8" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
												<path d="m28 15 7-4 7 4-7 4-7-4ZM28 15v8l7 4M14 31l14-8" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
											</svg>
											Blade
										</button>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<div className="relative pt-10 xl:pt-0 mt-10 xl:mt-2">
						<div className="hidden dark:block absolute top-0 inset-x-0 h-[37.5rem] bg-gradient-to-b from-[#0c1120] top-0 xl:top-8" />
						<div className="absolute top-0 inset-x-0 bg-top bg-no-repeat GridLockup_beams-8__RRVgP top-0 xl:top-8" />
						<div className="absolute top-0 inset-x-0 h-[37.5rem] bg-grid-slate-900/[0.04] bg-top [mask-image:linear-gradient(0deg,transparent,black)] dark:bg-grid-slate-100/[0.03] dark:bg-[center_top_-1px] dark:border-t dark:border-slate-100/5 top-0 xl:top-8" />
						<div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:grid lg:grid-cols-12 lg:gap-8">
							<div className="lg:col-span-5 xl:col-span-6 flex flex-col">
								<div className="relative z-10 bg-white rounded-xl shadow-xl ring-1 ring-slate-900/5 divide-y divide-slate-100 my-auto xl:mt-18 dark:bg-slate-800 dark:divide-slate-200/5 dark:highlight-white/10">
									<nav className="py-4 px-4 sm:px-6 lg:px-4 xl:px-6 text-sm font-medium">
										<ul className="flex space-x-3">
											<li>
												<div className="px-3 py-2 rounded-md bg-sky-500 text-white cursor-pointer">
													New
													<span className="hidden sm:inline lg:hidden xl:inline"> Releases</span>
												</div>
											</li>
											<li>
												<div className="px-3 py-2 rounded-md bg-slate-50 cursor-pointer dark:bg-transparent dark:text-slate-300 dark:ring-1 dark:ring-slate-700">
													Top<span className="hidden sm:inline"> Rated</span>
												</div>
											</li>
											<li>
												<div className="px-3 py-2 rounded-md bg-slate-50 cursor-pointer dark:bg-transparent dark:text-slate-300 dark:ring-1 dark:ring-slate-700">Vincent’s Picks</div>
											</li>
										</ul>
									</nav>
									<article className="p-4 sm:p-6 lg:p-4 xl:p-6 space-x-4 items-start sm:space-x-6 lg:space-x-4 xl:space-x-6 flex">
										<img src="/_next/static/media/prognosis-negative.6897ae50.jpg" loading="lazy" decoding="async" alt="" width={60} height={88} className="flex-none rounded-md bg-slate-100" />
										<div className="min-w-0 relative flex-auto">
											<h2 className="font-semibold text-slate-900 truncate sm:pr-20 dark:text-slate-100">Prognosis Negative</h2>
											<dl className="mt-2 flex flex-wrap text-sm leading-6 font-medium">
												<div className="hidden absolute top-0 right-0 sm:flex items-center space-x-1 dark:text-slate-100">
													<dt className="text-sky-500">
														<span className="sr-only">Star rating</span>
														<svg width={16} height={20} fill="currentColor">
															<path d="M7.05 3.691c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.372 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L.98 9.483c-.784-.57-.381-1.81.587-1.81H5.03a1 1 0 00.95-.69L7.05 3.69z" />
														</svg>
													</dt>
													<dd>2.66</dd>
												</div>
												<div className="dark:text-slate-200">
													<dt className="sr-only">Rating</dt>
													<dd className="px-1.5 ring-1 ring-slate-200 rounded dark:ring-slate-600">PG-13</dd>
												</div>
												<div className="ml-2">
													<dt className="sr-only">Year</dt>
													<dd>2021</dd>
												</div>
												<div>
													<dt className="sr-only">Genre</dt>
													<dd className="flex items-center">
														<svg width={2} height={2} fill="currentColor" className="mx-2 text-slate-300" aria-hidden="true">
															<circle cx={1} cy={1} r={1} />
														</svg>
														Comedy
													</dd>
												</div>
												<div>
													<dt className="sr-only">Runtime</dt>
													<dd className="flex items-center">
														<svg width={2} height={2} fill="currentColor" className="mx-2 text-slate-300" aria-hidden="true">
															<circle cx={1} cy={1} r={1} />
														</svg>
														1h 46m
													</dd>
												</div>
												<div className="flex-none w-full mt-2 font-normal">
													<dt className="sr-only">Cast</dt>
													<dd className="text-slate-400">Simon Pegg, Zach Galifianakis</dd>
												</div>
											</dl>
										</div>
									</article>
									<article className="p-4 sm:p-6 lg:p-4 xl:p-6 space-x-4 items-start sm:space-x-6 lg:space-x-4 xl:space-x-6 flex">
										<img src="/_next/static/media/rochelle-rochelle.b97e372a.jpg" loading="lazy" decoding="async" alt="" width={60} height={88} className="flex-none rounded-md bg-slate-100" />
										<div className="min-w-0 relative flex-auto">
											<h2 className="font-semibold text-slate-900 truncate sm:pr-20 dark:text-slate-100">Rochelle, Rochelle</h2>
											<dl className="mt-2 flex flex-wrap text-sm leading-6 font-medium">
												<div className="hidden absolute top-0 right-0 sm:flex items-center space-x-1 dark:text-slate-100">
													<dt className="text-sky-500">
														<span className="sr-only">Star rating</span>
														<svg width={16} height={20} fill="currentColor">
															<path d="M7.05 3.691c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.372 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L.98 9.483c-.784-.57-.381-1.81.587-1.81H5.03a1 1 0 00.95-.69L7.05 3.69z" />
														</svg>
													</dt>
													<dd>3.25</dd>
												</div>
												<div className="dark:text-slate-200">
													<dt className="sr-only">Rating</dt>
													<dd className="px-1.5 ring-1 ring-slate-200 rounded dark:ring-slate-600">R</dd>
												</div>
												<div className="ml-2">
													<dt className="sr-only">Year</dt>
													<dd>2020</dd>
												</div>
												<div>
													<dt className="sr-only">Genre</dt>
													<dd className="flex items-center">
														<svg width={2} height={2} fill="currentColor" className="mx-2 text-slate-300" aria-hidden="true">
															<circle cx={1} cy={1} r={1} />
														</svg>
														Romance
													</dd>
												</div>
												<div>
													<dt className="sr-only">Runtime</dt>
													<dd className="flex items-center">
														<svg width={2} height={2} fill="currentColor" className="mx-2 text-slate-300" aria-hidden="true">
															<circle cx={1} cy={1} r={1} />
														</svg>
														1h 56m
													</dd>
												</div>
												<div className="flex-none w-full mt-2 font-normal">
													<dt className="sr-only">Cast</dt>
													<dd className="text-slate-400">Emilia Clarke</dd>
												</div>
											</dl>
										</div>
									</article>
									<article className="p-4 sm:p-6 lg:p-4 xl:p-6 space-x-4 items-start sm:space-x-6 lg:space-x-4 xl:space-x-6 hidden sm:flex">
										<img src="/_next/static/media/death-blow.bcfcabb1.jpg" loading="lazy" decoding="async" alt="" width={60} height={88} className="flex-none rounded-md bg-slate-100" />
										<div className="min-w-0 relative flex-auto">
											<h2 className="font-semibold text-slate-900 truncate sm:pr-20 dark:text-slate-100">Death Blow</h2>
											<dl className="mt-2 flex flex-wrap text-sm leading-6 font-medium">
												<div className="hidden absolute top-0 right-0 sm:flex items-center space-x-1 dark:text-slate-100">
													<dt className="text-sky-500">
														<span className="sr-only">Star rating</span>
														<svg width={16} height={20} fill="currentColor">
															<path d="M7.05 3.691c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.372 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L.98 9.483c-.784-.57-.381-1.81.587-1.81H5.03a1 1 0 00.95-.69L7.05 3.69z" />
														</svg>
													</dt>
													<dd>4.95</dd>
												</div>
												<div className="dark:text-slate-200">
													<dt className="sr-only">Rating</dt>
													<dd className="px-1.5 ring-1 ring-slate-200 rounded dark:ring-slate-600">18A</dd>
												</div>
												<div className="ml-2">
													<dt className="sr-only">Year</dt>
													<dd>2020</dd>
												</div>
												<div>
													<dt className="sr-only">Genre</dt>
													<dd className="flex items-center">
														<svg width={2} height={2} fill="currentColor" className="mx-2 text-slate-300" aria-hidden="true">
															<circle cx={1} cy={1} r={1} />
														</svg>
														Action
													</dd>
												</div>
												<div>
													<dt className="sr-only">Runtime</dt>
													<dd className="flex items-center">
														<svg width={2} height={2} fill="currentColor" className="mx-2 text-slate-300" aria-hidden="true">
															<circle cx={1} cy={1} r={1} />
														</svg>
														2h 5m
													</dd>
												</div>
												<div className="flex-none w-full mt-2 font-normal">
													<dt className="sr-only">Cast</dt>
													<dd className="text-slate-400">Idris Elba, John Cena, Thandiwe Newton</dd>
												</div>
											</dl>
										</div>
									</article>
								</div>
							</div>
							<div className="mt-4 -mx-4 sm:mx-0 lg:mt-0 lg:col-span-7 xl:col-span-6">
								<div className="relative overflow-hidden shadow-xl flex bg-slate-800 h-[31.625rem] max-h-[60vh] sm:max-h-[none] sm:rounded-xl lg:h-[34.6875rem] xl:h-[31.625rem] dark:bg-slate-900/70 dark:backdrop-blur dark:ring-1 dark:ring-inset dark:ring-white/10">
									<div className="relative w-full flex flex-col">
										<div className="flex-none">
											<div className="flex items-center h-8 space-x-1.5 px-3">
												<div className="w-2.5 h-2.5 bg-slate-600 rounded-full" />
												<div className="w-2.5 h-2.5 bg-slate-600 rounded-full" />
												<div className="w-2.5 h-2.5 bg-slate-600 rounded-full" />
											</div>
										</div>
										<div className="relative min-h-0 flex-auto flex flex-col">
											<div className="flex-none overflow-auto whitespace-nowrap flex" style={{ opacity: 1 }}>
												<div className="relative flex-none min-w-full px-1">
													<ul className="flex text-sm leading-6 text-slate-400">
														<li className="flex-none">
															<button type="button" className="relative py-2 px-3 text-sky-300">
																Movies.js
																<span className="absolute z-10 bottom-0 inset-x-3 h-px bg-sky-300" />
															</button>
														</li>
														<li className="flex-none">
															<button type="button" className="relative py-2 px-3 hover:text-slate-300">
																Nav.js
															</button>
														</li>
														<li className="flex-none">
															<button type="button" className="relative py-2 px-3 hover:text-slate-300">
																NavItem.js
															</button>
														</li>
														<li className="flex-none">
															<button type="button" className="relative py-2 px-3 hover:text-slate-300">
																List.js
															</button>
														</li>
														<li className="flex-none">
															<button type="button" className="relative py-2 px-3 hover:text-slate-300">
																ListItem.js
															</button>
														</li>
													</ul>
													<div className="absolute bottom-0 inset-x-0 h-px bg-slate-500/30" />
												</div>
											</div>
											<div className="w-full flex-auto flex min-h-0" style={{ opacity: 1 }}>
												<div className="w-full flex-auto flex min-h-0 overflow-auto">
													<div className="w-full relative flex-auto">
														<pre className="flex min-h-full text-sm leading-6">
															<div aria-hidden="true" className="hidden md:block text-slate-600 flex-none py-4 pr-4 text-right select-none w-[3.125rem]">
																1<br />2<br />3<br />4<br />5<br />6<br />7<br />8
																<br />9<br />
																10
																<br />
																11
																<br />
																12
																<br />
																13
																<br />
																14
																<br />
																15
																<br />
																16
																<br />
																17
																<br />
																18
																<br />
																19
																<br />
																20
																<br />
																21
																<br />
																22
															</div>
														</pre>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				<section id="dark-mode">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
						<div className="w-16 h-16 p-[0.1875rem] rounded-full ring-1 ring-slate-900/10 shadow overflow-hidden dark:bg-slate-600 dark:highlight-white/20">
							<div
								className="aspect-w-1 aspect-h-1 bg-[length:100%] dark:hidden"
								style={{
									backgroundImage: "url(/_next/static/media/dark-mode.12db1733.png)",
								}}
							/>
							<div
								className="hidden aspect-w-1 aspect-h-1 bg-[length:100%] dark:block"
								style={{
									backgroundImage: "url(/_next/static/media/dark-mode.8de2f1a4.png)",
								}}
							/>
						</div>
						<h2 className="mt-8 font-semibold text-slate-500">Dark mode</h2>
						<p className="mt-4 text-3xl sm:text-4xl text-slate-900 font-extrabold tracking-tight dark:text-slate-50 ">Now with Dark&nbsp;Mode.</p>
						<p className="mt-4 max-w-3xl space-y-6 ">
							Don’t want to be one of those websites that blinds people when they open it on their phone at 2am? Enable dark mode in your configuration file then throw{/* */} <code className="font-mono text-slate-900 font-medium dark:text-slate-200 ">dark:</code> in front of any color utility to apply it when dark mode is active. Works for background colors, text colors, border colors, and even gradients.
						</p>
						<a className="group inline-flex items-center h-9 rounded-full text-sm font-semibold whitespace-nowrap px-3 focus:outline-none focus:ring-2 bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 focus:ring-slate-500 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 dark:hover:text-white dark:focus:ring-slate-500 mt-8" href="/docs/dark-mode">
							Learn more<span className="sr-only">, dark mode</span>
							<svg className="overflow-visible ml-3 text-slate-300 group-hover:text-slate-400 dark:text-slate-500 dark:group-hover:text-slate-400" width={3} height={6} viewBox="0 0 3 6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
								<path d="M0 0L3 3L0 6" />
							</svg>
						</a>
					</div>
					<div className="relative pt-10 xl:pt-0 mt-10 xl:mt-2">
						<div className="hidden dark:block absolute top-0 inset-x-0 h-[37.5rem] bg-gradient-to-b from-[#0c1120] top-0 xl:top-8" />
						<div className="absolute top-0 inset-x-0 bg-top bg-no-repeat GridLockup_beams-5__G7h2t top-0 xl:top-8" />
						<div className="absolute top-0 inset-x-0 h-[37.5rem] bg-grid-slate-900/[0.04] bg-top [mask-image:linear-gradient(0deg,transparent,black)] dark:bg-grid-slate-100/[0.03] dark:bg-[center_top_-1px] dark:border-t dark:border-slate-100/5 top-0 xl:top-8" />
						<div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:grid lg:grid-cols-12 lg:gap-8">
							<div className="lg:col-span-5 xl:col-span-6 flex flex-col">
								<div className="relative xl:mt-18">
									<button className="relative inline-flex items-center py-1.5 px-2 rounded-full transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus:outline-none bg-cyan-500 text-cyan-200 focus-visible:ring-cyan-600" id="headlessui-switch-:R1cjpb6:" role="switch" type="button" tabIndex={0} aria-checked="false" data-headlessui-state="">
										<span className="sr-only">Disable{/* */} dark mode</span>
										<svg width={24} height={24} fill="none" aria-hidden="true" className="transform transition-transform scale-0 duration-500">
											<path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" fill="currentColor" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
											<path d="M12 4v1M18 6l-1 1M20 12h-1M18 18l-1-1M12 19v1M7 17l-1 1M5 12H4M7 7 6 6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
										</svg>
										<svg width={24} height={24} fill="none" aria-hidden="true" className="ml-3.5 transform transition-transform scale-100 duration-300">
											<path d="M18 15.63c-.977.52-1.945.481-3.13.481A6.981 6.981 0 0 1 7.89 9.13c0-1.185-.04-2.153.481-3.13C6.166 7.174 5 9.347 5 12.018A6.981 6.981 0 0 0 11.982 19c2.67 0 4.844-1.166 6.018-3.37ZM16 5c0 2.08-.96 4-3 4 2.04 0 3 .92 3 3 0-2.08.96-3 3-3-2.04 0-3-1.92-3-4Z" fill="currentColor" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
										</svg>
										<span className="absolute top-0.5 left-0.5 bg-white w-8 h-8 rounded-full flex items-center justify-center transition duration-500 transform">
											<svg width={24} height={24} fill="none" aria-hidden="true" className="flex-none transition duration-500 transform text-cyan-500 opacity-100 scale-100">
												<path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" fill="currentColor" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
												<path d="M12 4v1M18 6l-1 1M20 12h-1M18 18l-1-1M12 19v1M7 17l-1 1M5 12H4M7 7 6 6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
											</svg>
											<svg width={24} height={24} fill="none" aria-hidden="true" className="flex-none -ml-6 transition duration-500 transform text-slate-700 opacity-0 scale-0">
												<path d="M18 15.63c-.977.52-1.945.481-3.13.481A6.981 6.981 0 0 1 7.89 9.13c0-1.185-.04-2.153.481-3.13C6.166 7.174 5 9.347 5 12.018A6.981 6.981 0 0 0 11.982 19c2.67 0 4.844-1.166 6.018-3.37ZM16 5c0 2.08-.96 4-3 4 2.04 0 3 .92 3 3 0-2.08.96-3 3-3-2.04 0-3-1.92-3-4Z" fill="currentColor" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
											</svg>
										</span>
									</button>
									<div className="mt-6 sm:mt-10 relative z-10 rounded-xl shadow-xl">
										<div className="bg-white border-slate-100 transition-all duration-500 demo-dark:bg-slate-800 transition-all duration-500 demo-dark:border-slate-500 border-b rounded-t-xl p-4 pb-6 sm:p-10 sm:pb-8 lg:p-6 xl:p-10 xl:pb-8 space-y-6 sm:space-y-8 lg:space-y-6 xl:space-y-8">
											<div className="flex items-center space-x-4">
												<img src="/_next/static/media/full-stack-radio.afb14e4e.png" loading="lazy" decoding="async" alt="" width={88} height={88} className="flex-none rounded-lg bg-slate-100" />
												<div className="min-w-0 flex-auto space-y-1 font-semibold">
													<p className="text-cyan-500 transition-all duration-500 demo-dark:text-cyan-400 text-sm leading-6">
														<abbr title="Episode">Ep.</abbr> 128
													</p>
													<h2 className="text-slate-500 transition-all duration-500 demo-dark:text-slate-400 text-sm leading-6 truncate">Scaling CSS at Heroku with Utility Classes</h2>
													<p className="text-slate-900 transition-all duration-500 demo-dark:text-slate-50 text-lg">Full Stack Radio</p>
												</div>
											</div>
											<div className="space-y-2">
												<div className="relative">
													<div className="bg-slate-100 transition-all duration-500 demo-dark:bg-slate-700 rounded-full overflow-hidden">
														<div className="bg-cyan-500 transition-all duration-500 demo-dark:bg-cyan-400 w-1/2 h-2" role="progressbar" aria-label="music progress" aria-valuenow={1456} aria-valuemin={0} aria-valuemax={4550} />
													</div>
													<div className="ring-cyan-500 transition-all duration-500 demo-dark:ring-cyan-400 ring-2 absolute left-1/2 top-1/2 w-4 h-4 -mt-2 -ml-2 flex items-center justify-center bg-white rounded-full shadow">
														<div className="w-1.5 h-1.5 bg-cyan-500 transition-all duration-500 demo-dark:bg-cyan-400 rounded-full ring-1 ring-inset ring-slate-900/5" />
													</div>
												</div>
												<div className="flex justify-between text-sm leading-6 font-medium tabular-nums">
													<div className="text-cyan-500 transition-all duration-500 demo-dark:text-slate-100">24:16</div>
													<div className="text-slate-500 transition-all duration-500 demo-dark:text-slate-400">75:50</div>
												</div>
											</div>
										</div>
										<div className="bg-slate-50 text-slate-500 transition-all duration-500 demo-dark:bg-slate-600 transition-all duration-500 demo-dark:text-slate-200 rounded-b-xl flex items-center">
											<div className="flex-auto flex items-center justify-evenly">
												<button type="button" aria-label="Add to favorites">
													<svg width={24} height={24}>
														<path d="M7 6.931C7 5.865 7.853 5 8.905 5h6.19C16.147 5 17 5.865 17 6.931V19l-5-4-5 4V6.931Z" fill="currentColor" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
													</svg>
												</button>
												<button type="button" className="hidden sm:block lg:hidden xl:block" aria-label="Previous">
													<svg width={24} height={24} fill="none">
														<path d="m10 12 8-6v12l-8-6Z" fill="currentColor" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
														<path d="M6 6v12" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
													</svg>
												</button>
												<button type="button" aria-label="Rewind 10 seconds">
													<svg width={24} height={24} fill="none">
														<path d="M6.492 16.95c2.861 2.733 7.5 2.733 10.362 0 2.861-2.734 2.861-7.166 0-9.9-2.862-2.733-7.501-2.733-10.362 0A7.096 7.096 0 0 0 5.5 8.226" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
														<path d="M5 5v3.111c0 .491.398.889.889.889H9" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
													</svg>
												</button>
											</div>
											<button type="button" className="bg-white text-slate-900 transition-all duration-500 demo-dark:bg-slate-100 transition-all duration-500 demo-dark:text-slate-700 flex-none -my-2 mx-auto w-20 h-20 rounded-full ring-1 ring-slate-900/5 shadow-md flex items-center justify-center" aria-label="Pause">
												<svg width={30} height={32} fill="currentColor">
													<rect x={6} y={4} width={4} height={24} rx={2} />
													<rect x={20} y={4} width={4} height={24} rx={2} />
												</svg>
											</button>
											<div className="flex-auto flex items-center justify-evenly">
												<button type="button" aria-label="Skip 10 seconds">
													<svg width={24} height={24} fill="none">
														<path d="M17.509 16.95c-2.862 2.733-7.501 2.733-10.363 0-2.861-2.734-2.861-7.166 0-9.9 2.862-2.733 7.501-2.733 10.363 0 .38.365.711.759.991 1.176" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
														<path d="M19 5v3.111c0 .491-.398.889-.889.889H15" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
													</svg>
												</button>
												<button type="button" className="hidden sm:block lg:hidden xl:block" aria-label="Next">
													<svg width={24} height={24} fill="none">
														<path d="M14 12 6 6v12l8-6Z" fill="currentColor" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
														<path d="M18 6v12" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
													</svg>
												</button>
												<button type="button" className="rounded-lg text-xs leading-6 font-semibold px-2 ring-2 ring-inset ring-slate-500 text-slate-500 transition-all duration-500 demo-dark:text-slate-100 transition-all duration-500 demo-dark:ring-0 transition-all duration-500 demo-dark:bg-slate-500">
													1x
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="mt-4 -mx-4 sm:mx-0 lg:mt-0 lg:col-span-7 xl:col-span-6">
								<div className="relative overflow-hidden shadow-xl flex bg-slate-800 h-[31.625rem] max-h-[60vh] sm:max-h-[none] sm:rounded-xl lg:h-[34.6875rem] xl:h-[31.625rem] dark:bg-slate-900/70 dark:backdrop-blur dark:ring-1 dark:ring-inset dark:ring-white/10">
									<div className="relative w-full flex flex-col">
										<div className="flex-none border-b border-slate-500/30">
											<div className="flex items-center h-8 space-x-1.5 px-3">
												<div className="w-2.5 h-2.5 bg-slate-600 rounded-full" />
												<div className="w-2.5 h-2.5 bg-slate-600 rounded-full" />
												<div className="w-2.5 h-2.5 bg-slate-600 rounded-full" />
											</div>
										</div>
										<div className="relative min-h-0 flex-auto flex flex-col">
											<div className="w-full flex-auto flex min-h-0 overflow-auto">
												<div className="w-full relative flex-auto">
													<pre className="flex min-h-full text-sm leading-6">
														<div aria-hidden="true" className="hidden md:block text-slate-600 flex-none py-4 pr-4 text-right select-none" style={{ width: 50 }}>
															1{"\n"}2{"\n"}3{"\n"}4{"\n"}5{"\n"}6{"\n"}7{"\n"}8{"\n"}9{"\n"}10{"\n"}11{"\n"}12{"\n"}13{"\n"}14{"\n"}
															15{"\n"}16{"\n"}17{"\n"}18{"\n"}19{"\n"}20{"\n"}21
															{"\n"}22{"\n"}23{"\n"}24{"\n"}25{"\n"}26{"\n"}27{"\n"}
															28{"\n"}29{"\n"}30{"\n"}31{"\n"}32{"\n"}33{"\n"}34
															{"\n"}35{"\n"}36{"\n"}37{"\n"}38{"\n"}39{"\n"}40{"\n"}
															41{"\n"}42{"\n"}43{"\n"}44{"\n"}45{"\n"}46{"\n"}47
															{"\n"}48{"\n"}49{"\n"}50{"\n"}51{"\n"}52{"\n"}53{"\n"}
															54{"\n"}55{"\n"}56{"\n"}57{"\n"}58{"\n"}59{"\n"}60
															{"\n"}61{"\n"}62{"\n"}63{"\n"}64{"\n"}65{"\n"}66{"\n"}
															67{"\n"}68{"\n"}69{"\n"}70{"\n"}71{"\n"}72{"\n"}73
															{"\n"}74{"\n"}75{"\n"}
														</div>
													</pre>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				<section id="editor-tools">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
						<div className="w-16 h-16 p-[0.1875rem] rounded-full ring-1 ring-slate-900/10 shadow overflow-hidden dark:bg-sky-500 dark:highlight-white/20">
							<div
								className="aspect-w-1 aspect-h-1 bg-[length:100%] dark:hidden"
								style={{
									backgroundImage: "url(/_next/static/media/editor-tools.c0474b65.png)",
								}}
							/>
							<div
								className="hidden aspect-w-1 aspect-h-1 bg-[length:100%] dark:block"
								style={{
									backgroundImage: "url(/_next/static/media/editor-tools.f4b248f3.png)",
								}}
							/>
						</div>
						<h2 className="mt-8 font-semibold text-sky-500">Editor tools</h2>
						<p className="mt-4 text-3xl sm:text-4xl text-slate-900 font-extrabold tracking-tight dark:text-slate-50 ">World-class IDE integration.</p>
						<div className="mt-4 max-w-3xl space-y-6 ">
							<p>Worried about remembering all of these class names? The Tailwind CSS IntelliSense extension for VS Code has you covered.</p>
							<p>Get intelligent autocomplete suggestions, linting, class definitions and more, all within your editor and with no configuration required.</p>
						</div>
						<a className="group inline-flex items-center h-9 rounded-full text-sm font-semibold whitespace-nowrap px-3 focus:outline-none focus:ring-2 bg-sky-50 text-sky-600 hover:bg-sky-100 hover:text-sky-700 focus:ring-sky-600 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 dark:hover:text-white dark:focus:ring-slate-500 mt-8" href="/docs/intellisense">
							Learn more<span className="sr-only">, editor setup</span>
							<svg className="overflow-visible ml-3 text-sky-300 group-hover:text-sky-400 dark:text-slate-500 dark:group-hover:text-slate-400" width={3} height={6} viewBox="0 0 3 6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
								<path d="M0 0L3 3L0 6" />
							</svg>
						</a>
					</div>
					<div className="relative pt-10 xl:pt-0 mt-10">
						<div className="hidden dark:block absolute top-0 inset-x-0 h-[37.5rem] bg-gradient-to-b from-[#0c1120] top-0 xl:top-8" />
						<div className="absolute top-0 inset-x-0 bg-top bg-no-repeat GridLockup_beams-7__fKBjN top-0 xl:top-8" />
						<div className="absolute top-0 inset-x-0 h-[37.5rem] bg-grid-slate-900/[0.04] bg-top [mask-image:linear-gradient(0deg,transparent,black)] dark:bg-grid-slate-100/[0.03] dark:bg-[center_top_-1px] dark:border-t dark:border-slate-100/5 top-0 xl:top-8" />
						<div className="max-w-7xl mx-auto sm:px-6 md:px-8">
							<div className="relative">
								<img decoding="async" src="/_next/static/media/overlay.a588a288.webp" alt="" className="absolute z-10 bottom-0 -left-80 w-[45.0625rem] pointer-events-none dark:hidden" />
								<div className="relative overflow-hidden shadow-xl flex bg-slate-800 h-[31.625rem] max-h-[60vh] sm:max-h-[none] sm:rounded-xl lg:h-[34.6875rem] xl:h-[31.625rem] dark:bg-slate-900/70 dark:backdrop-blur dark:ring-1 dark:ring-inset dark:ring-white/10 !h-[39.0625rem]">
									<div className="relative w-full flex flex-col">
										<div className="flex-none border-b border-slate-500/30">
											<div className="flex items-center h-8 space-x-1.5 px-3">
												<div className="w-2.5 h-2.5 bg-slate-600 rounded-full" />
												<div className="w-2.5 h-2.5 bg-slate-600 rounded-full" />
												<div className="w-2.5 h-2.5 bg-slate-600 rounded-full" />
											</div>
										</div>
										<div className="relative min-h-0 flex-auto flex flex-col">
											<div className="flex-auto flex min-h-0">
												<div className="hidden sm:flex flex-none w-14 border-r border-slate-500/30 flex-col items-center justify-between pt-3.5 pb-4">
													<svg width={24} height={216} fill="none">
														<path d="M3 69l6-6m-2-5a7 7 0 1014 0 7 7 0 00-14 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
														<path d="M8 7H5a1 1 0 00-1 1v12a1 1 0 001 1h10a1 1 0 001-1v-3m3.707-10.293l-3.414-3.414A1 1 0 0015.586 3H9a1 1 0 00-1 1v12a1 1 0 001 1h10a1 1 0 001-1V7.414a1 1 0 00-.293-.707zM7 103a2 2 0 100-4 2 2 0 000 4zm0 0v10m10-6a2 2 0 100-4 2 2 0 000 4zm0 0a3 3 0 01-3 3h-4a3 3 0 00-3 3m0 0a2 2 0 100 4 2 2 0 000-4z" stroke="currentColor" strokeWidth="1.5" />
														<path
															d="M11.5 160.031a.75.75 0 00-1-1.118l1 1.118zm-8-1.118a.75.75 0 00-1 1.118l1-1.118zm6.972 6.149a.75.75 0 10.993-1.124l-.993 1.124zm-7.937-1.124a.75.75 0 10.993 1.124l-.993-1.124zm7.022-.368l-.64-.393.64.393zm-5.114 0l.64-.393-.64.393zM3 161.25a.75.75 0 000 1.5v-1.5zm8 1.5a.75.75 0 000-1.5v1.5zM8 147l.372-.651A.75.75 0 007.25 147H8zm14 8l.372.651a.75.75 0 000-1.302L22 155zm-14.75 0a.75.75 0 001.5 0h-1.5zm5.378 4.492a.75.75 0 10.744 1.302l-.744-1.302zM7 157.75A2.25 2.25 0 019.25 160h1.5A3.75 3.75 0 007 156.25v1.5zm0-1.5A3.75 3.75 0 003.25 160h1.5A2.25 2.25 0 017 157.75v-1.5zm2.624 3.298A5.225 5.225 0 017 160.25v1.5a6.73 6.73 0 003.376-.903l-.752-1.299zM9.25 160v.197h1.5V160h-1.5zm0 .197V162h1.5v-1.803h-1.5zM7 160.25a5.225 5.225 0 01-2.624-.702l-.752 1.299A6.73 6.73 0 007 161.75v-1.5zM4.75 162v-1.803h-1.5V162h1.5zm0-1.803V160h-1.5v.197h1.5zm5.75-1.284a5.209 5.209 0 01-.876.635l.752 1.299c.403-.234.78-.507 1.124-.816l-1-1.118zm-6.124.635a5.21 5.21 0 01-.876-.635l-1 1.118c.344.309.721.582 1.124.816l.752-1.299zm4.86 4.701c.451.212.867.487 1.236.813l.993-1.124a6.77 6.77 0 00-1.588-1.046l-.64 1.357zM9.25 162c0 .433-.122.835-.332 1.177l1.277.787A3.737 3.737 0 0010.75 162h-1.5zm-.332 1.177A2.247 2.247 0 017 164.25v1.5a3.748 3.748 0 003.195-1.786l-1.277-.787zm-5.39 1.885a5.25 5.25 0 011.235-.813l-.64-1.357a6.77 6.77 0 00-1.588 1.046l.993 1.124zM7 164.25c-.81 0-1.52-.427-1.918-1.073l-1.277.787A3.748 3.748 0 007 165.75v-1.5zm-1.918-1.073A2.235 2.235 0 014.75 162h-1.5c0 .719.203 1.392.555 1.964l1.277-.787zM4 161.25H3v1.5h1v-1.5zm7 0h-1v1.5h1v-1.5zm-3.372-13.599l14 8 .744-1.302-14-8-.744 1.302zM8.75 155v-8h-1.5v8h1.5zm12.878-.651l-9 5.143.744 1.302 9-5.143-.744-1.302z"
															fill="currentColor"
														/>
														<path d="M3 205h8m-8 0v7a1 1 0 001 1h7m-8-8v-7a1 1 0 011-1h6a1 1 0 011 1v7m0 0v8m0-8h7a1 1 0 011 1v6a1 1 0 01-1 1h-7m4-11h6a1 1 0 001-1v-6a1 1 0 00-1-1h-6a1 1 0 00-1 1v6a1 1 0 001 1z" stroke="currentColor" strokeWidth="1.5" />
													</svg>
													<svg width={24} height={72} fill="none">
														<path
															d="M10.325 52.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
															stroke="currentColor"
															strokeWidth="1.5"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
														<path d="M15 60a3 3 0 11-6 0 3 3 0 016 0zM5.121 17.804A13.936 13.936 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
													</svg>
												</div>
												<div className="flex-auto flex flex-col min-w-0">
													<div className="overflow-hidden w-full flex-auto flex min-h-0">
														<div className="w-full relative flex-auto">
															<pre className="flex min-h-full text-sm leading-6">
																<div aria-hidden="true" className="hidden md:block text-slate-600 flex-none py-4 pr-4 text-right select-none w-[3.125rem]">
																	1<br />2<br />3<br />4<br />5<br />6<br />7<br />8
																	<br />9<br />
																	10
																	<br />
																	11
																	<br />
																	12
																	<br />
																	13
																	<br />
																	14
																	<br />
																	15
																	<br />
																	16
																	<br />
																	17
																	<br />
																	18
																	<br />
																	19
																	<br />
																	20
																	<br />
																	21
																	<br />
																	22
																	<br />
																	23
																	<br />
																	24
																</div>
															</pre>
														</div>
													</div>
													<div className="border-t border-slate-500/30 font-mono text-xs leading-6 text-slate-200 p-4 space-y-2">
														<h3>Problems</h3>
														<ul className="space-y-1 text-slate-300">
															<li className="flex min-w-0">
																<svg width={24} height={24} fill="none" className="flex-none text-yellow-400">
																	<path d="m5.207 16.203 5.072-10.137c.711-1.422 2.736-1.421 3.447 0l5.067 10.137c.642 1.285-.29 2.797-1.723 2.797H6.93c-1.434 0-2.366-1.513-1.723-2.797ZM12 10v2" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
																	<path d="M12.5 16a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" stroke="currentColor" />
																</svg>
																<p className="truncate ml-1">&apos;flex&apos; applies the same CSS property as &apos;block&apos;.</p>
																<p className="hidden sm:block flex-none text-slate-500">&nbsp;{/* */}cssConflict [1, 20]</p>
															</li>
															<li className="flex min-w-0">
																<svg width={24} height={24} fill="none" className="flex-none text-yellow-400">
																	<path d="m5.207 16.203 5.072-10.137c.711-1.422 2.736-1.421 3.447 0l5.067 10.137c.642 1.285-.29 2.797-1.723 2.797H6.93c-1.434 0-2.366-1.513-1.723-2.797ZM12 10v2" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
																	<path d="M12.5 16a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" stroke="currentColor" />
																</svg>
																<p className="truncate ml-1">&apos;block&apos; applies the same CSS property as &apos;flex&apos;.</p>
																<p className="hidden sm:block flex-none text-slate-500">&nbsp;{/* */}cssConflict [1, 54]</p>
															</li>
														</ul>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
