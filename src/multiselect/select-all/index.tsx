// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef } from 'react';
import clsx from 'clsx';

import CheckboxIcon from '../../internal/components/checkbox-icon';
import { HighlightType } from '../../internal/components/options-list/utils/use-highlight-option';
import { BaseKeyDetail, CancelableEventHandler, fireKeyboardEvent } from '../../internal/events';

import selectableItemStyles from '../../internal/components/selectable-item/styles.css.js';
import multiSelectItemStyles from '../../select/parts/styles.css.js';
import styles from './styles.css.js';

export default forwardRef(function ToggleAll(
  {
    disabled,
    highlighted,
    highlightType,
    menuId,
    onMouseMove,
    onKeyDown,
    onToggle,
    state,
  }: {
    disabled: boolean;
    highlighted: boolean;
    highlightType: HighlightType;
    menuId: string;
    onKeyDown: CancelableEventHandler<BaseKeyDetail>;
    onMouseMove: () => void;
    onToggle: () => void;
    state: 'all' | 'none' | 'some';
  },
  ref: React.Ref<HTMLDivElement>
) {
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
    <div
      className={classNames}
      onClick={onToggle}
      onKeyDown={event => fireKeyboardEvent(onKeyDown, event)}
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
        <span aria-disabled={disabled}>Select all</span>
      </div>
    </div>
  );
});
