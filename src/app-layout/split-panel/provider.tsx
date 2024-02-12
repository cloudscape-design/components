// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';
import { getLimitedValue } from '../../split-panel/utils/size-utils';
import { SplitPanelContextBaseProps, SplitPanelContextProvider } from '../../internal/context/split-panel-context';

export interface SplitPanelProviderProps extends SplitPanelContextBaseProps {
  getMaxWidth: () => number;
  getMaxHeight: () => number;
  children?: React.ReactNode;
}

const MIN_HEIGHT = 160;
const MIN_WIDTH = 280;

export function SplitPanelProvider({
  children,
  size,
  getMaxHeight,
  getMaxWidth,
  onResize,
  ...rest
}: SplitPanelProviderProps) {
  const { position, reportSize, isOpen } = rest;
  const minSize = position === 'bottom' ? MIN_HEIGHT : MIN_WIDTH;
  const [relativeSize, setRelativeSize] = useState(0);
  const [maxSize, setMaxSize] = useState(size);
  const cappedSize = getLimitedValue(minSize, size, maxSize);

  const onResizeWithValidation = (newSize: number) => {
    const maxSize = position === 'side' ? getMaxWidth() : getMaxHeight();
    const isResizeValid = position === 'side' ? maxSize >= MIN_WIDTH : maxSize >= MIN_HEIGHT;
    if (isOpen && isResizeValid) {
      onResize(getLimitedValue(minSize, newSize, maxSize));
    }
  };

  useEffect(() => {
    // effects are called inside out in the components tree
    // wait one frame to allow app-layout to complete its calculations
    const handle = requestAnimationFrame(() => {
      const maxSize = position === 'bottom' ? getMaxHeight() : getMaxWidth();
      setRelativeSize(((size - minSize) / (maxSize - minSize)) * 100);
      setMaxSize(maxSize);
    });
    return () => cancelAnimationFrame(handle);
  }, [size, minSize, position, getMaxHeight, getMaxWidth]);

  useEffect(() => {
    reportSize(cappedSize);
  }, [reportSize, cappedSize]);

  useEffect(() => {
    const handler = () => setMaxSize(position === 'bottom' ? getMaxHeight() : getMaxWidth());
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [position, getMaxWidth, getMaxHeight]);

  return (
    <SplitPanelContextProvider value={{ ...rest, size: cappedSize, relativeSize, onResize: onResizeWithValidation }}>
      {children}
    </SplitPanelContextProvider>
  );
}
