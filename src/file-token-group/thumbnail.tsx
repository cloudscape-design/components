// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';

import styles from './styles.css.js';

interface FileOptionThumbnailProps {
  file: File;
  setHasError: (hasError: boolean) => void;
}

export function FileOptionThumbnail({ file, setHasError }: FileOptionThumbnailProps) {
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    // The URL.createObjectURL is not available in jsdom.
    if (URL.createObjectURL) {
      const src = URL.createObjectURL(file);
      setImageSrc(src);

      return () => {
        URL.revokeObjectURL(src);
      };
    }
  }, [file]);

  return (
    <div className={styles['file-option-thumbnail']} aria-hidden={true}>
      <img
        className={styles['file-option-thumbnail-image']}
        alt={file.name}
        src={imageSrc}
        onError={({ currentTarget }) => {
          setHasError(true);
          currentTarget.onerror = null; // prevents looping
        }}
      />
    </div>
  );
}
