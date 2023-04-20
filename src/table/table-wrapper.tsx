// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { useReaction } from '../area-chart/model/async-store.js';
import { StickyStateModel } from './sticky-state-model.js';
export interface TableWrapperProps {
  children: React.ReactNode;
  className: string;
  wrapperRef: React.RefObject<HTMLDivElement> | null;
  onScroll?: React.UIEventHandler<HTMLDivElement>;
  wrapperProps: any;
  stickyState: StickyStateModel;
}

const TableWrapper = ({ children, className, wrapperRef, onScroll, wrapperProps, stickyState }: TableWrapperProps) => {
  useReaction(
    stickyState.store,
    state => state.scrollPaddingLeft,
    scrollPaddingLeft => {
      if (wrapperRef && wrapperRef.current) {
        wrapperRef.current.style.scrollPaddingLeft = scrollPaddingLeft + 'px';
      }
    }
  );

  // TODO: Fix merged ref
  useReaction(
    stickyState.store,
    state => state.scrollPaddingRight,
    scrollPaddingRight => {
      if (wrapperRef && wrapperRef.current) {
        wrapperRef.current.style.scrollPaddingRight = scrollPaddingRight + 'px';
      }
    }
  );
  return (
    <div
      ref={wrapperRef}
      className={className}
      onScroll={e => {
        onScroll?.(e);
        stickyState.handlers.onWrapperScroll();
      }}
      {...wrapperProps}
    >
      {children}
    </div>
  );
};

export default TableWrapper;
