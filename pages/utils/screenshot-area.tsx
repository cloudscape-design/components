// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { useContainerQuery } from '@cloudscape-design/component-toolkit';

import { colorTextStatusError } from '~design-tokens';

import styles from './screenshot-area.scss';

// replicates the same constant from BrowserTestTools package
const MAX_PAGE_HEIGHT = 16000;

interface ScreenshotAreaProps {
  className?: string;
  style?: React.CSSProperties;
  gutters?: boolean;
  disableAnimations?: boolean;
  children?: React.ReactNode;
}

export default function ScreenshotArea({
  className,
  style,
  gutters = true,
  disableAnimations,
  children,
}: ScreenshotAreaProps) {
  const [documentHeight, ref] = useContainerQuery(() => document.documentElement.scrollHeight);
  return (
    <section
      ref={ref}
      className={clsx('screenshot-area', className, {
        [styles.noAnimation]: disableAnimations,
        [styles.gutters]: gutters,
      })}
      style={style}
    >
      {documentHeight && documentHeight > MAX_PAGE_HEIGHT && (
        <p style={{ color: colorTextStatusError }}>
          Warning: this page has height {documentHeight}px which is above the limit {MAX_PAGE_HEIGHT}. Taking a
          screenshot of this page may not include the full content.
        </p>
      )}
      {children}
    </section>
  );
}
