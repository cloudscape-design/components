// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { DateRangePickerProps } from './interfaces';
import InternalSegmentedControl from '../segmented-control/internal';

import styles from './styles.css.js';

interface ModeSwitcherProps extends Pick<Required<DateRangePickerProps>, 'i18nStrings'> {
  mode: 'absolute' | 'relative';
  onChange: (mode: 'absolute' | 'relative') => void;
}

export default function ModeSwitcher({ i18nStrings, mode, onChange }: ModeSwitcherProps) {
  return (
    <InternalSegmentedControl
      className={styles['mode-switch']}
      selectedId={mode}
      options={[
        { id: 'relative', text: i18nStrings.relativeModeTitle },
        { id: 'absolute', text: i18nStrings.absoluteModeTitle },
      ]}
      onChange={e => onChange(e.detail.selectedId as 'absolute' | 'relative')}
    />
  );
}
