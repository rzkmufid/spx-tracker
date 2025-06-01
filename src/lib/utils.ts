import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format Unix timestamp to readable date
export function formatDate(timestamp: number): string {
  if (!timestamp) return 'N/A';
  
  // Convert to milliseconds (if in seconds)
  const milliseconds = timestamp > 9999999999 ? timestamp : timestamp * 1000;
  
  try {
    // Format date: "Apr 15, 2025 • 3:25 PM"
    return format(new Date(milliseconds), "MMM d, yyyy • h:mm a");
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}