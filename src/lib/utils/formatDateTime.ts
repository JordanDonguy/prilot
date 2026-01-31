export function formatDateTime(date: string | Date) {
	return new Date(date).toLocaleString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	});
}

export function formatDateTimeForErrors(date: number | string | Date) {
	const dateToformat = new Date(date);

	// Format date
	const formattedDate = `${dateToformat.toLocaleDateString("en-US", {
		month: "long", // "e.g. February"
		day: "numeric",
	})}, ${dateToformat.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true, // "01:00 AM"
	})}`;

	return formattedDate;
}
