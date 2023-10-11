export default function Loading() {
	return (
		<div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
			<div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
			<h2 className="text-center text-white text-xl font-semibold">Loading...</h2>
			<p className="w-1/3 text-center text-white">This may take a few seconds, please dont close this page.</p>
		</div>
	);
}

export function LoadingSkel() {
	return (
		<div role="status" className="space-y-2.5 animate-pulse max-w-lg">
			<div className="flex items-center w-full space-x-2">
				<div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32" />
				<div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24" />
				<div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full" />
			</div>
			<div className="flex items-center w-full space-x-2 max-w-[480px]">
				<div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full" />
				<div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full" />
				<div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24" />
			</div>
			<div className="flex items-center w-full space-x-2 max-w-[400px]">
				<div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full" />
				<div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-80" />
				<div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full" />
			</div>
			<div className="flex items-center w-full space-x-2 max-w-[480px]">
				<div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full" />
				<div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full" />
				<div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24" />
			</div>
			<div className="flex items-center w-full space-x-2 max-w-[440px]">
				<div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-32" />
				<div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24" />
				<div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full" />
			</div>
			<div className="flex items-center w-full space-x-2 max-w-[360px]">
				<div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full" />
				<div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-80" />
				<div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full" />
			</div>
			<span className="sr-only">Loading...</span>
		</div>
	);
}
