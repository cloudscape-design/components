// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { MutableRefObject } from 'react';
import { useDynamicOverlap } from '../app-layout/visual-refresh/hooks/use-dynamic-overlap.js';
import styles from './styles.css.js';

interface WizardFormHeaderProps {
  children: React.ReactNode;
  isMobile: boolean;
  isVisualRefresh: boolean;
  __internalHeaderRef?: MutableRefObject<any> | null;
}

export default function WizardFormHeader({ children, isVisualRefresh, __internalHeaderRef }: WizardFormHeaderProps) {
  const overlapElement = useDynamicOverlap();

  return (
    <div
      className={clsx(
        styles['form-header'],
        isVisualRefresh && styles['form-header-refresh'],
        isVisualRefresh && 'awsui-context-content-header'
      )}
      ref={overlapElement}
    >
      <div className={clsx(styles['form-header-content'])} ref={__internalHeaderRef}>
        {children}
      </div>
    </div>
  );
}
