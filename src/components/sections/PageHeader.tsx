export default function PageHeader({ tagline, title, children }) {
	return (
		<div>
			<h2 className="text-lg font-semibold leading-8 tracking-tight text-brand-600">{tagline}</h2>
			<p className="mb-4 text-4xl tracking-tight font-extrabold text-white dark:text-white">{title}</p>
			<p className="max-w-2xl text-lg leading-6 text-gray-600">{children}</p>
		</div>
	);
}
