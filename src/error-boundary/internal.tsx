// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { Component, createContext, useContext, useEffect, useState } from 'react';

import { useMergeRefs } from '@cloudscape-design/component-toolkit/internal';

import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { metrics } from '../internal/metrics';
import { awsuiPluginsInternal } from '../internal/plugins/api';
import { AppLayoutErrorEntry } from '../internal/plugins/controllers/error-boundary';
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
      getAppLayoutErrors?(): ReadonlyArray<AppLayoutErrorEntry>;
      clearAppLayoutErrors?(): void;
      throwInAppLayoutPart?(appLayoutPart: string): void;
    };
  }
}

// Forces a real render throw in every mounted boundary for a given part. The resulting catch is not
// recoverable (React latches the boundary), so it has no reset counterpart — the canary reloads between
// checks. Kept local (not on the shared plugin API) so a throw never reaches boundaries in other frames.
const forcedThrowSetters = new Map<string, Set<(forced: boolean) => void>>();

function throwInAppLayoutPart(appLayoutPart: string) {
  forcedThrowSetters.get(appLayoutPart)?.forEach(setForced => setForced(true));
}

function ForcedTestError(): null {
  throw new Error('[AwsUiAppLayout] forced test error');
}

/**
 * Attaches test-only error-boundary detection hooks to the app layout root element. Used by
 * integration/canary tests, not production.
 */
export function attachAppLayoutErrorBoundaryTestHooks(node: HTMLElement | null) {
  if (!node) {
    return;
  }
  if (!node.__awsui__) {
    node.__awsui__ = {};
  }
  node.__awsui__.getAppLayoutErrors = awsuiPluginsInternal.errorBoundary.getErrors;
  node.__awsui__.clearAppLayoutErrors = awsuiPluginsInternal.errorBoundary.clearErrors;
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

  const [forcedThrow, setForcedThrow] = useState(false);
  useEffect(() => {
    if (!appLayoutPart) {
      return;
    }
    let setters = forcedThrowSetters.get(appLayoutPart);
    if (!setters) {
      setters = new Set();
      forcedThrowSetters.set(appLayoutPart, setters);
    }
    setters.add(setForcedThrow);
    return () => {
      setters.delete(setForcedThrow);
      if (setters.size === 0) {
        forcedThrowSetters.delete(appLayoutPart);
      }
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
        awsuiPluginsInternal.errorBoundary.recordError({
          appLayoutPart: appLayoutPart ?? '',
          message: error?.error?.message ?? '',
        });
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
