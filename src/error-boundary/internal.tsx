// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { Component, createContext, useContext, useState } from 'react';

import { useMergeRefs } from '@cloudscape-design/component-toolkit/internal';

import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { SomeRequired } from '../internal/types';
import { ErrorBoundaryFallback } from './fallback';
import { BuiltInErrorBoundaryProps, ErrorBoundaryProps } from './interfaces';

import styles from './styles.css.js';

// Helper methods attached to the component's root node for e2e testing.
declare global {
  interface HTMLElement {
    __awsui__?: { forceError?(): void; clearForcedError?(): void };
  }
}

const RootSuppressed = Symbol();

const ErrorBoundariesContext = createContext<
  Pick<ErrorBoundaryProps, 'renderFallback' | 'i18nStrings' | 'onError' | 'errorBoundaryId'> & {
    suppressed: boolean | typeof RootSuppressed;
  }
>({
  onError: () => {},
  suppressed: RootSuppressed,
});

interface InternalErrorBoundaryProps
  extends SomeRequired<ErrorBoundaryProps, 'suppressNested' | 'suppressible'>,
    InternalBaseComponentProps {}

export function InternalErrorBoundary({
  children,
  suppressNested,
  suppressible,
  __internalRootRef,
  ...props
}: InternalErrorBoundaryProps) {
  const context = useContext(ErrorBoundariesContext);
  const thisSuppressed = context.suppressed === true && suppressible;
  const nextSuppressed = suppressNested || thisSuppressed;

  const [forcedError, setForcedError] = useState(false);
  const setElement = (node: null | HTMLDivElement) => {
    if (node) {
      if (!node.__awsui__) {
        node.__awsui__ = {};
      }
      node.__awsui__.forceError = () => setForcedError(true);
      node.__awsui__.clearForcedError = () => setForcedError(false);
    }
  };
  const mergedRef = useMergeRefs(setElement, __internalRootRef);

  return (
    <div ref={mergedRef} className={styles['error-boundary']} data-awsui-boundary-id={props.errorBoundaryId}>
      {!thisSuppressed ? (
        <ErrorBoundaryImpl {...props} forcedError={forcedError}>
          <ErrorBoundariesContext.Provider value={{ ...props, suppressed: nextSuppressed }}>
            {children}
          </ErrorBoundariesContext.Provider>
        </ErrorBoundaryImpl>
      ) : (
        <>{children}</>
      )}
    </div>
  );
}

export function BuiltInErrorBoundary({ wrapper, suppressNested = false, children }: BuiltInErrorBoundaryProps) {
  const context = useContext(ErrorBoundariesContext);
  const thisSuppressed = context.suppressed === true || context.suppressed === RootSuppressed;
  const nextSuppressed = suppressNested || thisSuppressed;
  return !thisSuppressed ? (
    <ErrorBoundaryImpl {...context} wrapper={wrapper}>
      <ErrorBoundariesContext.Provider value={{ ...context, suppressed: nextSuppressed }}>
        {children}
      </ErrorBoundariesContext.Provider>
    </ErrorBoundaryImpl>
  ) : (
    <>{children}</>
  );
}

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryImplProps extends ErrorBoundaryProps {
  wrapper?: (content: React.ReactNode) => React.ReactNode;
  forcedError?: boolean;
}

class ErrorBoundaryImpl extends Component<ErrorBoundaryImplProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryImplProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.props.onError?.({ error, errorInfo, errorBoundaryId: this.props.errorBoundaryId });
  }

  render() {
    if (this.state.hasError || this.props.forcedError) {
      const fallback = <ErrorBoundaryFallback {...this.props} />;
      return this.props.wrapper?.(fallback) ?? fallback;
    }
    return this.props.children;
  }
}
