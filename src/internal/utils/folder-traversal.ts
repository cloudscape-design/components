// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Type guard to check if a FileSystemEntry is a directory entry.
 * @param entry - The FileSystemEntry to check
 * @returns true if the entry is a FileSystemDirectoryEntry
 */
export function isFileSystemDirectoryEntry(entry: FileSystemEntry | null): entry is FileSystemDirectoryEntry {
  return entry !== null && entry.isDirectory;
}

/**
 * Type guard to check if a FileSystemEntry is a file entry.
 * @param entry - The FileSystemEntry to check
 * @returns true if the entry is a FileSystemFileEntry
 */
export function isFileSystemFileEntry(entry: FileSystemEntry | null): entry is FileSystemFileEntry {
  return entry !== null && entry.isFile;
}

/**
 * Reads all entries from a FileSystemDirectoryReader.
 * The reader's readEntries method may not return all entries in a single call,
 * so we need to call it repeatedly until it returns an empty array.
 * @param reader - The FileSystemDirectoryReader to read from
 * @returns Promise resolving to array of all entries in the directory
 */
export function readDirectoryEntries(reader: FileSystemDirectoryReader): Promise<FileSystemEntry[]> {
  return new Promise((resolve, reject) => {
    const allEntries: FileSystemEntry[] = [];

    const readBatch = () => {
      reader.readEntries(
        (entries: FileSystemEntry[]) => {
          if (entries.length === 0) {
            // No more entries, we're done
            resolve(allEntries);
          } else {
            // Add entries to our collection and read more
            allEntries.push(...entries);
            readBatch();
          }
        },
        (error: DOMException) => {
          reject(error);
        }
      );
    };

    readBatch();
  });
}

/**
 * Converts a FileSystemFileEntry to a File object.
 * @param entry - The FileSystemFileEntry to convert
 * @returns Promise resolving to the File object
 */
export function fileEntryToFile(entry: FileSystemFileEntry): Promise<File> {
  return new Promise((resolve, reject) => {
    entry.file(
      (file: File) => {
        resolve(file);
      },
      (error: DOMException) => {
        reject(error);
      }
    );
  });
}

/**
 * Recursively traverses a directory and collects all files.
 * @param entry - The FileSystemDirectoryEntry to traverse
 * @returns Promise resolving to array of all files in the directory and subdirectories
 */
export async function traverseDirectory(entry: FileSystemDirectoryEntry): Promise<File[]> {
  const files: File[] = [];
  const reader = entry.createReader();
  const entries = await readDirectoryEntries(reader);

  for (const childEntry of entries) {
    if (isFileSystemFileEntry(childEntry)) {
      try {
        const file = await fileEntryToFile(childEntry);
        files.push(file);
      } catch {
        // Skip files that can't be read (e.g., permission errors)
        // Continue processing other files
      }
    } else if (isFileSystemDirectoryEntry(childEntry)) {
      try {
        const subFiles = await traverseDirectory(childEntry);
        files.push(...subFiles);
      } catch {
        // Skip directories that can't be traversed
        // Continue processing other entries
      }
    }
  }

  return files;
}

/**
 * Processes a single DataTransferItem and extracts files.
 * If the item is a folder, it recursively traverses and collects all files.
 * If the item is a file, it returns that single file.
 * @param item - The DataTransferItem to process
 * @returns Promise resolving to array of files (may be empty if item can't be processed)
 */
export async function processDataTransferItem(item: DataTransferItem): Promise<File[]> {
  // Check if webkitGetAsEntry is available for folder support
  if (item.webkitGetAsEntry) {
    const entry = item.webkitGetAsEntry();

    if (isFileSystemDirectoryEntry(entry)) {
      // It's a folder - traverse it recursively
      try {
        return await traverseDirectory(entry);
      } catch {
        // If traversal fails, return empty array
        return [];
      }
    } else if (isFileSystemFileEntry(entry)) {
      // It's a file - convert and return
      try {
        const file = await fileEntryToFile(entry);
        return [file];
      } catch {
        // If file conversion fails, try fallback
      }
    }
  }

  // Fallback: use getAsFile() for regular files
  const file = item.getAsFile();
  if (file) {
    return [file];
  }

  return [];
}

/**
 * Processes a DataTransfer object and extracts all files, including from folders.
 * This is the main entry point for handling drop events with folder support.
 * @param dataTransfer - The DataTransfer object from a drop event
 * @returns Promise resolving to array of all files
 */
export async function processDataTransfer(dataTransfer: DataTransfer): Promise<File[]> {
  const allFiles: File[] = [];
  const items = dataTransfer.items;

  // Check if DataTransferItemList is available and has items
  if (items && items.length > 0) {
    // Process each item - could be files or folders
    const itemPromises: Promise<File[]>[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      // Only process items that are files (kind === 'file')
      if (item.kind === 'file') {
        itemPromises.push(processDataTransferItem(item));
      }
    }

    const results = await Promise.all(itemPromises);
    for (const files of results) {
      allFiles.push(...files);
    }
  } else {
    // Fallback: use dataTransfer.files directly (no folder support)
    for (let i = 0; i < dataTransfer.files.length; i++) {
      allFiles.push(dataTransfer.files[i]);
    }
  }

  return allFiles;
}
