// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import CheckboxIcon from '../../internal/components/checkbox-icon';
import { HighlightType } from '../../internal/components/options-list/utils/use-highlight-option';

import selectableItemStyles from '../../internal/components/selectable-item/styles.css.js';
import multiSelectItemStyles from '../../select/parts/styles.css.js';
import styles from './styles.css.js';

export default function ToggleAll({
  highlighted,
  highlightType,
  onToggle,
  state,
}: {
  highlighted: boolean;
  highlightType: HighlightType;
  onToggle: () => void;
  state: 'all' | 'none' | 'some' | 'disabled';
}) {
  const classNames = clsx(styles['toggle-all'], {
    [styles.selected]: state === 'all',
    [styles.highlighted]: state !== 'disabled' && highlighted && highlightType.type === 'keyboard',
    [styles.disabled]: state === 'disabled',
  });

  return (
    <div className={classNames} onClick={onToggle}>
      <div className={selectableItemStyles['option-content']}>
        <div className={multiSelectItemStyles.item}>
          <div className={multiSelectItemStyles.checkbox}>
            <CheckboxIcon checked={state === 'all'} indeterminate={state === 'some'} disabled={state === 'disabled'} />
          </div>
          <span aria-disabled={state === 'disabled'}>Select all</span>
        </div>
      </div>
    </div>
  );
}
