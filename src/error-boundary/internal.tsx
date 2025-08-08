// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { Component, createContext, useContext } from 'react';

import InternalAlert from '../alert/internal';
import InternalBox from '../box/internal';
import InternalButton from '../button/internal';
import { useInternalI18n } from '../i18n/context';
import InternalLink from '../link/internal';
import { ErrorBoundaryProps } from './interfaces';

const ErrorBoundariesContext = createContext<Omit<ErrorBoundaryProps, 'children'>>({ onError: null });

export function InternalErrorBoundary({ children, ...props }: ErrorBoundaryProps) {
  return props.onError ? (
    <ErrorBoundaryImpl {...props}>
      <ErrorBoundariesContext.Provider value={props}>{children}</ErrorBoundariesContext.Provider>
    </ErrorBoundaryImpl>
  ) : (
    <>{children}</>
  );
}

interface BuiltInErrorBoundaryProps {
  /**
   * Same as onError=null.
   */
  suppressed?: boolean;
  /**
   * A custom renderer for the fallback component that is used to define extra margins.
   */
  renderFallback?: (fallback: React.ReactNode) => React.ReactNode;
  children: React.ReactNode;
}

export function BuiltInErrorBoundary({ suppressed, renderFallback, children }: BuiltInErrorBoundaryProps) {
  const props = useContext(ErrorBoundariesContext);
  return props.onError && !suppressed ? (
    <ErrorBoundaryImpl {...props} renderFallback={renderFallback}>
      {children}
    </ErrorBoundaryImpl>
  ) : (
    <>{children}</>
  );
}

export function BuiltInSuppressErrorBoundaries({ children }: { children: React.ReactNode }) {
  return <ErrorBoundariesContext.Provider value={{ onError: null }}>{children}</ErrorBoundariesContext.Provider>;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryImplProps extends ErrorBoundaryProps {
  renderFallback?: (fallback: React.ReactNode) => React.ReactNode;
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
    this.props.onError?.(error, errorInfo);
  }

  render() {
    return !this.state.hasError ? this.props.children : <ErrorBoundaryFallback {...this.props} />;
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
      header={custom?.header ?? <DefaultHeaderContent {...props} />}
      action={custom?.action === undefined ? <DefaultActionContent {...props} /> : custom?.action}
    >
      {custom?.description ?? <DefaultDescriptionContent {...props} />}
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

  const feedbackActionText = feedback
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
            <InternalLink key={index} href={feedback?.href}>
              {chunk.text}
            </InternalLink>
          );
        } else if (chunk.type === 'link' && chunk.value === 'feedback' && feedback?.onClick) {
          return (
            <InternalButton key={index} variant="inline-link" onClick={feedback.onClick}>
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
    <InternalButton iconName="refresh" onClick={() => window.location.reload()}>
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
