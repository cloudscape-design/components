// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback } from 'react';
import InternalIcon from '../../../icon/internal';
import { fireNonCancelableEvent, NonCancelableEventHandler } from '../../events';
import { I18nStrings } from './interfaces';

import styles from './styles.css.js';
import { useInternalI18n } from '../../i18n/context';
interface TokenLimitToggleProps {
  controlId?: string;
  allHidden: boolean;
  expanded: boolean;
  numberOfHiddenOptions: number;
  onClick?: NonCancelableEventHandler<null>;
  i18nStrings?: I18nStrings;
}

export default function TokenLimitToggle({
  controlId,
  allHidden,
  expanded,
  numberOfHiddenOptions,
  onClick,
  i18nStrings = {},
}: TokenLimitToggleProps) {
  const i18n = useInternalI18n('token-group');

  const numberOfHiddenOptionLabel = allHidden ? numberOfHiddenOptions : `+${numberOfHiddenOptions}`;
  const description = expanded
    ? i18n('i18nStrings.limitShowFewer', i18nStrings.limitShowFewer)
    : `${i18n('i18nStrings.limitShowMore', i18nStrings.limitShowMore) || ''} (${numberOfHiddenOptionLabel})`;

  const handleClick = useCallback(() => {
    fireNonCancelableEvent(onClick, null);
  }, [onClick]);

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={handleClick}
      aria-controls={controlId}
      aria-expanded={expanded}
    >
      <InternalIcon name={expanded ? 'treeview-collapse' : 'treeview-expand'} />
      <span className={styles.description}>{description}</span>
    </button>
  );
}
