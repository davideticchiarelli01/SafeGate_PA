/**
 * Parses a date string into a Date object.
 * If it's an endDate and contains only the date part, sets time to 23:59:59.999.
 * Returns `undefined` if input is missing or invalid.
 *
 * @param inputDate - The date string to parse.
 * @param isEndDate - Whether this is an end date (default: false).
 */
export function normalizeDate(inputDate?: string, isEndDate = false): Date | undefined {
    if (!inputDate) return undefined;

    const date = new Date(inputDate);
    if (isNaN(date.getTime())) return undefined; // invalid date

    if (!inputDate.includes('T') && isEndDate) {
        date.setHours(23, 59, 59, 999);
    }

    return date;
}
