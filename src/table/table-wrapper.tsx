// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

export interface TableWrapperProps {
  children: React.ReactNode;
  className: string;
  wrapperRef: React.RefCallback<any> | null;
  onScroll?: React.UIEventHandler<HTMLDivElement>;
  wrapperProps: any;
}

const TableWrapper = ({ children, className, wrapperRef, onScroll, wrapperProps }: TableWrapperProps) => {
  return (
    <div ref={wrapperRef} className={className} onScroll={onScroll} {...wrapperProps}>
      {children}
    </div>
  );
};

export default TableWrapper;
