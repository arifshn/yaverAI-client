export const ensureUtc = (dateString: string | Date | undefined | null): Date => {
  if (!dateString) return new Date();
  
  const dateStr = typeof dateString === 'string' ? dateString : dateString.toISOString();
  
  // If explicitly ends with Z, return parsed date
  if (dateStr.endsWith('Z')) {
    return new Date(dateStr);
  }
  
  // If it has a timezone offset (+03:00 etc), return parsed date
  if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}([+-]\d{2}:?\d{2})$/.test(dateStr)) {
    return new Date(dateStr);
  }

  // Otherwise, assume it is UTC but missing Z, append Z
  return new Date(dateStr + 'Z');
};
