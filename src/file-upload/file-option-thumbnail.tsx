// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useRef } from 'react';
import styles from './styles.css.js';

interface FileOptionThumbnailProps {
  file: File;
}

export function FileOptionThumbnail({ file }: FileOptionThumbnailProps) {
  const thumbnailRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (thumbnailRef.current && thumbnailRef.current.src) {
        thumbnailRef.current.src = reader.result as string;
      }
    };
    reader.readAsDataURL(file);
  }, [file]);

  return (
    <div className={styles['file-option-thumbnail']} aria-hidden={true}>
      <img className={styles['file-option-thumbnail-image']} alt={file.name} ref={thumbnailRef} src="" />
    </div>
  );
}
