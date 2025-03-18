// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef } from 'react';
import clsx from 'clsx';

import CheckboxIcon from '../../internal/components/checkbox-icon';
import { HighlightType } from '../../internal/components/options-list/utils/use-highlight-option';
import { getId } from './utils';

import selectableItemStyles from '../../internal/components/selectable-item/styles.css.js';
import multiSelectItemStyles from '../../select/parts/styles.css.js';
import styles from './styles.css.js';

const SelectAll = forwardRef(
  (
    {
      disabled,
      highlighted,
      highlightType,
      menuId,
      onMouseMove,
      onToggle,
      state,
      text,
    }: {
      disabled: boolean;
      highlighted: boolean;
      highlightType: HighlightType;
      menuId: string;
      onMouseMove: () => void;
      onToggle: () => void;
      state: 'all' | 'none' | 'some';
      text?: string;
    },
    ref: React.Ref<HTMLLIElement>
  ) => {
    const classNames = clsx(styles['select-all'], selectableItemStyles['selectable-item'], {
      [selectableItemStyles.selected]: state === 'all',
      [selectableItemStyles.highlighted]: highlighted,
      [selectableItemStyles['is-keyboard']]: highlightType.type === 'keyboard',
      [selectableItemStyles.disabled]: disabled,
      [styles.selected]: state === 'all',
      [styles.highlighted]: highlighted,
      [styles.disabled]: disabled,
    });

    return (
      <li
        className={classNames}
        id={getId(menuId)}
        onClick={onToggle}
        onMouseMove={onMouseMove}
        role="checkbox"
        aria-checked={state === 'all' ? true : state === 'some' ? 'mixed' : false}
        aria-controls={menuId}
        tabIndex={-1}
        ref={ref}
      >
        <div className={multiSelectItemStyles.item}>
          <div className={multiSelectItemStyles.checkbox}>
            <CheckboxIcon checked={state === 'all'} indeterminate={state === 'some'} disabled={disabled} />
          </div>
          <span aria-disabled={disabled}>{text}</span>
        </div>
      </li>
    );
  }
);

export default SelectAll;
