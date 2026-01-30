import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine multiple class values into a single class string and resolve Tailwind class conflicts.
 *
 * @param inputs - Class values (strings, arrays, objects, etc.) to combine
 * @returns The merged class name string with conflicting Tailwind classes resolved
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}