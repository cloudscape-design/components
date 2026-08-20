// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import clsx from 'clsx';

import InternalAlert from '../alert/internal';
import InternalButton from '../button/internal';
import { useInternalI18n } from '../i18n/context';
import { formatMessage } from '../i18n/utils/icu-parser';
import { getBaseProps } from '../internal/base-component';
import { ErrorBoundaryProps } from './interfaces';
import { canUseRefresh, refreshPage } from './utils';

import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

export function ErrorBoundaryFallback({
  i18nStrings = {},
  renderFallback,
  ...props
}: Pick<ErrorBoundaryProps, 'renderFallback' | 'i18nStrings'>) {
  const baseProps = getBaseProps(props);
  const defaultSlots = {
    header: (
      <div className={clsx(styles.header, testUtilStyles.header)}>
        <DefaultHeaderContent i18nStrings={i18nStrings} />
      </div>
    ),
    description: (
      <div className={clsx(styles.description, testUtilStyles.description)}>
        <DefaultDescriptionContent i18nStrings={i18nStrings} />
      </div>
    ),
    action: canUseRefresh() ? (
      <div className={clsx(styles.action, testUtilStyles.action)}>
        <DefaultActionContent i18nStrings={i18nStrings} />
      </div>
    ) : null,
  };
  return (
    <div {...baseProps} className={clsx(baseProps.className, testUtilStyles.fallback)}>
      {renderFallback?.(defaultSlots) ?? (
        <InternalAlert type="error" header={defaultSlots.header} action={defaultSlots.action}>
          {defaultSlots.description}
        </InternalAlert>
      )}
    </div>
  );
}

function DefaultHeaderContent({ i18nStrings }: { i18nStrings: ErrorBoundaryProps.I18nStrings }) {
  const i18n = useInternalI18n('error-boundary');
  return <>{i18n('i18nStrings.headerText', i18nStrings?.headerText)}</>;
}

/**
 * Format a message string that may contain XML-like pseudo-tag placeholders
 * (e.g. `<Feedback>text</Feedback>`) and return an array of React nodes.
 *
 * The `components` map must supply a wrapper component for each tag name.
 * Only self-closing or paired tags with a single text body are supported —
 * which covers all current Cloudscape error-boundary messages.
 */
function formatWithComponents(
  message: string,
  components: Record<string, (children: React.ReactNode) => React.ReactNode>
): React.ReactNode[] {
  const result: React.ReactNode[] = [];
  // Match <TagName>...</TagName> blocks.
  const tagPattern = /<([A-Z][A-Za-z]*)>(.*?)<\/\1>/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tagPattern.exec(message)) !== null) {
    // Text before the tag.
    if (match.index > lastIndex) {
      result.push(message.slice(lastIndex, match.index));
    }
    const tagName = match[1];
    const inner = match[2];
    const wrapper = components[tagName];
    result.push(wrapper ? wrapper(inner) : inner);
    lastIndex = tagPattern.lastIndex;
  }

  // Remaining text after the last tag.
  if (lastIndex < message.length) {
    result.push(message.slice(lastIndex));
  }

  return result;
}

function DefaultDescriptionContent({
  i18nStrings: { descriptionText, components: { Feedback } = {} } = {},
}: {
  i18nStrings: ErrorBoundaryProps.I18nStrings;
}) {
  const i18n = useInternalI18n('error-boundary');

  const componentMap: Record<string, (children: React.ReactNode) => React.ReactNode> = Feedback
    ? {
        Feedback: (children: React.ReactNode) => (
          <span className={testUtilStyles['feedback-action']}>
            <Feedback>{children}</Feedback>
          </span>
        ),
      }
    : {};

  const hasFeedback = Boolean(Feedback);

  // Resolve the ICU select to a plain string, then expand pseudo-tags.
  function safeFormat(rawMessage?: string): React.ReactNode[] | string | undefined {
    if (!rawMessage) {
      return undefined;
    }
    try {
      // First pass: resolve ICU (select/plural/simple substitution).
      const resolved = formatMessage(rawMessage, { hasFeedback: String(hasFeedback) });
      // Second pass: expand XML-like pseudo-tags into React nodes.
      if (Object.keys(componentMap).length > 0) {
        return formatWithComponents(resolved, componentMap);
      }
      return resolved;
    } catch {
      return rawMessage;
    }
  }

  const message = i18n('i18nStrings.descriptionText', safeFormat(descriptionText), format => {
    // customHandler path: the message came from the i18n provider.
    // `format` here is `(args) => string`, but we need rich-text output.
    // We call format with the hasFeedback arg to resolve the ICU select,
    // then expand pseudo-tags ourselves.
    const resolved = format({ hasFeedback: String(hasFeedback) } as never);
    return formatWithComponents(resolved, componentMap);
  });

  // When the description includes <Feedback>, the message is an array of strings and
  // React elements that require keys when rendering to avoid React warnings.
  return (
    <>
      {Array.isArray(message) ? message.map((chunk, i) => <React.Fragment key={i}>{chunk}</React.Fragment>) : message}
    </>
  );
}

function DefaultActionContent({ i18nStrings }: { i18nStrings?: ErrorBoundaryProps.I18nStrings }) {
  const i18n = useInternalI18n('error-boundary');
  return (
    <InternalButton iconName="refresh" onClick={refreshPage} className={testUtilStyles['refresh-action']}>
      {i18n('i18nStrings.refreshActionText', i18nStrings?.refreshActionText)}
    </InternalButton>
  );
}
