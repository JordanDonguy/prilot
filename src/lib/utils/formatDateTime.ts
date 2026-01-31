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

// Format date in Month day, time. "e.g. February 5, 01:00 AM"
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

// Format seconds in minutes:seconds
export function formatMinutesSeconds(seconds: number) {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;

	if (mins > 0) {
		return `${mins}min ${secs}s`;
	}
	return `${secs}s`;
}
