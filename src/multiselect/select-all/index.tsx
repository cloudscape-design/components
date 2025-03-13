// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import CheckboxIcon from '../../internal/components/checkbox-icon';

import selectableItemStyles from '../../internal/components/selectable-item/styles.css.js';
import multiSelectItemStyles from '../../select/parts/styles.css.js';
import styles from './styles.css.js';

export default function ToggleAll({
  disabled,
  highlighted,
  onMouseMove,
  onToggle,
  state,
}: {
  disabled: boolean;
  highlighted: boolean;
  onMouseMove: () => void;
  onToggle: () => void;
  state: 'all' | 'none' | 'some';
}) {
  const classNames = clsx(styles['select-all'], selectableItemStyles['selectable-item'], {
    [selectableItemStyles.selected]: state === 'all',
    [selectableItemStyles.highlighted]: highlighted,
    [selectableItemStyles.disabled]: disabled,
    [styles.selected]: state === 'all',
    [styles.highlighted]: highlighted,
    [styles.disabled]: disabled,
  });

  return (
    <div className={classNames} onClick={onToggle} onMouseMove={onMouseMove}>
      <div className={multiSelectItemStyles.item}>
        <div className={multiSelectItemStyles.checkbox}>
          <CheckboxIcon checked={state === 'all'} indeterminate={state === 'some'} disabled={disabled} />
        </div>
        <span aria-disabled={disabled}>Select all</span>
      </div>
    </div>
  );
}
