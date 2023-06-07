// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import styles from './styles.css.js';
import { useContainerQuery } from '../../hooks/container-queries';

export interface ChartResponsiveWrapperProps {
  fitHeight?: boolean;
}

export interface UseChartResponsiveWrapperProps {
  fitHeight?: boolean;
  height: number;
}

export interface UseChartResponsiveWrapperResult {
  ref?: React.Ref<any>;
  availableHeight?: number | null;

  wrapperProps?: {
    className?: string;
    style?: React.CSSProperties;
  };
}

/**
 * Wraps the entire chart content (including filters and legend) to understand how much height
 * is available in the parent container.
 * Should be used together with `useChartResponsiveWrapper`.
 */
export default function ChartResponsiveWrapper({
  fitHeight,
  children,
}: React.PropsWithChildren<ChartResponsiveWrapperProps>) {
  return fitHeight ? <div className={styles.root}>{children}</div> : <>{children}</>;
}

/**
 * Hook that allows chart components to have responsive height that corresponds to the
 * available height in the parent container.
 * Should be used together with `<ChartResponsiveWrapper>`.
 */
export function useChartResponsiveWrapper(fitHeight: boolean, height: number): UseChartResponsiveWrapperResult {
  const [availableHeight, ref] = useContainerQuery(rect => rect.height);

  return fitHeight
    ? {
        ref,
        availableHeight,
        wrapperProps: {
          className: styles.wrapper,
          style: { minHeight: height },
        },
      }
    : {};
}
