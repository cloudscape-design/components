// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { Component, createContext, useContext, useEffect, useState } from 'react';

import { useMergeRefs } from '@cloudscape-design/component-toolkit/internal';

import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { metrics } from '../internal/metrics';
import { SomeRequired } from '../internal/types';
import { ErrorBoundaryFallback } from './fallback';
import { AppLayoutBuiltInErrorBoundaryProps, BuiltInErrorBoundaryProps, ErrorBoundaryProps } from './interfaces';

import styles from './styles.css.js';

// Helper methods attached to the component's root node for e2e testing.
declare global {
  interface HTMLElement {
    __awsui__?: {
      forceError?(): void;
      clearForcedError?(): void;
      // App layout error-boundary detection hooks (see attachAppLayoutErrorBoundaryTestHooks).
      getAppLayoutErrors?(): ReadonlyArray<AppLayoutErrorEntry>;
      clearAppLayoutErrors?(): void;
      throwInAppLayoutPart?(appLayoutPart: string): void;
    };
  }
}

export interface AppLayoutErrorEntry {
  appLayoutPart: string;
  message: string;
}

// Errors caught by app layout built-in error boundaries, recorded so that integration/canary tests
// can assert on real boundary catches instead of scraping the console. Not for production consumption.
const appLayoutErrors: AppLayoutErrorEntry[] = [];

function recordAppLayoutError(entry: AppLayoutErrorEntry) {
  appLayoutErrors.push(entry);
}

function getAppLayoutErrors(): ReadonlyArray<AppLayoutErrorEntry> {
  return appLayoutErrors.slice();
}

function clearAppLayoutErrors() {
  appLayoutErrors.length = 0;
}

// Per-part trigger that forces a real render throw inside the matching app layout boundary. Used by the
// production canary positive-control test to verify that a genuine caught error is still detectable. The
// resulting catch is not recoverable (React latches the boundary), so the canary reloads between checks.
const forcedThrowSetters = new Map<string, (forced: boolean) => void>();

function throwInAppLayoutPart(appLayoutPart: string) {
  forcedThrowSetters.get(appLayoutPart)?.(true);
}

function ForcedTestError(): null {
  throw new Error('[AwsUiAppLayout] forced test error');
}

/**
 * Attaches the app layout error-boundary detection hooks to a DOM element (the app layout root).
 * These are test-only helpers: integration/canary tests read caught errors via `getAppLayoutErrors`
 * and can trigger a real, boundary-caught throw via `throwInAppLayoutPart`.
 */
export function attachAppLayoutErrorBoundaryTestHooks(node: HTMLElement | null) {
  if (!node) {
    return;
  }
  if (!node.__awsui__) {
    node.__awsui__ = {};
  }
  node.__awsui__.getAppLayoutErrors = getAppLayoutErrors;
  node.__awsui__.clearAppLayoutErrors = clearAppLayoutErrors;
  node.__awsui__.throwInAppLayoutPart = throwInAppLayoutPart;
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

export function AppLayoutBuiltInErrorBoundary({
  wrapper,
  suppressNested = false,
  children,
  renderFallback = () => <></>,
  appLayoutPart,
}: AppLayoutBuiltInErrorBoundaryProps) {
  const context = useContext(ErrorBoundariesContext);
  const thisSuppressed = context.suppressed === true || context.suppressed === RootSuppressed;
  const nextSuppressed = suppressNested || thisSuppressed;

  // Test-only: allow the canary positive-control to force a real throw inside this boundary.
  const [forcedThrow, setForcedThrow] = useState(false);
  useEffect(() => {
    if (!appLayoutPart) {
      return;
    }
    forcedThrowSetters.set(appLayoutPart, setForcedThrow);
    return () => {
      forcedThrowSetters.delete(appLayoutPart);
    };
  }, [appLayoutPart]);

  return (
    <ErrorBoundaryImpl
      {...context}
      wrapper={wrapper}
      renderFallback={renderFallback}
      className={styles['app-layout-part-fallback']}
      onError={error => {
        context?.onError?.(error);
        recordAppLayoutError({ appLayoutPart: appLayoutPart ?? '', message: error?.error?.message ?? '' });
        metrics.sendOpsMetricObject('awsui-app-layout-error-boundary-fired', {
          errorMessage: error?.error?.message ?? '',
          appLayoutPart: appLayoutPart ?? '',
        });
      }}
    >
      <ErrorBoundariesContext.Provider value={{ ...context, suppressed: nextSuppressed, renderFallback }}>
        {forcedThrow && <ForcedTestError />}
        {children}
      </ErrorBoundariesContext.Provider>
    </ErrorBoundaryImpl>
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
