import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const secondsAgo = Math.floor((now - timestamp) / 1000);
  
  if (secondsAgo < 60) {
    return 'just now';
  } else if (secondsAgo < 3600) {
    const minutes = Math.floor(secondsAgo / 60);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (secondsAgo < 86400) {
    const hours = Math.floor(secondsAgo / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (secondsAgo < 604800) {
    const days = Math.floor(secondsAgo / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else {
    return new Date(timestamp).toLocaleDateString();
  }
}
