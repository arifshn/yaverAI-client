import { format } from "date-fns";
import { tr } from "date-fns/locale";

/**
 * Formats a date string or Date object to a readable string with Turkish locale.
 * Automatically handles UTC dates by treating them as local if needed, or you can rely on browser's behavior.
 * 
 * @param date - Date string or Request object
 * @param formatStr - Format string (default: "d MMMM yyyy, HH:mm")
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date | null | undefined, formatStr: string = "d MMMM yyyy, HH:mm"): string => {
  if (!date) return "—";

  if (typeof date === 'string' && !date.endsWith('Z')) {
    date += 'Z';
  }

  const d = new Date(date);
  
  // Basic validation
  if (isNaN(d.getTime())) return "—";

  return format(d, formatStr, { locale: tr });
};
