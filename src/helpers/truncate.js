export function truncateString(str, maxLength) {
	if (str.length > maxLength) {
		// Truncate the string to the specified length and add "..."
		return str.slice(0, maxLength) + "...";
	} else {
		// Return the original string if it's already shorter than maxLength
		return str;
	}
}
