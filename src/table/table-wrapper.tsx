// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { useReaction } from '../area-chart/model/async-store.js';
import { useMergeRefs } from '../internal/hooks/use-merge-refs/index.js';
import { StickyStateModel } from './sticky-state-model.js';
export interface TableWrapperProps {
  children: React.ReactNode;
  className: string;
  wrapperRef: React.RefCallback<any> | null;
  onScroll?: React.UIEventHandler<HTMLDivElement>;
  wrapperProps: any;
  stickyState: StickyStateModel;
}

const TableWrapper = ({ children, className, wrapperRef, onScroll, wrapperProps, stickyState }: TableWrapperProps) => {
  const wrapperAccessRef = React.useRef<HTMLElement>(null) as React.MutableRefObject<HTMLElement | null>;

  useReaction(
    stickyState.store,
    state => state.scrollPaddingLeft,
    scrollPaddingLeft => {
      if (wrapperAccessRef && wrapperAccessRef.current) {
        wrapperAccessRef.current.style.scrollPaddingLeft = scrollPaddingLeft + 'px';
      }
    }
  );
  useReaction(
    stickyState.store,
    state => state.scrollPaddingRight,
    scrollPaddingRight => {
      if (wrapperAccessRef && wrapperAccessRef.current) {
        wrapperAccessRef.current.style.scrollPaddingRight = scrollPaddingRight + 'px';
      }
    }
  );
  const ref = useMergeRefs(wrapperAccessRef, wrapperRef);
  return (
    <div
      ref={ref}
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
