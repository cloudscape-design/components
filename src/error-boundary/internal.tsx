// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { Component, createContext, useContext, useState } from 'react';
import clsx from 'clsx';

import { useMergeRefs } from '@cloudscape-design/component-toolkit/internal';

import InternalAlert from '../alert/internal';
import InternalBox from '../box/internal';
import InternalButton from '../button/internal';
import { useInternalI18n } from '../i18n/context';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import InternalLink from '../link/internal';
import { ErrorBoundaryProps } from './interfaces';
import { refreshPage } from './utils';

import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

declare global {
  interface HTMLElement {
    __awsui?: { forceError?(): void; removeForcedError?(): void };
  }
}

const RootSuppressed = Symbol();

const ErrorBoundariesContext = createContext<
  Pick<ErrorBoundaryProps, 'fallback' | 'feedback' | 'i18nStrings' | 'onError'> & {
    suppressed: boolean | typeof RootSuppressed;
  }
>({
  onError: () => {},
  suppressed: RootSuppressed,
});

interface InternalErrorBoundaryProps extends ErrorBoundaryProps, InternalBaseComponentProps {}

export function InternalErrorBoundary({
  children,
  suppressNested = false,
  __internalRootRef,
  ...props
}: InternalErrorBoundaryProps) {
  const context = useContext(ErrorBoundariesContext);
  const thisSuppressed = context.suppressed === true;
  const nextSuppressed = suppressNested || thisSuppressed;

  const [forcedError, setForcedError] = useState(false);
  const setElement = (node: null | HTMLDivElement) => {
    if (node) {
      if (!node.__awsui) {
        node.__awsui = {};
      }
      node.__awsui.forceError = () => setForcedError(true);
      node.__awsui.removeForcedError = () => setForcedError(false);
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

interface BuiltInErrorBoundaryProps {
  /**
   * A custom renderer for the fallback component that is used to define extra margins.
   */
  renderFallback?: (fallback: React.ReactNode) => React.ReactNode;
  suppressNested?: boolean;
  children: React.ReactNode;
}

export function BuiltInErrorBoundary({ renderFallback, suppressNested = false, children }: BuiltInErrorBoundaryProps) {
  const context = useContext(ErrorBoundariesContext);
  const thisSuppressed = context.suppressed === true || context.suppressed === RootSuppressed;
  const nextSuppressed = suppressNested || thisSuppressed;
  return !thisSuppressed ? (
    <ErrorBoundaryImpl {...context} renderFallback={renderFallback}>
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
  renderFallback?: (fallback: React.ReactNode) => React.ReactNode;
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
    this.props.onError?.(error, errorInfo, { errorBoundaryId: this.props.errorBoundaryId });
  }

  render() {
    if (this.state.hasError || this.props.forcedError) {
      return <ErrorBoundaryFallback {...this.props} />;
    }
    return this.props.children;
  }
}

const i18nFallback = {
  headerText: 'Unexpected error, content failed to show',
  descriptionText: 'You can refresh the page to try again.',
  refreshActionText: 'Refresh page',
};

function ErrorBoundaryFallback(props: ErrorBoundaryImplProps) {
  const custom = props.fallback?.();
  const content = (
    <InternalAlert
      type="error"
      header={
        <div className={clsx(styles.header, testUtilStyles.header)}>
          {custom?.header ?? <DefaultHeaderContent {...props} />}
        </div>
      }
      action={
        <div className={clsx(styles.action, testUtilStyles.action)}>
          {custom?.action === undefined ? <DefaultActionContent {...props} /> : custom?.action}
        </div>
      }
      className={testUtilStyles.fallback}
    >
      <div className={clsx(styles.description, testUtilStyles.description)}>
        {custom?.description ?? <DefaultDescriptionContent {...props} />}
      </div>
    </InternalAlert>
  );
  return <>{props.renderFallback?.(content) ?? content}</>;
}

function DefaultHeaderContent({ i18nStrings }: ErrorBoundaryImplProps) {
  const i18n = useInternalI18n('error-boundary');
  const defaultHeaderContent = i18n('i18nStrings.headerText', i18nStrings?.headerText) ?? i18nFallback.headerText;
  return <>{defaultHeaderContent}</>;
}

function DefaultDescriptionContent({ i18nStrings, feedback }: ErrorBoundaryImplProps) {
  const i18n = useInternalI18n('error-boundary');

  const feedbackActionText =
    feedback?.href || feedback?.onClick
      ? i18n('i18nStrings.feedbackActionText', i18nStrings?.feedbackActionText)
      : undefined;
  const feedbackActionMarkdown = feedbackActionText ? `[${feedbackActionText}](feedback)` : undefined;

  const parsed = parseMarkdownLinks(
    i18n('i18nStrings.descriptionText', i18nStrings?.descriptionText?.(feedbackActionMarkdown), format =>
      format({ feedbackAction: feedbackActionMarkdown ?? 'null' })
    ) ?? i18nFallback.descriptionText
  );

  return (
    <InternalBox>
      {parsed.map((chunk, index) => {
        if (chunk.type === 'link' && chunk.value === 'feedback' && feedback?.href) {
          return (
            <InternalLink key={index} href={feedback?.href} className={testUtilStyles['feedback-action']}>
              {chunk.text}
            </InternalLink>
          );
        } else if (chunk.type === 'link' && chunk.value === 'feedback' && feedback?.onClick) {
          return (
            <InternalButton
              key={index}
              variant="inline-link"
              onClick={feedback.onClick}
              className={testUtilStyles['feedback-action']}
            >
              {chunk.text}
            </InternalButton>
          );
        } else {
          return (
            <InternalBox key={index} variant="span">
              {chunk.text}
            </InternalBox>
          );
        }
      })}
    </InternalBox>
  );
}

function DefaultActionContent({ i18nStrings }: ErrorBoundaryImplProps) {
  const i18n = useInternalI18n('error-boundary');
  const refreshActionText =
    i18n('i18nStrings.refreshActionText', i18nStrings?.refreshActionText) ?? i18nFallback.refreshActionText;
  return (
    <InternalButton iconName="refresh" onClick={refreshPage} className={testUtilStyles['refresh-action']}>
      {refreshActionText}
    </InternalButton>
  );
}

type ParsedMessage = { type: 'text'; text: string } | { type: 'link'; text: string; value: string };

function parseMarkdownLinks(input: string) {
  const chunks: ParsedMessage[] = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g; // [text](value)
  let last = 0;
  let match;

  while ((match = regex.exec(input)) !== null) {
    // Text before the link.
    if (match.index > last) {
      chunks.push({ type: 'text', text: input.slice(last, match.index) });
    }
    // Link chunk.
    chunks.push({ type: 'link', text: match[1], value: match[2] });
    last = regex.lastIndex;
  }
  // Text after the link.
  if (last < input.length) {
    chunks.push({ type: 'text', text: input.slice(last) });
  }
  return chunks;
}
