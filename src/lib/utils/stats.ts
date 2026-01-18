// Get percent change between two numbers
export function getPercentageChange(current: number, previous: number) {
	if (previous === 0 && current === 0) return 0;
	if (previous === 0) return 100;

	return ((current - previous) / previous) * 100;
}
