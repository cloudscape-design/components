// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { Component, useContext } from 'react';

import InternalBox from '../box/internal';
import InternalButton from '../button/internal';
import { useInternalI18n } from '../i18n/context';
import InternalLink from '../link/internal';
import InternalSpaceBetween from '../space-between/internal';
import { ErrorBoundariesContext } from './context';
import { ErrorBoundaryProps } from './interfaces';

interface ErrorBoundaryState {
  hasError: boolean;
}

export default function InternalErrorBoundary({ children, ...props }: ErrorBoundaryProps) {
  const { errorBoundariesActive, ...context } = useContext(ErrorBoundariesContext);
  return errorBoundariesActive ? (
    <ErrorBoundaryImpl {...props} {...context}>
      {children}
    </ErrorBoundaryImpl>
  ) : (
    <>{children}</>
  );
}

class ErrorBoundaryImpl extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorBoundaryFallback {...this.props} />;
    }
    return this.props.children;
  }
}

function ErrorBoundaryFallback(props: ErrorBoundaryProps) {
  const image = props.customMessage?.image ?? <DefaultImage />;

  const defaultHeaderContent = useDefaultHeaderContent(props);
  const header = props.customMessage?.header ?? <InternalBox variant="h3">{defaultHeaderContent}</InternalBox>;

  const defaultDescriptionContent = useDefaultDescriptionContent(props);
  const description = props.customMessage?.description ?? <InternalBox>{defaultDescriptionContent}</InternalBox>;

  const defaultFeedbackContent = useDefaultFeedbackContent(props);
  const feedback =
    props.customMessage?.feedback ?? (props.feedbackLink ? <InternalBox>{defaultFeedbackContent}</InternalBox> : null);

  const content = (
    <InternalSpaceBetween size="xxs">
      <>{image}</>
      <>{header}</>
      <>{description}</>
      <>{feedback}</>
    </InternalSpaceBetween>
  );

  return <>{props.wrapper?.(content) ?? content}</>;
}

function DefaultImage() {
  return (
    <svg focusable={false} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="124" height="79" fill="none">
      <path
        d="M9.414 5a4 4 0 0 1 4-4h96.859a4 4 0 0 1 4 4v65.56H9.414V5Z"
        fill="#F0FBFF"
        stroke="#0F141A"
        strokeWidth="1.5"
      />
      <path
        d="M1 71.438a1 1 0 0 1 1-1h119.688a1 1 0 0 1 1 1V73a5 5 0 0 1-5 5H6a5 5 0 0 1-5-5v-1.563Z"
        fill="#F3F3F7"
        stroke="#0F141A"
        strokeWidth="1.5"
      />
      <path
        d="M53.25 71.01c0-.316.257-.573.573-.573h16.73c.316 0 .572.257.572.573a2.865 2.865 0 0 1-2.865 2.865H56.115a2.865 2.865 0 0 1-2.865-2.865ZM79 28.75H52M79 36.75H52M79 44.75H52"
        stroke="#0F141A"
        strokeWidth="1.5"
      />
      <path
        d="M104.999 53.56c9.701 0 17.559-7.867 17.559-17.56 0-9.694-7.866-17.561-17.559-17.561-9.693 0-17.56 7.867-17.56 17.56 0 9.694 7.867 17.562 17.56 17.562Z"
        fill="#DB0000"
        stroke="#0F141A"
        strokeWidth="1.5"
        strokeMiterlimit="10"
      />
      <path
        d="m107.83 36 4.285-4.203-2.777-2.832-4.34 4.257-4.34-4.257-2.778 2.832L102.166 36l-4.286 4.203 2.777 2.832 4.341-4.258 4.34 4.258 2.778-2.832L107.83 36Z"
        fill="#fff"
        stroke="#0F141A"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="46.5" cy="28.5" r="1.5" fill="#0F141A" />
      <circle cx="46.5" cy="36.5" r="1.5" fill="#0F141A" />
      <circle cx="46.5" cy="44.5" r="1.5" fill="#0F141A" />
    </svg>
  );
}

function useDefaultHeaderContent({ i18nStrings }: ErrorBoundaryProps) {
  const i18n = useInternalI18n('error-boundary');
  return i18n('i18nStrings.messageHeader', i18nStrings?.messageHeader ?? 'There was an unexpected issue');
}

function useDefaultDescriptionContent({ feedbackLink, i18nStrings }: ErrorBoundaryProps) {
  const i18n = useInternalI18n('error-boundary');
  const parsed = parseBracketLinks(
    i18n(
      'i18nStrings.messageDescription',
      i18nStrings?.messageDescription ?? 'An unexpected issue led to a crash. [Refresh](refresh) the page to try again.'
    )
  );
  return <MessageWithLinks parsed={parsed} feedbackLink={feedbackLink} />;
}

function useDefaultFeedbackContent({ feedbackLink, i18nStrings }: ErrorBoundaryProps) {
  const i18n = useInternalI18n('error-boundary');
  if (!feedbackLink) {
    return null;
  }
  const parsed = parseBracketLinks(
    i18n(
      'i18nStrings.messageFeedback',
      i18nStrings?.messageFeedback ?? 'If the issue persists, please provide us feedback [here](feedback).'
    )
  );
  return <MessageWithLinks parsed={parsed} feedbackLink={feedbackLink} />;
}

type ParsedMessage = { type: 'text'; text: string } | { type: 'link'; text: string; value: string };

function MessageWithLinks({ parsed, feedbackLink }: { parsed: ParsedMessage[]; feedbackLink?: string }) {
  return (
    <>
      {parsed.map((chunk, index) => {
        if (chunk.type === 'link' && chunk.value === 'refresh') {
          return (
            <InternalButton key={index} variant="inline-link" onClick={() => window.location.reload()}>
              {chunk.text}
            </InternalButton>
          );
        } else if (chunk.type === 'link' && chunk.value === 'feedback' && feedbackLink) {
          return (
            <InternalLink key={index} href={feedbackLink}>
              {chunk.text}
            </InternalLink>
          );
        } else if (chunk.type === 'link' && chunk.value) {
          return (
            <InternalLink key={index} href={chunk.value}>
              {chunk.text}
            </InternalLink>
          );
        } else {
          return (
            <InternalBox key={index} variant="span">
              {chunk.text}
            </InternalBox>
          );
        }
      })}
    </>
  );
}

function parseBracketLinks(input: string) {
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
