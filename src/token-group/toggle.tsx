// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, Ref, useCallback } from 'react';
import InternalIcon from '../icon/internal';
import useFocusVisible from '../internal/hooks/focus-visible';
import { NonCancelableEventHandler, fireNonCancelableEvent } from '../internal/events';

import { TokenGroupProps } from './interfaces';
import styles from './styles.css.js';
export interface SelectToggleProps {
  controlId: string;
  allHidden: boolean;
  expanded: boolean;
  numberOfHiddenOptions: number;
  onClick?: NonCancelableEventHandler<null>;
  i18nStrings?: Pick<TokenGroupProps.I18nStrings, 'limitShowFewer' | 'limitShowMore'>;
}

export default forwardRef(SelectToggle);

function SelectToggle(
  { controlId, allHidden, expanded, numberOfHiddenOptions, onClick, i18nStrings = {} }: SelectToggleProps,
  ref: Ref<HTMLButtonElement>
) {
  const focusVisible = useFocusVisible();
  const numberOfHiddenOptionLabel = allHidden ? numberOfHiddenOptions : `+${numberOfHiddenOptions}`;
  const description = expanded
    ? i18nStrings.limitShowFewer
    : `${i18nStrings.limitShowMore || ''} (${numberOfHiddenOptionLabel})`;

  const handleClick = useCallback(() => {
    fireNonCancelableEvent(onClick, null);
  }, [onClick]);

  return (
    <button
      ref={ref}
      type="button"
      className={styles.toggle}
      onClick={handleClick}
      aria-controls={controlId}
      aria-expanded={expanded}
      {...focusVisible}
    >
      <InternalIcon name={expanded ? 'treeview-collapse' : 'treeview-expand'} />
      <span className={styles.description}>{description}</span>
    </button>
  );
}
