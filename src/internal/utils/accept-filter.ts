// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Parsed accept pattern types
 */
interface ParsedPatterns {
  extensions: string[];
  mimeTypes: string[];
  wildcardMimeTypes: string[];
}

/**
 * Parses a comma-separated accept string into categorized patterns.
 * @param accept - The accept string (e.g., ".jpg,.png,image/*,application/pdf")
 * @returns Parsed patterns categorized by type
 */
export function parseAcceptPatterns(accept: string): ParsedPatterns {
  const extensions: string[] = [];
  const mimeTypes: string[] = [];
  const wildcardMimeTypes: string[] = [];

  if (!accept || accept.trim() === '') {
    return { extensions, mimeTypes, wildcardMimeTypes };
  }

  const patterns = accept.split(',').map(p => p.trim().toLowerCase());

  for (const pattern of patterns) {
    if (!pattern) {
      continue;
    }

    if (pattern.startsWith('.')) {
      // File extension pattern (e.g., ".jpg", ".png")
      extensions.push(pattern);
    } else if (pattern.endsWith('/*')) {
      // Wildcard MIME type pattern (e.g., "image/*", "audio/*")
      wildcardMimeTypes.push(pattern.slice(0, -2)); // Remove "/*" to get the type prefix
    } else if (pattern.includes('/')) {
      // Specific MIME type pattern (e.g., "image/jpeg", "application/pdf")
      mimeTypes.push(pattern);
    }
  }

  return { extensions, mimeTypes, wildcardMimeTypes };
}

/**
 * Extracts the file extension from a filename.
 * @param filename - The filename to extract extension from
 * @returns The extension including the dot (e.g., ".jpg"), or empty string if none
 */
function getFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1 || lastDotIndex === filename.length - 1) {
    return '';
  }
  return filename.slice(lastDotIndex).toLowerCase();
}

/**
 * Checks if a file matches any of the specified extensions.
 * @param file - The file to check
 * @param extensions - Array of extensions to match (e.g., [".jpg", ".png"])
 * @returns true if the file matches any extension
 */
export function matchesExtension(file: File, extensions: string[]): boolean {
  if (extensions.length === 0) {
    return false;
  }

  const fileExtension = getFileExtension(file.name);
  if (!fileExtension) {
    return false;
  }

  return extensions.some(ext => ext.toLowerCase() === fileExtension);
}

/**
 * Checks if a file matches any of the specified MIME types.
 * Supports both exact MIME types and wildcard patterns.
 * @param file - The file to check
 * @param mimeTypes - Array of exact MIME types (e.g., ["image/jpeg"])
 * @param wildcardMimeTypes - Array of wildcard type prefixes (e.g., ["image"])
 * @returns true if the file matches any MIME type pattern
 */
export function matchesMimeType(file: File, mimeTypes: string[], wildcardMimeTypes: string[] = []): boolean {
  const fileMimeType = file.type.toLowerCase();

  // Check exact MIME type matches
  if (mimeTypes.length > 0 && mimeTypes.some(mime => mime === fileMimeType)) {
    return true;
  }

  // Check wildcard MIME type matches (e.g., "image/*" matches "image/jpeg")
  if (wildcardMimeTypes.length > 0 && fileMimeType) {
    const fileTypePrefix = fileMimeType.split('/')[0];
    if (wildcardMimeTypes.some(prefix => prefix === fileTypePrefix)) {
      return true;
    }
  }

  return false;
}

/**
 * Checks if a file matches the accept criteria.
 * @param file - The file to check
 * @param accept - The accept string (e.g., ".jpg,.png", "image/*")
 * @returns true if the file matches any pattern, or if accept is undefined/empty
 */
export function matchesAccept(file: File, accept: string | undefined): boolean {
  // If no accept criteria, all files match
  if (!accept || accept.trim() === '') {
    return true;
  }

  const { extensions, mimeTypes, wildcardMimeTypes } = parseAcceptPatterns(accept);

  // If no valid patterns were parsed, accept all files
  if (extensions.length === 0 && mimeTypes.length === 0 && wildcardMimeTypes.length === 0) {
    return true;
  }

  // File matches if it matches ANY of the patterns (OR logic)
  return matchesExtension(file, extensions) || matchesMimeType(file, mimeTypes, wildcardMimeTypes);
}

/**
 * Filters an array of files by accept criteria.
 * @param files - Array of files to filter
 * @param accept - The accept string (e.g., ".jpg,.png", "image/*")
 * @returns Filtered array of files matching the accept criteria
 */
export function filterByAccept(files: File[], accept: string | undefined): File[] {
  // If no accept criteria, return all files
  if (!accept || accept.trim() === '') {
    return files;
  }

  return files.filter(file => matchesAccept(file, accept));
}
