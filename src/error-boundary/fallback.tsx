// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import clsx from 'clsx';
import IntlMessageFormat from 'intl-messageformat';

import InternalAlert from '../alert/internal';
import InternalButton from '../button/internal';
import { useInternalI18n } from '../i18n/context';
import { getBaseProps } from '../internal/base-component';
import { ErrorBoundaryProps } from './interfaces';
import { refreshPage } from './utils';

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
    action: (
      <div className={clsx(styles.action, testUtilStyles.action)}>
        <DefaultActionContent i18nStrings={i18nStrings} />
      </div>
    ),
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

function DefaultDescriptionContent({
  i18nStrings: { descriptionText, components: { Feedback } = {} } = {},
}: {
  i18nStrings: ErrorBoundaryProps.I18nStrings;
}) {
  const i18n = useInternalI18n('error-boundary');

  // Dependencies for the intl-format function, where the pseudo-tags are declared as functions from parsed chunks.
  const formatArgs = Feedback
    ? {
        hasFeedback: true,
        Feedback: (chunks: React.ReactNode[]) => (
          <span className={testUtilStyles['feedback-action']}>
            <Feedback>{chunks[0] ?? ''}</Feedback>
          </span>
        ),
      }
    : { hasFeedback: false, Feedback: () => <></> };

  // This ensures that the description string provided via i18nStrings also supports the <Feedback> injection,
  // because the i18n() helper propagates the second argument as is, without applying intl-format to it.
  // We wrap the format with try-catch to avoid intl errors caused by incorrectly referenced components.
  function safeFormat(descriptionText?: string) {
    try {
      return descriptionText ? new IntlMessageFormat(descriptionText).format(formatArgs) : undefined;
    } catch {
      return descriptionText;
    }
  }
  const message = i18n('i18nStrings.descriptionText', safeFormat(descriptionText), format => format(formatArgs));

  // When the description includes <Feedback>, then the translated message is represented as an array of strings and
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
