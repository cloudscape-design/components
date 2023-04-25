// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { useMergeRefs } from '../internal/hooks/use-merge-refs/index.js';
import { StickyStateModel, useWrapperStyles } from './sticky-state-model.js';

export interface TableWrapperProps {
  children: React.ReactNode;
  className: string;
  wrapperRef: React.RefCallback<any> | null;
  onScroll?: React.UIEventHandler<HTMLDivElement>;
  wrapperProps: any;
  stickyState: StickyStateModel;
}

const TableWrapper = ({ children, className, wrapperRef, onScroll, wrapperProps, stickyState }: TableWrapperProps) => {
  const wrapperStyles = useWrapperStyles({ stickyState });
  const ref = useMergeRefs(wrapperRef, wrapperStyles.ref);
  return (
    <div ref={ref} className={className} style={wrapperProps.style} onScroll={onScroll} {...wrapperProps}>
      {children}
    </div>
  );
};

export default TableWrapper;
