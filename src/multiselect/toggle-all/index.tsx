// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import CheckboxIcon from '../../internal/components/checkbox-icon';

import selectableItemStyles from '../../internal/components/selectable-item/styles.css.js';
import multiSelectItemStyles from '../../select/parts/styles.css.js';
import styles from './styles.css.js';

export default function ToggleAll({
  highlighted,
  onMouseMove,
  onToggle,
  state,
}: {
  highlighted: boolean;
  onMouseMove: () => void;
  onToggle: () => void;
  state: 'all' | 'none' | 'some' | 'disabled';
}) {
  const classNames = clsx(styles['toggle-all'], {
    [styles.selected]: state === 'all',
    [styles.highlighted]: state !== 'disabled' && highlighted,
    [styles.disabled]: state === 'disabled',
  });

  return (
    <div className={classNames} onClick={onToggle} onMouseMove={onMouseMove}>
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
