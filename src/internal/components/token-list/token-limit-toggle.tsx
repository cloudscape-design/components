// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback } from 'react';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { useInternalI18n } from '../../../i18n/context.js';
import InternalIcon from '../../../icon/internal.js';
import { fireNonCancelableEvent, NonCancelableEventHandler } from '../../events/index.js';
import { GeneratedAnalyticsMetadataTokenListShowMore } from './analytics-metadata/interfaces.js';
import { I18nStrings } from './interfaces.js';

import styles from './styles.css.js';
interface TokenLimitToggleProps {
  controlId?: string;
  allHidden: boolean;
  expanded: boolean;
  numberOfHiddenOptions: number;
  onClick?: NonCancelableEventHandler<null>;
  i18nStrings?: I18nStrings;
  limitShowFewerAriaLabel?: string;
  limitShowMoreAriaLabel?: string;
}

export default function TokenLimitToggle({
  controlId,
  allHidden,
  expanded,
  numberOfHiddenOptions,
  onClick,
  i18nStrings = {},
  limitShowFewerAriaLabel,
  limitShowMoreAriaLabel,
}: TokenLimitToggleProps) {
  const i18n = useInternalI18n('token-group');

  const numberOfHiddenOptionLabel = allHidden ? numberOfHiddenOptions : `+${numberOfHiddenOptions}`;
  const description = expanded
    ? i18n('i18nStrings.limitShowFewer', i18nStrings.limitShowFewer)
    : `${i18n('i18nStrings.limitShowMore', i18nStrings.limitShowMore) || ''} (${numberOfHiddenOptionLabel})`;
  const ariaLabel = expanded ? limitShowFewerAriaLabel : limitShowMoreAriaLabel;

  const handleClick = useCallback(() => {
    fireNonCancelableEvent(onClick, null);
  }, [onClick]);

  const analyticsMetadata: GeneratedAnalyticsMetadataTokenListShowMore = {
    action: 'showMore',
    detail: {
      label: { root: 'self' },
      expanded: `${!expanded}`,
    },
  };

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={handleClick}
      aria-controls={controlId}
      aria-expanded={expanded}
      aria-label={ariaLabel}
      {...getAnalyticsMetadataAttribute(analyticsMetadata)}
    >
      <InternalIcon name={expanded ? 'treeview-collapse' : 'treeview-expand'} />
      <span className={styles.description}>{description}</span>
    </button>
  );
}
