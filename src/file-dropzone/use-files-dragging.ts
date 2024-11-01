// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useState } from 'react';

/**
 * A utility to determine whether or not a file is being currently dragged into the window.
 *
 * @returns An object with the following arguments:
 * `areFilesDragging`: True if a file is being dragged over the current window, false otherwise.
 */
export function useFilesDragging() {
  const [areFilesDragging, setFilesDragging] = useState(false);

  // Registering global drag events listeners.
  useEffect(() => {
    // The timer helps avoiding dropzone blinking.
    let dragTimer: null | ReturnType<typeof setTimeout> = null;

    // The file-upload dropzone is shown when the user drags files over to the browser.
    const onDocumentDragOver = (event: DragEvent) => {
      event.preventDefault();

      let files = 0;
      for (let item = 0; item < (event.dataTransfer?.types.length || 0); item++) {
        if (event.dataTransfer?.types[item] === 'Files') {
          files++;
        }
      }

      if (files > 0) {
        setFilesDragging(true);
        dragTimer && clearTimeout(dragTimer);
      }
    };

    // When the files are no longer dragged over the browser the state must be reset.
    const onDocumentDragLeave = (event: DragEvent) => {
      event.preventDefault();

      dragTimer = setTimeout(() => setFilesDragging(false), 25);
    };

    // If the files were dropped the state must be reset.
    const onDocumentDrop = (event: DragEvent) => {
      event.preventDefault();

      dragTimer = setTimeout(() => setFilesDragging(false), 25);
    };

    document.addEventListener('dragover', onDocumentDragOver, false);
    document.addEventListener('dragleave', onDocumentDragLeave, false);
    document.addEventListener('drop', onDocumentDrop, false);

    return () => {
      dragTimer && clearTimeout(dragTimer);
      document.removeEventListener('dragover', onDocumentDragOver);
      document.removeEventListener('dragleave', onDocumentDragLeave);
      document.removeEventListener('drop', onDocumentDrop);
    };
  }, []);

  return { areFilesDragging };
}
