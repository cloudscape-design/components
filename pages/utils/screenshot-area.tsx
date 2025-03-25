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

  const isExceedingHeightWarning =
    documentHeight && documentHeight > MAX_PAGE_HEIGHT
      ? `Warning: this page has height ${documentHeight}px, which is above the limit of ${MAX_PAGE_HEIGHT}px.
      Taking a screenshot of this page may not include the full content. Remove ScreenshotArea if using this page for
      integration tests only, or distribute test samples into separate pages to make screenshot tests work correctly.`
      : '';

  // Reporting the excessive height as a console error makes integration and screenshot tests for this page fail.
  if (isExceedingHeightWarning) {
    console.error(isExceedingHeightWarning);
  }

  return (
    <section
      ref={ref}
      className={clsx('screenshot-area', className, {
        [styles.noAnimation]: disableAnimations,
        [styles.gutters]: gutters,
      })}
      style={style}
    >
      {isExceedingHeightWarning && <p style={{ color: colorTextStatusError }}>{isExceedingHeightWarning}</p>}
      {children}
    </section>
  );
}
