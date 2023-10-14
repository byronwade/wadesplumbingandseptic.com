export function truncateString(str, maxLength) {
    if (typeof str === "string" && str.length > maxLength) {
		// Truncate the string to the specified length and add "..."
		return str.slice(0, maxLength) + "...";
	} else if (typeof str === "string") {
		// Return the original string if it's already shorter than maxLength or if it's not a string
		return str;
	} else {
		// Handle cases where str is not a string
		return "";
	}
}
