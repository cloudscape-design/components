// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
import styles from './styles.css.js';

interface FileOptionThumbnailProps {
  file: File;
}

export function FileOptionThumbnail({ file }: FileOptionThumbnailProps) {
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
    const src = URL.createObjectURL(file);
    setImageSrc(src);

    return () => {
      URL.revokeObjectURL(src);
    };
  }, [file]);

  const onImageLoad = () => {
    URL.revokeObjectURL(imageSrc);
  };

  return (
    <div className={styles['file-option-thumbnail']} aria-hidden={true}>
      <img className={styles['file-option-thumbnail-image']} alt={file.name} src={imageSrc} onLoad={onImageLoad} />
    </div>
  );
}
