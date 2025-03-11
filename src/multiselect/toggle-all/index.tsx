// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import CheckboxIcon from '../../internal/components/checkbox-icon';
import { Label } from '../../internal/components/option/option-parts';

import optionStyles from '../../internal/components/option/styles.css.js';
import selectableItemStyles from '../../internal/components/selectable-item/styles.css.js';
import multiSelectItemStyles from '../../select/parts/styles.css.js';
import styles from './styles.css.js';

export default function ToggleAll({ onToggle, selected }: { onToggle: () => void; selected?: boolean }) {
  const classNames = clsx(styles['toggle-all'], {
    [selectableItemStyles.selected]: selected,
  });

  return (
    <div className={classNames} onClick={onToggle}>
      <div className={selectableItemStyles['option-content']}>
        <div className={multiSelectItemStyles.item}>
          <div className={multiSelectItemStyles.checkbox}>
            <CheckboxIcon checked={selected === true} indeterminate={selected !== false} />
          </div>
          <span className={optionStyles.option}>
            <span className={optionStyles.content}>
              <span className={optionStyles['label-content']}>
                <Label label="Select all" triggerVariant={false} />
              </span>
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
