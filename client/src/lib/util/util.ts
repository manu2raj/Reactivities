import type { DateArg } from "date-fns";
import  { format } from "date-fns";
import z from "zod";

/**
 * Formats a given date into a human-readable string.
 * 
 * The date is formatted in the format: "dd MMM yyyy h:mm a"
 * where:
 * - dd: Day of the month (two digits)
 * - MMM: Abbreviated month name (e.g., Jan, Feb, Mar)
 * - yyyy: Full year (4 digits)
 * - h:mm: Hour and minute in 12-hour format
 * - a: AM/PM indicator
 * 
 * @param {DateArg<Date>} date - The date to be formatted. This can be a Date object or a date string that can be parsed into a valid Date.
 * @returns {string} A formatted string representing the given date.
 * 
 * @example
 * const formattedDate = formatDate(new Date());
 * console.log(formattedDate); // e.g., "25 Nov 2025 2:30 PM"
 */
export function formatDate(date: DateArg<Date>) {
    return format(date, 'dd MMM yyyy h:mm a');
}

export const requiredString = (fieldName: string) => z
    .string({required_error: `${fieldName} is required`})
    .min(1, {message: `${fieldName} is required`})