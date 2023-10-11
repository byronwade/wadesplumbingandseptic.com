import Link from "next/link";
import PropTypes from "prop-types";

function Button({ href, onClick, children, className, variant = "default", size = "medium", disabled = false, loading = false, icon, ...props }) {
	const baseStyles = "px-4 py-2 rounded"; // common styles
	let variantStyles;
	switch (variant) {
		case "primary":
			variantStyles = "bg-blue-500 text-white";
			break;
		case "secondary":
			variantStyles = "bg-gray-200 text-gray-800";
			break;
		// Add other variants as needed
		default:
			variantStyles = "bg-gray-300 text-black";
	}

	let sizeStyles;
	switch (size) {
		case "small":
			sizeStyles = "text-sm";
			break;
		case "large":
			sizeStyles = "text-lg px-6 py-3";
			break;
		// Default is medium size, no need to specify
	}

	const combinedClassName = `${baseStyles} ${variantStyles} ${sizeStyles} ${className}`;

	if (loading) {
		// If the button is in a loading state, disable it
		disabled = true;
	}

	const content = loading ? "Loading..." : children; // Adjust this as per your design

	if (href) {
		return (
			<Link href={href} {...props} className={combinedClassName} aria-disabled={disabled}>
				{icon && <span className="mr-2">{icon}</span>}
				{content}
			</Link>
		);
	}

	return (
		<button onClick={onClick} className={combinedClassName} disabled={disabled} {...props}>
			{icon && <span className="mr-2">{icon}</span>}
			{content}
		</button>
	);
}

Button.propTypes = {
	href: PropTypes.string,
	onClick: PropTypes.func,
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	variant: PropTypes.oneOf(["default", "primary", "secondary"]),
	size: PropTypes.oneOf(["small", "medium", "large"]),
	disabled: PropTypes.bool,
	loading: PropTypes.bool,
	icon: PropTypes.node, // React component for the icon
};

Button.defaultProps = {
	className: "",
	variant: "default",
	size: "medium",
	disabled: false,
	loading: false,
};

export default Button;
