// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @cloudscape-design/prefer-live-region */

import clsx from 'clsx';
import React, { memo } from 'react';
import ScreenreaderOnly, { ScreenreaderOnlyProps } from '../screenreader-only/index.js';
import styles from './styles.css.js';

export interface AriaLiveTagProps extends ScreenreaderOnlyProps {
  assertive?: boolean;
  visible?: boolean;
  children: React.ReactNode;
  targetRef: React.RefObject<HTMLSpanElement>;
  sourceRef: React.RefObject<HTMLSpanElement>;
}

export default memo(AriaLiveTag);

function AriaLiveTag({
  assertive = false,
  visible = false,
  targetRef,
  sourceRef,
  children,
  ...restProps
}: AriaLiveTagProps) {
  return (
    <>
      {visible && <span ref={sourceRef}>{children}</span>}

      <ScreenreaderOnly {...restProps} className={clsx(styles.root, restProps.className)}>
        {!visible && (
          <span ref={sourceRef} aria-hidden="true">
            {children}
          </span>
        )}

        <span ref={targetRef} aria-atomic="true" aria-live={assertive ? 'assertive' : 'polite'}></span>
      </ScreenreaderOnly>
    </>
  );
}
